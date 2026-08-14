'use client';
import { useRef, useState } from 'react';

export default function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [mode, setMode] = useState<'link' | 'upload'>('link');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">{label}</label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${mode === 'link' ? 'bg-[#C12223] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${mode === 'upload' ? 'bg-[#C12223] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === 'link' ? (
        <input
          type="text"
          placeholder={`${label} URL`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
        />
      ) : (
        <div className="space-y-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileSelected}
            disabled={uploading}
            className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-semibold file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-white file:text-xs file:font-bold file:text-[#C12223] file:cursor-pointer cursor-pointer disabled:opacity-50"
          />
          {uploading && <p className="text-[11px] text-[#888888]">Uploading...</p>}
          {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
        </div>
      )}

      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-1.5 w-14 h-14 object-cover rounded-lg border border-[#F3DCDD]" />
      )}
    </div>
  );
}
