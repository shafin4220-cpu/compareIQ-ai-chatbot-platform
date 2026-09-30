import React, { useRef, useEffect } from 'react';
import { ChatMessage, UploadedDocument } from '../types';
import { ComparisonTableCard } from './ComparisonTableCard';
import {
  Send,
  Paperclip,
  Menu,
  FileText,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface ChatAreaProps {
  messages: ChatMessage[];
  documents: UploadedDocument[];
  inputQuestion: string;
  onInputChange: (val: string) => void;
  onSendMessage: (query?: string) => void;
  isLoading: boolean;
  onOpenMobileSidebar: () => void;
  onAttachFileClick: () => void;
  onResetChat: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  documents,
  inputQuestion,
  onInputChange,
  onSendMessage,
  isLoading,
  onOpenMobileSidebar,
  onAttachFileClick,
  onResetChat,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const examplePrompts = [
    'Compare Plan A vs Plan B',
    'Q3 vs Q4 revenue',
    'Compare coverage, deductibles, and copays',
    'Compare asking price, square footage, and amenities',
    'What are the key differences between the documents?',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FFFFFF] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 border-b border-[#EAF6EE] px-4 md:px-6 flex items-center justify-between bg-[#FFFFFF] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-lg cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-[#1F3D2B] tracking-tight">
              CompareIQ
            </h1>
            <p className="text-[11px] text-[#3D604C]">
              {documents.length === 0
                ? 'No documents loaded'
                : `${documents.length} document${documents.length === 1 ? '' : 's'} active for reasoning`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={onResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-lg transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          {/* Static document count badge: strictly NO animation */}
          <div className="px-2.5 py-1 rounded-full bg-[#EAF6EE] text-[#1F3D2B] text-xs font-medium border border-[#D2EBD9] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7FB88F]" />
            <span>
              {documents.length} {documents.length === 1 ? 'doc' : 'docs'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Conversation Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty / Onboarding State:
             STRICT RULES:
             - No icon, illustration, emoji, or graphic above the heading
             - One-line instruction: "Upload 2+ documents to start comparing"
             - Example prompt chips: "Compare Plan A vs Plan B", "Q3 vs Q4 revenue"
          */
          <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center px-4 py-8">
            <h2 className="text-2xl font-bold text-[#1F3D2B] tracking-tight mb-2">
              CompareIQ
            </h2>
            <p className="text-sm font-medium text-[#3D604C] mb-6">
              Upload 2+ documents to start comparing
            </p>

            <div className="w-full bg-[#EAF6EE]/40 border border-[#D2EBD9] rounded-2xl p-5 mb-6 text-left">
              <div className="text-xs font-semibold text-[#1F3D2B] uppercase tracking-wider mb-2">
                Supported Comparisons
              </div>
              <ul className="text-xs text-[#3D604C] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FB88F] mt-1 shrink-0" />
                  <span>SaaS tiers & pricing specifications ("Plan A vs Plan B")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FB88F] mt-1 shrink-0" />
                  <span>Quarterly financial metrics ("Q3 vs Q4 revenue, margins, CAC")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FB88F] mt-1 shrink-0" />
                  <span>Insurance policies (deductibles, copays, coverage limits)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FB88F] mt-1 shrink-0" />
                  <span>Real estate property listings (price, sqft, HOA fees, amenities)</span>
                </li>
              </ul>
            </div>

            <div className="w-full">
              <div className="text-xs font-semibold text-[#1F3D2B] uppercase tracking-wider mb-3">
                Try an example query
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {examplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt)}
                    className="text-xs font-medium text-[#1F3D2B] bg-[#EAF6EE] hover:bg-[#def2e4] border border-[#D2EBD9] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages Feed */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 md:p-5 ${
                      isUser
                        ? 'bg-[#7FB88F] text-[#FFFFFF] rounded-tr-xs shadow-xs'
                        : 'bg-[#EAF6EE]/50 text-[#1F3D2B] rounded-tl-xs border border-[#D2EBD9]'
                    }`}
                  >
                    {/* User Question */}
                    {isUser && (
                      <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                    )}

                    {/* Bot Response */}
                    {!isUser && (
                      <div className="space-y-3">
                        {/* Polite prompt if only 1 document was uploaded and comparison requested */}
                        {msg.requiresMoreDocs && (
                          <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#D2EBD9] text-xs text-[#1F3D2B]">
                            <p className="leading-relaxed font-medium mb-2">
                              {msg.summary || msg.answer}
                            </p>
                            <p className="text-[#3D604C]">
                              Tip: You can click one of our 1-click sample datasets in the left sidebar to see an instant side-by-side comparison.
                            </p>
                          </div>
                        )}

                        {/* Structured Comparison Table Card */}
                        {msg.isComparison && msg.table && msg.table.length > 0 && (
                          <ComparisonTableCard
                            summary={msg.summary}
                            entities={msg.entities}
                            table={msg.table}
                            insights={msg.insights}
                          />
                        )}

                        {/* Standard Non-Comparison Q&A Answer */}
                        {!msg.isComparison && !msg.requiresMoreDocs && (
                          <div>
                            {msg.summary && (
                              <div className="text-xs font-semibold text-[#3D604C] uppercase tracking-wider mb-1.5">
                                {msg.summary}
                              </div>
                            )}
                            <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                              {msg.answer || msg.text}
                            </div>

                            {/* Citations tag list */}
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-[#D2EBD9] flex flex-wrap gap-2">
                                {msg.citations.map((cite, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-[#FFFFFF] text-[#3D604C] border border-[#D2EBD9]"
                                  >
                                    <FileText className="w-3 h-3 text-[#7FB88F]" />
                                    <span className="font-semibold text-[#1F3D2B]">
                                      {cite.docName}:
                                    </span>
                                    <span className="truncate max-w-[200px]" title={cite.sourceQuote}>
                                      "{cite.sourceQuote}"
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Error state */}
                        {msg.error && (
                          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D2EBD9] text-xs text-[#1F3D2B]">
                            {msg.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading state indicator: friendly microcopy, strictly NO animate-pulse */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#EAF6EE] border border-[#D2EBD9] rounded-2xl rounded-tl-xs p-4 flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#7FB88F]" />
                  <span className="text-xs font-medium text-[#1F3D2B]">
                    Reading your documents...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <footer className="p-4 md:p-6 border-t border-[#EAF6EE] bg-[#FFFFFF] shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-[#EAF6EE]/40 border border-[#D2EBD9] rounded-2xl focus-within:border-[#7FB88F] focus-within:bg-[#FFFFFF] transition-all p-2 shadow-xs">
            <button
              onClick={onAttachFileClick}
              className="p-2 text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-xl transition-colors cursor-pointer shrink-0"
              title="Upload new documents"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              ref={textareaRef}
              value={inputQuestion}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                documents.length === 0
                  ? 'Upload documents or ask a question...'
                  : 'Ask a comparison question (e.g., "Compare Plan A vs Plan B")...'
              }
              rows={1}
              className="flex-1 bg-transparent px-3 py-1.5 text-sm text-[#1F3D2B] placeholder-[#5C806B] focus:outline-hidden resize-none max-h-32"
            />

            <button
              onClick={() => onSendMessage()}
              disabled={isLoading || !inputQuestion.trim()}
              className="p-2.5 bg-[#7FB88F] hover:bg-[#71a980] text-[#FFFFFF] rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 text-center text-[11px] text-[#5C806B]">
            Side-by-side comparison tables are automatically generated when comparing multiple documents.
          </div>
        </div>
      </footer>
    </div>
  );
};
