'use client';
import { useState } from 'react';
import { FileText, Download, Check } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: string;
  category: string;
  fileSize: string;
  price: number | null;
}

export default function CourseMaterials({ resources }: { resources: Resource[] }) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try {
      await fetch(`/api/resources/${id}/download`, { method: 'POST' });
      setDownloadedIds((prev) => new Set(prev).add(id));
    } catch (err) {
      console.error('Failed to record download', err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (resources.length === 0) {
    return <p className="text-sm text-[#888888]">No matching study material yet — check back soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((res) => {
        const isDownloaded = downloadedIds.has(res.id);
        return (
          <div key={res.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5" />
              </div>
              {res.price !== null && (
                <span className="text-[10px] font-bold text-[#888888] font-plexmono shrink-0">₹{res.price}</span>
              )}
            </div>
            <div>
              <span className="font-plexmono text-[9px] font-bold uppercase text-[#C12223] bg-[#FDEAE9] px-2 py-0.5 rounded-full">
                {res.type}
              </span>
              <h3 className="font-bold text-sm text-[#1F1A1C] leading-snug mt-2 line-clamp-2">{res.title}</h3>
              <p className="text-[11px] text-[#888888] mt-1">{res.category} · {res.fileSize}</p>
            </div>
            <button
              onClick={() => handleDownload(res.id)}
              disabled={downloadingId === res.id}
              className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-60 ${
                isDownloaded ? 'bg-[#E7F5EE] text-[#127A52]' : 'bg-[#C12223] text-white'
              }`}
            >
              {downloadingId === res.id ? (
                'Preparing...'
              ) : isDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Downloaded
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Download
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
