import React, { useState } from 'react';
import { UploadedDocument, ChatMessage } from './types';
import { SAMPLE_DATASETS, SampleDataset } from './data/sampleDatasets';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { DocumentViewerModal } from './components/DocumentViewerModal';

export default function App() {
  // Start with SaaS sample dataset loaded so users can compare immediately
  const [documents, setDocuments] = useState<UploadedDocument[]>(
    SAMPLE_DATASETS[0].files
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Upload files handler
  const handleUploadFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    try {
      const filePayloads: { name: string; base64: string; type: string; size: number }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await fileToBase64(file);
        filePayloads.push({
          name: file.name,
          base64,
          type: file.type || 'text/plain',
          size: file.size,
        });
      }

      const response = await fetch('/api/documents/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filePayloads }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.documents)) {
        setDocuments((prev) => [...prev, ...data.documents]);
      } else {
        alert(data.error || 'Failed to parse uploaded files.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert(err.message || 'Error uploading and reading files.');
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data:mime/type;base64, prefix
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAll = () => {
    setDocuments([]);
  };

  const handleLoadSample = (sample: SampleDataset) => {
    setDocuments(sample.files);
    // Suggest or set the default question
    setInputQuestion(sample.defaultQuestion);
  };

  const handleSendMessage = async (customQuery?: string) => {
    const query = (customQuery || inputQuestion).trim();
    if (!query || isLoading) return;

    // Check if query matches a known sample dataset when user clicks example chip
    let activeDocs = documents;
    if (query.toLowerCase().includes('q3 vs q4')) {
      const finSample = SAMPLE_DATASETS.find((s) => s.id === 'financial-reports');
      if (finSample) {
        activeDocs = finSample.files;
        setDocuments(finSample.files);
      }
    } else if (
      query.toLowerCase().includes('gold vs silver') ||
      query.toLowerCase().includes('insurance') ||
      query.toLowerCase().includes('copay')
    ) {
      const insSample = SAMPLE_DATASETS.find((s) => s.id === 'insurance-policies');
      if (insSample) {
        activeDocs = insSample.files;
        setDocuments(insSample.files);
      }
    } else if (
      query.toLowerCase().includes('oak st') ||
      query.toLowerCase().includes('maple ave') ||
      query.toLowerCase().includes('sqft') ||
      query.toLowerCase().includes('hoa')
    ) {
      const reSample = SAMPLE_DATASETS.find((s) => s.id === 'real-estate-listings');
      if (reSample) {
        activeDocs = reSample.files;
        setDocuments(reSample.files);
      }
    } else if (
      query.toLowerCase().includes('plan a vs plan b') &&
      documents.length === 0
    ) {
      const saasSample = SAMPLE_DATASETS[0];
      activeDocs = saasSample.files;
      setDocuments(saasSample.files);
    }

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      if (activeDocs.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot_' + Date.now(),
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            requiresMoreDocs: true,
            summary: 'Upload 2+ documents to start comparing.',
            answer: 'No documents are currently loaded. Please upload at least 2 documents in the sidebar or pick one of the sample datasets to begin comparing.',
          },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          documents: activeDocs,
          history: messages.slice(-6),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Server error processing request');
      }

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isComparison: data.isComparison,
        requiresMoreDocs: data.requiresMoreDocs,
        summary: data.summary,
        entities: data.entities,
        table: data.table,
        insights: data.insights,
        answer: data.answer,
        citations: data.citations,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          error: err.message || 'Unable to generate comparison at this moment.',
          answer: 'An error occurred while reading the documents. Please verify your files and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen w-screen bg-[#FFFFFF] text-[#1F3D2B] overflow-hidden font-sans">
      {/* Document Sidebar */}
      <Sidebar
        documents={documents}
        onUploadFiles={handleUploadFiles}
        onRemoveDocument={handleRemoveDocument}
        onClearAll={handleClearAll}
        onPreviewDocument={(doc) => setPreviewDoc(doc)}
        onLoadSample={handleLoadSample}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isUploading={isUploading}
      />

      {/* Main Chat Interface */}
      <ChatArea
        messages={messages}
        documents={documents}
        inputQuestion={inputQuestion}
        onInputChange={setInputQuestion}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onAttachFileClick={() => {
          setIsMobileSidebarOpen(true);
        }}
        onResetChat={handleResetChat}
      />

      {/* Document Inspection Modal */}
      <DocumentViewerModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
