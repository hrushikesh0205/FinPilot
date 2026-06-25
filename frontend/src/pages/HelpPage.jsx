import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ChevronRight,
  Search,
  Send,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { faqs } from '@/data/mockData';

const helpCategories = [
  { name: 'Getting Started', icon: HelpCircle, count: 12 },
  { name: 'Account Settings', icon: MessageSquare, count: 8 },
  { name: 'Expenses & Budgets', icon: HelpCircle, count: 15 },
  { name: 'AI Features', icon: HelpCircle, count: 6 },
];

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({
    type: 'feedback',
    message: '',
    email: '',
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedback({ type: 'feedback', message: '', email: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Find answers to common questions, get in touch with support, or send us feedback
        </p>
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardContent className="p-6">
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {helpCategories.map((cat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <cat.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-medium text-sm">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{cat.count} articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-medium text-left">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-medium text-sm">Email Support</p>
                <p className="text-xs text-muted-foreground">support@expenseiq.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-medium text-sm">Phone Support</p>
                <p className="text-xs text-muted-foreground">+91 1800-XXX-XXXX</p>
              </div>
            </div>
            <Button className="w-full gap-2">
              <MessageSquare className="w-4 h-4" />
              Start Live Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbackSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="font-medium">Thank you for your feedback!</p>
                <p className="text-sm text-muted-foreground">We appreciate your input.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={feedback.type === 'feedback' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedback({ ...feedback, type: 'feedback' })}
                  >
                    Feedback
                  </Button>
                  <Button
                    type="button"
                    variant={feedback.type === 'bug' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedback({ ...feedback, type: 'bug' })}
                  >
                    Report Bug
                  </Button>
                  <Button
                    type="button"
                    variant={feedback.type === 'feature' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedback({ ...feedback, type: 'feature' })}
                  >
                    Feature Request
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-email">Email (optional)</Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    placeholder="your@email.com"
                    value={feedback.email}
                    onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-message">Message</Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Tell us what you think..."
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                >
                  Submit Feedback
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
