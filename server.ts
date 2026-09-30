import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { PDFParse } from 'pdf-parse';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ParsedDocResult {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  charCount: number;
  wordCount: number;
}

// Document parsing helper
async function extractTextFromFile(
  filename: string,
  base64Data: string,
  mimeType: string
): Promise<string> {
  const buffer = Buffer.from(base64Data, 'base64');

  const lowerName = filename.toLowerCase();

  if (lowerName.endsWith('.pdf') || mimeType === 'application/pdf') {
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      await parser.destroy();
      return textResult.text || '';
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      // Fallback: Use Gemini inline data extraction if pdf-parse fails
      try {
        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'application/pdf',
              },
            },
            {
              text: 'Extract and transcribe all text from this document accurately. Do not summarize.',
            },
          ],
        });
        return geminiRes.text || '';
      } catch (geminiErr: any) {
        throw new Error(`Failed to parse PDF "${filename}": ${err?.message || 'Invalid format'}`);
      }
    }
  }

  if (
    lowerName.endsWith('.docx') ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (err: any) {
      console.error('DOCX parsing error:', err);
      throw new Error(`Failed to parse DOCX "${filename}": ${err?.message || 'Invalid format'}`);
    }
  }

  if (
    lowerName.endsWith('.xlsx') ||
    lowerName.endsWith('.xls') ||
    mimeType.includes('spreadsheetml') ||
    mimeType.includes('excel')
  ) {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetTexts: string[] = [];
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        sheetTexts.push(`--- Sheet: ${sheetName} ---\n${csv}`);
      }
      return sheetTexts.join('\n\n');
    } catch (err: any) {
      console.error('Excel parsing error:', err);
      throw new Error(`Failed to parse Excel "${filename}": ${err?.message || 'Invalid format'}`);
    }
  }

  if (lowerName.endsWith('.csv') || mimeType === 'text/csv') {
    return buffer.toString('utf-8');
  }

  // Fallback for TXT, MD, etc.
  return buffer.toString('utf-8');
}

// API endpoint to parse uploaded files
app.post('/api/documents/parse', async (req: Request, res: Response) => {
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided in request' });
    }

    const parsedDocs: ParsedDocResult[] = [];

    for (const file of files) {
      const { name, base64, type, size } = file;
      if (!name || !base64) continue;

      const content = await extractTextFromFile(name, base64, type || '');
      const trimmed = content.trim();
      const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

      parsedDocs.push({
        id: 'doc_' + Math.random().toString(36).substring(2, 11),
        name,
        type: type || 'text/plain',
        size: size || bufferSize(base64),
        content: trimmed,
        charCount: trimmed.length,
        wordCount,
      });
    }

    res.json({ success: true, documents: parsedDocs });
  } catch (error: any) {
    console.error('Document parsing endpoint error:', error);
    res.status(500).json({ error: error.message || 'Error processing documents' });
  }
});

function bufferSize(base64: string): number {
  return Math.floor((base64.length * 3) / 4);
}

// Comparison intent detection heuristic + LLM verification
function hasComparisonKeywords(query: string): boolean {
  const q = query.toLowerCase();
  const keywords = [
    ' vs ',
    ' vs. ',
    'versus',
    'compare',
    'comparison',
    'difference',
    'differ',
    'differences',
    'which is better',
    'which one',
    'side by side',
    'pros and cons',
    'table of',
    'breakdown',
    'how do they compare',
    'contrast',
    'distinction between',
  ];
  return keywords.some((kw) => q.includes(kw));
}

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { question, documents, history } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        error: 'No documents provided. Please upload at least one document.',
      });
    }

    const isExplicitCompareQuery = hasComparisonKeywords(question);

    // Rule 8: If only ONE document is uploaded and user asks to "compare", politely ask for a second document
    if (documents.length === 1 && isExplicitCompareQuery) {
      return res.json({
        isComparison: false,
        requiresMoreDocs: true,
        summary: `You currently have 1 document loaded ("${documents[0].name}"). To generate a side-by-side comparison, please upload at least one more document or choose one of our sample datasets.`,
        answer: `You currently have 1 document loaded ("${documents[0].name}"). To generate a side-by-side comparison, please upload at least one more document or choose one of our sample datasets.`,
        citations: [],
      });
    }

    // Prepare document context with clear identifiers
    const docContextBlocks = documents.map((doc: any, index: number) => {
      const docHeader = `=== DOCUMENT ${index + 1}: ${doc.name} (ID: ${doc.id}) ===`;
      // Truncate safely if huge to stay within prompt limits, though gemini-3.8-flash has 1M context
      const truncated = doc.content.length > 80000 ? doc.content.substring(0, 80000) + '\n...[content truncated]' : doc.content;
      return `${docHeader}\n${truncated}\n=== END DOCUMENT ${index + 1} ===`;
    });

    const docNamesList = documents.map((d: any) => `"${d.name}"`).join(', ');

    // System instruction strictly enforcing comparison guidelines
    const systemPrompt = `You are CompareIQ, a high-precision multi-document reasoning and comparison assistant.
Available documents: ${docNamesList}.

STRICT INSTRUCTIONS:
1. Determine if the question asks to compare, contrast, evaluate differences/similarities, or inspect metrics/features across multiple documents or entities.
2. If comparison is requested AND 2 or more documents are provided:
   - Set "isComparison": true.
   - "summary": A concise, one-line plain-language summary of how they compare (e.g. "Plan A offers lower cost and higher storage, whereas Plan B includes dedicated 24/7 phone support and SLA guarantees."). Put this plain-language summary above the table.
   - "entities": Array of the document/entity names being compared. Must match the exact document names provided: ${JSON.stringify(documents.map((d: any) => d.name))}.
   - "table": Array of attribute comparison objects.
     - "attribute": Name of feature, metric, clause, or attribute (e.g., "Monthly Price", "Uptime SLA", "Prescription Copay", "Square Footage").
     - "values": An object mapping each entity/document name to its extracted value or specification.
     - "sources": An object mapping each entity/document name to the exact document citation tag (e.g., "from ${documents[0].name}").
     - CRITICAL GROUNDING RULE: If an attribute is NOT mentioned or missing in a document, the value for that document MUST strictly be "Not mentioned in [Document Name]". NEVER guess, invent, assume, or hallucinate data!
   - "insights": Array of 2 to 4 key takeaways or distinctions between the sources.
3. If normal single-doc Q&A or factual lookup (non-comparison):
   - Set "isComparison": false.
   - "answer": Clear, structured, and helpful markdown response answering the question directly based on the uploaded documents.
   - "citations": Array of objects: { "docName": string, "sourceQuote": string } citing where the information came from.
4. Tone: Friendly, clear, professional. No robotic meta-commentary or apologies.`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `DOCUMENT REPOSITORY:\n${docContextBlocks.join('\n\n')}\n\nUSER QUESTION: ${question}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2, // low temperature for high precision grounding
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isComparison: {
              type: Type.BOOLEAN,
              description: 'Whether the query requires a structured side-by-side comparison table',
            },
            summary: {
              type: Type.STRING,
              description: 'One-line plain-language summary of the comparison or answer',
            },
            entities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Names of the entities or documents being compared',
            },
            table: {
              type: Type.ARRAY,
              description: 'Rows of attributes with values and source citations for each document',
              items: {
                type: Type.OBJECT,
                properties: {
                  attribute: { type: Type.STRING },
                  values: {
                    type: Type.OBJECT,
                    description: 'Key-value map where key is document name and value is the cell text',
                  },
                  sources: {
                    type: Type.OBJECT,
                    description: 'Key-value map where key is document name and value is source citation string',
                  },
                },
                required: ['attribute', 'values'],
              },
            },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Bullet points highlighting key differences or takeaways',
            },
            answer: {
              type: Type.STRING,
              description: 'Standard text answer when isComparison is false',
            },
            citations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  docName: { type: Type.STRING },
                  sourceQuote: { type: Type.STRING },
                },
                required: ['docName', 'sourceQuote'],
              },
              description: 'Document citations for standard Q&A answer',
            },
          },
          required: ['isComparison', 'summary'],
        },
      },
    });

    const rawText = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', rawText);
      parsedData = {
        isComparison: false,
        summary: 'Answer to your question',
        answer: rawText,
        citations: [],
      };
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while analyzing the documents.',
    });
  }
});

// Serve frontend with Vite middlewares in dev or static in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CompareIQ server running on port ${PORT}`);
  });
}

startServer();
