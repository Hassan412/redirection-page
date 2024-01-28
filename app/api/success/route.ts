import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  try {
    const originUrl = decodeURIComponent(
      req.nextUrl.searchParams.get("origin") as string
    );

    if (!originUrl) {
      return new NextResponse("No Origin Url found", { status: 404 });
    }
    return NextResponse.redirect(`${originUrl}?success=1`);
  } catch (error) {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
