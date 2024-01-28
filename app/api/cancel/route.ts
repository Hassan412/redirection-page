import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  if (req.method === 'GET') {
    const originUrl = decodeURIComponent(req.nextUrl.searchParams.get('origin') as string);
    return NextResponse.redirect(originUrl);
  } else {
    return NextResponse.json({ message: 'Method not allowed' });
  }
}