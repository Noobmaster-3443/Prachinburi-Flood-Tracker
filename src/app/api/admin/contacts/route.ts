import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, extractAdminTokenFromRequest } from '@/lib/auth-server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  const token = extractAdminTokenFromRequest(req);
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, message: `Contact ${id} deleted` });
}

export async function PATCH(req: NextRequest) {
  const token = extractAdminTokenFromRequest(req);
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const body = await req.json();
  const { id, is_approved } = body;

  if (!id || typeof is_approved !== 'boolean') {
    return NextResponse.json({ error: 'ID and is_approved boolean are required' }, { status: 400 });
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('emergency_contacts')
      .update({ is_approved })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, message: `Contact ${id} approval updated` });
}
