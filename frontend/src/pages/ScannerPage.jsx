import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  FileImage,
  Check,
  Loader2,
  Sparkles,
  Calendar,
  Building2,
  IndianRupee,
  FolderOpen,
  AlertCircle,
  Hash,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useToast } from '@/hooks/use-toast';
import { getAllCategories } from '@/services/categoryApi';
import { createExpense } from '@/services/expenseApi';
import Tesseract from 'tesseract.js';

// ─────────────────────────────────────────────────────────────────────────────
// RECEIPT PARSER — extracts structured data from raw OCR text
// Returns { merchant, billNumber, date, amount, tax, confidence }
// confidence: 'high' | 'low' | 'none' per field
// ─────────────────────────────────────────────────────────────────────────────

function parseReceiptText(rawText) {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const fullText = lines.join('\n');

  // ── Helper: strip non-numeric chars except dot
  const parseAmount = (str) => {
    const cleaned = str.replace(/[₹Rs.,\s]/gi, '').replace(/,/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  // ── 1. MERCHANT NAME ─────────────────────────────────────────────────────
  // Take first meaningful line (length > 2, not a number-only line)
  let merchant = '';
  let merchantConfidence = 'none';
  const skipPatterns = /^(receipt|invoice|bill|tax invoice|gst invoice|date|no\.|number|phone|tel|mob|address|gstin|cin|pan|www\.|http)/i;
  const numberOnly = /^[\d\s\.\-\/\:]+$/;

  for (const line of lines.slice(0, 8)) {
    if (line.length > 2 && !numberOnly.test(line) && !skipPatterns.test(line)) {
      merchant = line.replace(/[*_|]/g, '').trim();
      merchantConfidence = merchant.length > 2 ? 'high' : 'low';
      break;
    }
  }

  // ── 2. BILL / INVOICE NUMBER ──────────────────────────────────────────────
  let billNumber = '';
  let billConfidence = 'none';
  const billPatterns = [
    /(?:bill\s*(?:no|number|#)?|invoice\s*(?:no|number|#)?|receipt\s*(?:no|number|#)?|order\s*(?:no|number|#)?)\s*[:\-]?\s*([A-Z0-9\-\/]+)/i,
    /\b(IN-\d+)\b/i,
    /\b(INV-\d+)\b/i,
    /\b(REC-\d+)\b/i,
    /\b(ORD-\d+)\b/i,
    /(?:no|#)\s*[:\-]?\s*([A-Z0-9\-\/]{3,15})\b/i,
  ];
  for (const pattern of billPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      billNumber = match[1].trim();
      billConfidence = 'high';
      break;
    }
  }

  // ── 3. DATE ───────────────────────────────────────────────────────────────
  let date = '';
  let dateConfidence = 'none';

  const monthMap = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };

  // Patterns ordered by specificity
  const datePatterns = [
    // "23-Jan-2025" or "23 Jan 2025" or "23/Jan/2025"
    {
      re: /(\d{1,2})[\s\-\/]([A-Za-z]{3,9})[\s\-\/](\d{4})/,
      fn: (m) => {
        const mon = monthMap[m[2].toLowerCase().slice(0, 3)];
        return mon ? `${m[3]}-${mon}-${m[1].padStart(2, '0')}` : null;
      },
    },
    // "Jan 23, 2025" or "January 23 2025"
    {
      re: /([A-Za-z]{3,9})[\s](\d{1,2})[,\s]+(\d{4})/,
      fn: (m) => {
        const mon = monthMap[m[1].toLowerCase().slice(0, 3)];
        return mon ? `${m[3]}-${mon}-${m[2].padStart(2, '0')}` : null;
      },
    },
    // "23/01/2025" or "23-01-2025"
    {
      re: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
      fn: (m) => `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`,
    },
    // "2025/01/23" or "2025-01-23"
    {
      re: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
      fn: (m) => `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`,
    },
    // "23.01.25" short year
    {
      re: /(\d{1,2})\.(\d{1,2})\.(\d{2})\b/,
      fn: (m) => `20${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`,
    },
  ];

  for (const { re, fn } of datePatterns) {
    const match = fullText.match(re);
    if (match) {
      const result = fn(match);
      if (result) {
        // Validate that result is a plausible date
        const d = new Date(result);
        if (!isNaN(d.getTime()) && d.getFullYear() >= 2000 && d.getFullYear() <= 2099) {
          date = result;
          dateConfidence = 'high';
          break;
        }
      }
    }
  }

  // ── 4. AMOUNTS — pick GRAND TOTAL ─────────────────────────────────────────
  // Priority: Grand Total > Total Amount > Total > Net Amount > largest number
  let amount = '';
  let amountConfidence = 'none';

  const totalPatterns = [
    /grand\s*total\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /total\s*amount\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /amount\s*payable\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /net\s*(?:total|amount)\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /payable\s*amount\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /\btotal\b\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /balance\s*due\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /amount\s*due\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
  ];

  for (const pattern of totalPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      const num = parseAmount(match[1]);
      if (num !== null && num > 0) {
        amount = String(num);
        amountConfidence = 'high';
        break;
      }
    }
  }

  // Fallback: scan each line for a ₹ sign followed by a number, pick the largest
  if (!amount) {
    const rupeePattern = /[₹Rs.]\s*([\d,]+\.?\d*)/g;
    let largest = 0;
    let match;
    while ((match = rupeePattern.exec(fullText)) !== null) {
      const num = parseAmount(match[1]);
      if (num !== null && num > largest) {
        largest = num;
      }
    }
    if (largest > 0) {
      amount = String(largest);
      amountConfidence = 'low';
    }
  }

  // ── 5. TAX ────────────────────────────────────────────────────────────────
  let tax = '';
  const taxPatterns = [
    /(?:gst|tax|vat|cgst|sgst|igst)\s*(?:total|amount)?\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
    /(?:total\s*(?:gst|tax))\s*[:\-]?\s*[₹Rs.]?\s*([\d,]+\.?\d*)/i,
  ];
  for (const pattern of taxPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      const num = parseAmount(match[1]);
      if (num !== null && num > 0) {
        tax = String(num);
        break;
      }
    }
  }

  return {
    merchant,
    merchantConfidence,
    billNumber,
    billConfidence,
    date,
    dateConfidence,
    amount,
    amountConfidence,
    tax,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Confidence badge helper
// ─────────────────────────────────────────────────────────────────────────────
function ConfidenceBadge({ confidence }) {
  if (confidence === 'high') {
    return (
      <Badge className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
        <Check className="w-3 h-3 mr-1" /> Detected
      </Badge>
    );
  }
  if (confidence === 'low') {
    return (
      <Badge className="ml-2 text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
        <AlertTriangle className="w-3 h-3 mr-1" /> Low confidence — please verify
      </Badge>
    );
  }
  return (
    <Badge className="ml-2 text-xs bg-muted text-muted-foreground">
      Not detected — enter manually
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const FIXED_CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Education', 'Investments', 'Other',
];

const emptyExtracted = {
  merchant: '', merchantConfidence: 'none',
  billNumber: '', billConfidence: 'none',
  date: '', dateConfidence: 'none',
  amount: '', amountConfidence: 'none',
  tax: '',
  category: '',
};

export function ScannerPage() {
  const { toast } = useToast();

  const [uploadedFile, setUploadedFile]     = useState(null);
  const [uploadedFileObj, setUploadedFileObj] = useState(null);
  const [ocrProgress, setOcrProgress]       = useState(0);
  const [ocrStatus, setOcrStatus]           = useState('idle'); // idle | uploading | ocr | parsing | done | error
  const [ocrRawText, setOcrRawText]         = useState('');
  const [extractedData, setExtractedData]   = useState(emptyExtracted);
  const [isSaving, setIsSaving]             = useState(false);
  const [userCategories, setUserCategories] = useState([]);

  // Load user's custom categories from backend
  useEffect(() => {
    getAllCategories()
      .then((res) => setUserCategories(res.data || []))
      .catch(() => setUserCategories([]));
  }, []);

  // Merged category list: user DB categories + fixed fallbacks
  const allCategories = [
    ...userCategories.map((c) => c.name),
    ...FIXED_CATEGORIES.filter(
      (f) => !userCategories.some((c) => c.name.toLowerCase() === f.toLowerCase())
    ),
  ];

  // ── File upload handler ──────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset
    setOcrRawText('');
    setExtractedData(emptyExtracted);
    setOcrProgress(0);
    setOcrStatus('uploading');
    setUploadedFile(URL.createObjectURL(file));
    setUploadedFileObj(file);

    await runOCR(file);
  };

  // ── Drag-and-drop handler ────────────────────────────────────────────────
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setOcrRawText('');
    setExtractedData(emptyExtracted);
    setOcrProgress(0);
    setOcrStatus('uploading');
    setUploadedFile(URL.createObjectURL(file));
    setUploadedFileObj(file);
    await runOCR(file);
  };

  // ── Core OCR function using Tesseract.js ─────────────────────────────────
  const runOCR = async (file) => {
    setOcrStatus('ocr');
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const rawText = result.data.text;
      setOcrRawText(rawText);

      setOcrStatus('parsing');
      await new Promise((r) => setTimeout(r, 300)); // brief pause for UI

      const parsed = parseReceiptText(rawText);
      setExtractedData({ ...emptyExtracted, ...parsed });
      setOcrStatus('done');
    } catch (err) {
      console.error('OCR failed:', err);
      setOcrStatus('error');
      toast({
        title: 'OCR Failed',
        description: 'Could not read the image. Please try a clearer photo.',
        variant: 'destructive',
      });
    }
  };

  // ── Re-scan (retry OCR on the same file) ────────────────────────────────
  const handleRescan = async () => {
    if (!uploadedFileObj) return;
    setExtractedData(emptyExtracted);
    setOcrProgress(0);
    await runOCR(uploadedFileObj);
  };

  // ── Save expense to backend ──────────────────────────────────────────────
  const handleSaveExpense = async () => {
    if (!extractedData.merchant.trim()) {
      toast({ title: 'Missing field', description: 'Please enter a merchant name.', variant: 'destructive' });
      return;
    }
    if (!extractedData.amount || parseFloat(extractedData.amount) <= 0) {
      toast({ title: 'Missing field', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }
    if (!extractedData.date) {
      toast({ title: 'Missing field', description: 'Please enter the expense date.', variant: 'destructive' });
      return;
    }

    try {
      setIsSaving(true);
      await createExpense({
        title:       extractedData.merchant,
        amount:      parseFloat(extractedData.amount),
        category:    extractedData.category || 'Other',
        expenseDate: extractedData.date,
        description: extractedData.billNumber
          ? `Bill No: ${extractedData.billNumber}${extractedData.tax ? ` | Tax: ₹${extractedData.tax}` : ''}`
          : extractedData.tax
          ? `Tax: ₹${extractedData.tax}`
          : '',
      });
      toast({ title: 'Expense saved!', description: `₹${extractedData.amount} from ${extractedData.merchant} added.` });
      handleReset();
    } catch (err) {
      console.error('Save failed:', err);
      toast({
        title: 'Save failed',
        description: err?.response?.data?.message || 'Could not save expense. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setUploadedFile(null);
    setUploadedFileObj(null);
    setOcrRawText('');
    setExtractedData(emptyExtracted);
    setOcrProgress(0);
    setOcrStatus('idle');
  };

  const isProcessing = ocrStatus === 'uploading' || ocrStatus === 'ocr' || ocrStatus === 'parsing';
  const isDone       = ocrStatus === 'done';
  const isError      = ocrStatus === 'error';

  // ── OCR status label ─────────────────────────────────────────────────────
  const statusLabel = {
    idle:     '',
    uploading:'Loading image…',
    ocr:      `Performing OCR… ${ocrProgress}%`,
    parsing:  'Parsing receipt data…',
    done:     'Extraction complete',
    error:    'OCR failed',
  }[ocrStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Receipt Scanner</h1>
          <p className="text-muted-foreground">Upload a receipt — real OCR extracts the details automatically</p>
        </div>
      </div>

      {/* Upload Area */}
      {!uploadedFile && (
        <Card
          className="border-2 border-dashed border-muted-foreground/25 hover:border-emerald-500/50 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-lg">Drop your receipt here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>
              <label htmlFor="file-upload">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                  <span>
                    <FileImage className="w-4 h-4" />
                    Choose File
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, WEBP (Max 10MB) · OCR powered by Tesseract.js
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing / Results Layout */}
      {uploadedFile && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* Left — Image Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Receipt Preview</CardTitle>
                {isDone && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3 h-3 mr-1" /> Processed
                  </Badge>
                )}
                {isError && (
                  <Badge variant="destructive">OCR Failed</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <img
                  src={uploadedFile}
                  alt="Receipt preview"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* OCR Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    {statusLabel}
                  </div>
                  {ocrStatus === 'ocr' && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Raw OCR toggle — helps debugging */}
              {isDone && ocrRawText && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    View raw OCR text
                  </summary>
                  <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto max-h-48 whitespace-pre-wrap">
                    {ocrRawText}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleReset}>
                  Upload Different Receipt
                </Button>
                {(isDone || isError) && (
                  <Button variant="outline" size="sm" onClick={handleRescan} className="gap-1">
                    <RefreshCw className="w-4 h-4" /> Re-scan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right — Extracted Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Extracted Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Status banner */}
              {isProcessing && (
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-cyan-500 animate-spin flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Running OCR…</p>
                    <p className="text-xs text-muted-foreground">{statusLabel}</p>
                  </div>
                </div>
              )}

              {isDone && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">OCR extraction complete</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Review and edit fields before saving. Undetected fields are left blank.
                  </p>
                </div>
              )}

              {isError && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="font-medium">Could not read receipt</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a clearer, well-lit photo. You can also enter details manually below.
                  </p>
                </div>
              )}

              {/* ── Fields ── */}
              <div className="space-y-4">

                {/* Merchant */}
                <div className="space-y-1">
                  <Label htmlFor="merchant" className="flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    Merchant Name
                    {!isProcessing && <ConfidenceBadge confidence={extractedData.merchantConfidence} />}
                  </Label>
                  <Input
                    id="merchant"
                    placeholder="e.g. SLEEK BILL"
                    value={extractedData.merchant}
                    className={cn(
                      extractedData.merchantConfidence === 'low' &&
                        'border-amber-400 focus-visible:ring-amber-400'
                    )}
                    onChange={(e) => setExtractedData({ ...extractedData, merchant: e.target.value })}
                  />
                </div>

                {/* Bill Number */}
                <div className="space-y-1">
                  <Label htmlFor="billNumber" className="flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    Bill / Invoice Number
                    {!isProcessing && <ConfidenceBadge confidence={extractedData.billConfidence} />}
                  </Label>
                  <Input
                    id="billNumber"
                    placeholder="e.g. IN-15"
                    value={extractedData.billNumber}
                    onChange={(e) => setExtractedData({ ...extractedData, billNumber: e.target.value })}
                  />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Date
                    {!isProcessing && <ConfidenceBadge confidence={extractedData.dateConfidence} />}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={extractedData.date}
                    className={cn(
                      extractedData.dateConfidence === 'low' &&
                        'border-amber-400 focus-visible:ring-amber-400'
                    )}
                    onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                  />
                </div>

                {/* Amount (Grand Total) */}
                <div className="space-y-1">
                  <Label htmlFor="amount" className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    Grand Total (₹)
                    {!isProcessing && <ConfidenceBadge confidence={extractedData.amountConfidence} />}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g. 968"
                    value={extractedData.amount}
                    className={cn(
                      extractedData.amountConfidence === 'low' &&
                        'border-amber-400 focus-visible:ring-amber-400'
                    )}
                    onChange={(e) => setExtractedData({ ...extractedData, amount: e.target.value })}
                  />
                </div>

                {/* Tax (optional, read-only display) */}
                {extractedData.tax && (
                  <div className="space-y-1">
                    <Label htmlFor="tax" className="flex items-center text-muted-foreground">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      GST / Tax Detected (₹)
                    </Label>
                    <Input
                      id="tax"
                      type="number"
                      value={extractedData.tax}
                      onChange={(e) => setExtractedData({ ...extractedData, tax: e.target.value })}
                    />
                  </div>
                )}

                {/* Category */}
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <FolderOpen className="w-4 h-4 mr-1" />
                    Category
                  </Label>
                  <Select
                    value={extractedData.category}
                    onValueChange={(value) => setExtractedData({ ...extractedData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
                  onClick={handleSaveExpense}
                  disabled={isProcessing || isSaving}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Tips for better OCR results</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Ensure good lighting — avoid shadows across the text</li>
                <li>Place receipt flat; avoid folds or creases in the image</li>
                <li>Capture the entire receipt including all edges</li>
                <li>Use a high-resolution photo — blurry images reduce accuracy</li>
                <li>Low-confidence fields are highlighted in amber — always verify them</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
