'use client';
import { useRef, useState } from 'react';
import { UploadCloud, Download } from 'lucide-react';
import type { RawQuestion } from './questionTypes';

export default function QuestionImportButton({
  onImported,
}: {
  onImported: (questions: RawQuestion[], warnings: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/questions/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import file');
      onImported(data.questions, data.warnings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="px-4 py-2 bg-white border border-[#F3DCDD] text-[#C12223] font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
      >
        <UploadCloud className="w-3.5 h-3.5" />
        {isUploading ? 'Importing...' : 'Import from Word/Text'}
      </button>
      <a
        href="/templates/question-import-template.txt"
        download
        className="text-[11px] font-bold text-[#888888] hover:text-[#C12223] cursor-pointer flex items-center gap-1"
      >
        <Download className="w-3.5 h-3.5" />
        Download Template
      </a>
      {error && <p className="text-xs font-semibold text-red-600 w-full">{error}</p>}
    </div>
  );
}
