import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

function handleRevalidate(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}

export async function GET(req: NextRequest) {
  return handleRevalidate(req);
}

export async function POST(req: NextRequest) {
  return handleRevalidate(req);
}
