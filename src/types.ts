export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  charCount: number;
  wordCount: number;
  uploadedAt?: string;
}

export interface ComparisonTableRow {
  attribute: string;
  values: Record<string, string>;
  sources?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  timestamp: string;
  text?: string;
  isComparison?: boolean;
  requiresMoreDocs?: boolean;
  summary?: string;
  entities?: string[];
  table?: ComparisonTableRow[];
  insights?: string[];
  answer?: string;
  citations?: {
    docName: string;
    sourceQuote: string;
  }[];
  error?: string;
}
