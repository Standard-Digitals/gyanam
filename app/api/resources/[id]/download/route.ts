import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const resource = await prisma.freeResource.findUnique({ where: { id } });
  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  }

  const user = await getCurrentUser();
  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

  await prisma.$transaction([
    prisma.freeResource.update({ where: { id }, data: { downloadsCount: { increment: 1 } } }),
    prisma.downloadLog.create({
      data: { resourceId: id, userId: user?.userId, ipAddress },
    }),
  ]);

  return NextResponse.json({ success: true, downloadsCount: resource.downloadsCount + 1 });
}
