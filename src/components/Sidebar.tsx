import React, { useRef, useState } from 'react';
import { UploadedDocument } from '../types';
import { SAMPLE_DATASETS, SampleDataset } from '../data/sampleDatasets';
import {
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  Plus,
  X,
  FileCheck,
  FolderOpen,
} from 'lucide-react';

interface SidebarProps {
  documents: UploadedDocument[];
  onUploadFiles: (files: FileList | File[]) => void;
  onRemoveDocument: (id: string) => void;
  onClearAll: () => void;
  onPreviewDocument: (doc: UploadedDocument) => void;
  onLoadSample: (sample: SampleDataset) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  isUploading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  documents,
  onUploadFiles,
  onRemoveDocument,
  onClearAll,
  onPreviewDocument,
  onLoadSample,
  isOpen,
  onCloseMobile,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-[#1F3D2B]/20 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-[#FFFFFF] border-r border-[#D2EBD9] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-4 border-b border-[#EAF6EE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF6EE] border border-[#D2EBD9] flex items-center justify-center text-[#1F3D2B] font-bold text-sm">
              C
            </div>
            <div>
              <div className="text-sm font-bold text-[#1F3D2B] tracking-tight">
                CompareIQ
              </div>
              <div className="text-[11px] text-[#3D604C]">
                Multi-Doc Reasoning
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Zone */}
        <div className="p-4 border-b border-[#EAF6EE]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md"
            className="hidden"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[#7FB88F] bg-[#EAF6EE]'
                : 'border-[#D2EBD9] bg-[#EAF6EE]/30 hover:bg-[#EAF6EE]/70'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="p-2 rounded-lg bg-[#EAF6EE] text-[#1F3D2B]">
                <UploadCloud className="w-4 h-4 text-[#7FB88F]" />
              </div>
              <div className="text-xs font-semibold text-[#1F3D2B]">
                Drop your documents here to compare
              </div>
              <div className="text-[11px] text-[#3D604C]">
                PDF, DOCX, CSV, XLSX, TXT (2+ files)
              </div>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full mt-2.5 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#FFFFFF] bg-[#7FB88F] hover:bg-[#71a980] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Documents</span>
          </button>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {/* Static indicator dot: strictly solid with NO animation */}
                <span className="w-2 h-2 rounded-full bg-[#7FB88F]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1F3D2B]">
                  Loaded Documents ({documents.length})
                </span>
              </div>
              {documents.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[11px] text-[#3D604C] hover:text-[#1F3D2B] underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#EAF6EE]/40 border border-[#D2EBD9] text-center">
                <p className="text-xs text-[#3D604C]">
                  No documents uploaded yet. Upload 2+ files or select a sample dataset below.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D2EBD9] hover:border-[#7FB88F] transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 mr-2">
                      <div className="p-1.5 rounded-lg bg-[#EAF6EE] text-[#1F3D2B] shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="overflow-hidden">
                        <div
                          className="text-xs font-medium text-[#1F3D2B] truncate cursor-pointer hover:underline"
                          title={doc.name}
                          onClick={() => onPreviewDocument(doc)}
                        >
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-[#3D604C]">
                          {formatFileSize(doc.size)} · {doc.wordCount.toLocaleString()} words
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onPreviewDocument(doc)}
                        className="p-1.5 text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-lg transition-colors cursor-pointer"
                        title="View document content"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveDocument(doc.id)}
                        className="p-1.5 text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-lg transition-colors cursor-pointer"
                        title="Remove document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Preset Samples */}
          <div className="pt-2 border-t border-[#EAF6EE]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1F3D2B] mb-2 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-[#7FB88F]" />
              <span>1-Click Sample Datasets</span>
            </div>
            <div className="space-y-1.5">
              {SAMPLE_DATASETS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onLoadSample(sample)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#EAF6EE]/30 hover:bg-[#EAF6EE] border border-[#D2EBD9] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1F3D2B]">
                      {sample.title}
                    </span>
                    <FileCheck className="w-3 h-3 text-[#7FB88F] opacity-70 group-hover:opacity-100" />
                  </div>
                  <p className="text-[11px] text-[#3D604C] mt-0.5 line-clamp-2">
                    {sample.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info: Static status badge */}
        <div className="p-3 border-t border-[#EAF6EE] bg-[#EAF6EE]/20 flex items-center justify-between text-[11px] text-[#3D604C]">
          <span>CompareIQ v1.0</span>
          {/* Static dot: strictly no animation */}
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FB88F]" />
            <span>Ready</span>
          </span>
        </div>
      </aside>
    </>
  );
};
