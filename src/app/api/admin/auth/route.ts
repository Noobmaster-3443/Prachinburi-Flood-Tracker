import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPin, generateAdminSessionToken } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pin = body?.pin || '';

    if (!validateAdminPin(pin)) {
      return NextResponse.json(
        { success: false, error: 'รหัสผ่าน PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' },
        { status: 401 }
      );
    }

    const token = generateAdminSessionToken();

    return NextResponse.json(
      {
        success: true,
        token,
        message: 'เข้าสู่ระบบผู้ดูแลระบบเรียบร้อย',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'ข้อผิดพลาดในการตรวจสอบสิทธิ์' },
      { status: 500 }
    );
  }
}
