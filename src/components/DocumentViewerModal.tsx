import React from 'react';
import { UploadedDocument } from '../types';
import { X, FileText, Download } from 'lucide-react';

interface DocumentViewerModalProps {
  document: UploadedDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  const handleDownload = () => {
    const blob = new Blob([document.content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.name.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3D2B]/30 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl border border-[#D2EBD9] shadow-lg flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#EAF6EE]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-lg bg-[#EAF6EE] text-[#1F3D2B]">
              <FileText className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-[#1F3D2B] truncate">
                {document.name}
              </h3>
              <p className="text-xs text-[#3D604C]">
                {document.wordCount.toLocaleString()} words · {document.charCount.toLocaleString()} chars
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-lg transition-colors cursor-pointer"
              title="Download extracted text"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#3D604C] hover:text-[#1F3D2B] hover:bg-[#EAF6EE] rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-[#FFFFFF]">
          <pre className="text-xs font-mono text-[#1F3D2B] whitespace-pre-wrap leading-relaxed">
            {document.content}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#EAF6EE] border-t border-[#D2EBD9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#1F3D2B] bg-[#FFFFFF] hover:bg-[#EAF6EE] border border-[#D2EBD9] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
