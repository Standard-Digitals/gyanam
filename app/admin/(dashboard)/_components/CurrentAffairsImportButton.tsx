'use client';
import { useRef, useState } from 'react';
import { ClipboardPaste, UploadCloud, Download, X } from 'lucide-react';
import { parseCurrentAffairsText, type ParsedCurrentAffairs } from '@/lib/import/currentAffairsImport';
import { CURRENT_AFFAIRS_CATEGORIES as CATEGORIES } from '@/lib/currentAffairsCategories';

export default function CurrentAffairsImportButton({
  onImported,
}: {
  onImported: (fields: Partial<ParsedCurrentAffairs>, warnings: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setPastedText('');
    setError(null);
  };

  const handleFillFromPaste = () => {
    if (!pastedText.trim()) {
      setError('Paste the article text first');
      return;
    }
    const { fields, warnings } = parseCurrentAffairsText(pastedText, CATEGORIES);
    onImported(fields, warnings);
    close();
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/current-affairs/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import file');
      onImported(data.fields, data.warnings ?? []);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-white border border-[#F3DCDD] text-[#C12223] font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
      >
        <ClipboardPaste className="w-3.5 h-3.5" />
        Paste &amp; Auto-Fill
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3DCDD]">
              <div>
                <h3 className="font-heading font-black text-base text-[#1F1A1C]">Paste &amp; Auto-Fill Article</h3>
                <p className="text-xs text-[#888888] mt-0.5">Paste the whole article text below — every field gets filled in automatically.</p>
              </div>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer shrink-0">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto space-y-3">
              <textarea
                autoFocus
                rows={14}
                placeholder={'Title: RBI Announces New Repo Rate\nCategory: Economy\nDate: Aug 10, 2026\n\nSummary:\n...\n\nBullets:\n- ...\n\nSee the template for the full format.'}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-mono"
              />
              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

              <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#888888] hover:text-[#C12223] cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {isUploading ? 'Importing...' : 'or upload a Word/Text file'}
                  </button>
                  <a
                    href="/templates/current-affairs-import-template.txt"
                    download
                    className="flex items-center gap-1 text-[11px] font-bold text-[#888888] hover:text-[#C12223] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Template
                  </a>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#F3DCDD] flex gap-2">
              <button
                onClick={handleFillFromPaste}
                className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Fill Form
              </button>
              <button onClick={close} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
