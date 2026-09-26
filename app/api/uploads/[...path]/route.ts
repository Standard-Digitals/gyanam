import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { Readable } from 'stream';
import path from 'path';

// `next start` builds its static-file manifest for `public/` once at process
// boot, so files uploaded at runtime (after boot) are invisible to Next's
// normal static serving until the next restart — and worse, the very first
// request for that path gets negatively cached, so even a later restart
// doesn't fix that specific URL. next.config.ts rewrites /uploads/:path* to
// this always-dynamic route instead, so uploaded images/videos are served
// correctly the moment they're written, no restart needed.
export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  if (segments.length === 0 || segments.some((s) => s.includes('..') || s.includes('/') || s.includes('\\'))) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const ext = path.extname(segments[segments.length - 1]).toLowerCase();
  const mimeType = MIME_TYPES[ext];
  if (!mimeType) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', ...segments);

  let fileStat;
  try {
    fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error('Not a file');
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const baseHeaders: Record<string, string> = {
    'Content-Type': mimeType,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Accept-Ranges': 'bytes',
  };

  const range = req.headers.get('range');
  if (range) {
    const match = range.match(/bytes=(\d*)-(\d*)/);
    const start = match?.[1] ? parseInt(match[1], 10) : 0;
    const end = match?.[2] ? parseInt(match[2], 10) : fileStat.size - 1;
    if (isNaN(start) || isNaN(end) || start > end || end >= fileStat.size) {
      return new NextResponse(null, { status: 416, headers: { 'Content-Range': `bytes */${fileStat.size}` } });
    }
    const stream = createReadStream(filePath, { start, end });
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
        'Content-Length': String(end - start + 1),
      },
    });
  }

  const stream = createReadStream(filePath);
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: {
      ...baseHeaders,
      'Content-Length': String(fileStat.size),
    },
  });
}
