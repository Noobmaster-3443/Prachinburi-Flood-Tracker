import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BMA_RADAR_IMAGE_URL = 'https://weather.bangkok.go.th/radar/ImageHandlerNongchokHigh.ashx';

export async function GET(req: NextRequest) {
  try {
    const timestamp = Date.now();
    const url = `${BMA_RADAR_IMAGE_URL}?${timestamp}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ThailandFloodTracker/2.0',
        'Referer': 'https://weather.bangkok.go.th/radar',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      next: { revalidate: 120 }, // 2 minutes cache
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch radar: HTTP ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=120, stale-while-revalidate=300',
        'X-Source': 'BMA DDS Nong Chok Radar',
      },
    });
  } catch (err: any) {
    return new NextResponse(err?.message || 'Error fetching BMA radar', { status: 500 });
  }
}
