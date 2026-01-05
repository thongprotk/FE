import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, ExternalLink } from "lucide-react";
import type { PromptTemplate } from "@/services/prompt-template.service";

interface PromptPreviewProps {
  template: PromptTemplate;
  url: string;
  title: string;
  content: string;
  count?: number;
  onSelect?: (prompt: string) => void;
}

export function PromptPreview({
  template,
  url,
  title,
  content,
  count = 8,
  onSelect,
}: PromptPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build final prompt
  const buildPrompt = () => {
    let prompt = template.template;
    prompt = prompt.replace(/{URL}/g, url || "Not provided");
    prompt = prompt.replace(/{TITLE}/g, title || "Untitled Resource");
    prompt = prompt.replace(/{CONTENT}/g, content);
    prompt = prompt.replace(/{COUNT}/g, count.toString());
    return prompt;
  };

  const finalPrompt = buildPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(finalPrompt);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Preview Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {template.name}
            <Badge variant="secondary">{template.category}</Badge>
          </DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Source Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Source Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Title:</span> {title}
              </div>
              {url && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">URL:</span>
                  <span className="text-blue-600 underline break-all">
                    {url}
                  </span>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              <div>
                <span className="font-semibold">Count:</span> {count} flashcards
              </div>
            </CardContent>
          </Card>

          {/* Generated Prompt Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Generated Prompt</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={finalPrompt}
                readOnly
                className="h-80 font-mono text-xs p-3 bg-muted"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelect} className="gap-2">
              Use This Prompt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
