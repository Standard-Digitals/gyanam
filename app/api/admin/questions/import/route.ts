import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { parseQuestionsFromText } from '@/lib/import/questionImport';

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let text: string;

  try {
    if (file.name.toLowerCase().endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      text = buffer.toString('utf-8');
    }
  } catch {
    return NextResponse.json({ error: 'Could not read this file. Please upload a .docx or .txt file.' }, { status: 400 });
  }

  const { questions, warnings } = parseQuestionsFromText(text);
  return NextResponse.json({ questions, warnings });
}
