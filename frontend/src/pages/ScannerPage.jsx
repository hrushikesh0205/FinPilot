import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  Camera,
  FileImage,
  Check,
  Loader2,
  Sparkles,
  Receipt,
  Calendar,
  Building2,
  IndianRupee,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories } from '@/data/mockData';

export function ScannerPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState({
    merchant: '',
    amount: '',
    date: '',
    category: '',
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadedFile(URL.createObjectURL(file));
      setTimeout(() => {
        setIsUploading(false);
        setIsProcessing(true);
        // Simulate AI processing
        setTimeout(() => {
          setIsProcessing(false);
          setIsProcessed(true);
          setExtractedData({
            merchant: 'Big Bazaar',
            amount: '2450',
            date: '2024-01-15',
            category: 'Food',
          });
        }, 2000);
      }, 500);
    }
  };

  const handleSaveExpense = () => {
    // Would save the expense in a real app
    alert('Expense saved successfully!');
    handleReset();
  };

  const handleReset = () => {
    setIsUploading(false);
    setIsProcessing(false);
    setIsProcessed(false);
    setUploadedFile(null);
    setExtractedData({ merchant: '', amount: '', date: '', category: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Receipt Scanner</h1>
          <p className="text-muted-foreground">
            Upload receipts and let AI extract the details
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {!uploadedFile && (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-emerald-500/50 transition-colors">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-lg">
                  Drop your receipt here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="file-upload">
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline"
                    className="gap-2 cursor-pointer"
                    asChild
                  >
                    <span>
                      <FileImage className="w-4 h-4" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    // Would open camera in real app
                    alert('Camera functionality would open here');
                  }}
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, PDF (Max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {(isUploading || isProcessing) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedFile && (
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={uploadedFile}
                    alt="Receipt preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Animation */}
          <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                  <Sparkles className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">AI Processing</p>
                  <p className="text-sm text-muted-foreground">
                    Analyzing receipt data...
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Image uploaded</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-500" />
                    )}
                    <span>OCR Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                    <span>Data extraction</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Processed Result */}
      {isProcessed && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Receipt Preview</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3 mr-1" />
                  Processed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {uploadedFile && (
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={uploadedFile}
                    alt="Receipt preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extracted Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Extracted Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">Data extracted successfully!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please verify and edit if needed
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="merchant">
                    <Building2 className="w-4 h-4 mr-1 inline" />
                    Merchant Name
                  </Label>
                  <Input
                    id="merchant"
                    value={extractedData.merchant}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, merchant: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    <IndianRupee className="w-4 h-4 mr-1 inline" />
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={extractedData.amount}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, amount: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">
                    <Calendar className="w-4 h-4 mr-1 inline" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={extractedData.date}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    <FolderOpen className="w-4 h-4 mr-1 inline" />
                    Category
                  </Label>
                  <Select
                    value={extractedData.category}
                    onValueChange={(value) =>
                      setExtractedData({ ...extractedData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
                  onClick={handleSaveExpense}
                >
                  Save Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tips Card */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Tips for better results</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Ensure good lighting when taking a photo</li>
                <li>Place receipt on a flat, contrasting surface</li>
                <li>Capture the entire receipt including edges</li>
                <li>Avoid shadows and reflections</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
