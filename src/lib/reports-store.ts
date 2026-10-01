import { FloodReport } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'prachinburi_flood_reports_prod_v1';

export async function getReports(): Promise<FloodReport[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('flood_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as FloodReport[];
      }
      console.warn('Supabase query returned empty or error, falling back to local storage:', error);
    } catch (err) {
      console.error('Supabase error:', err);
    }
  }

  // Fallback to localStorage (clean community reports)
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read localStorage:', e);
    }
  }

  // Ready for real production usage - starts with clean empty list
  return [];
}

export async function createReport(
  newReport: Omit<FloodReport, 'id' | 'created_at' | 'upvotes'>,
  imageBlob?: Blob
): Promise<FloodReport> {
  const reportId = 'rep-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  let finalImageUrl = newReport.image_url;

  // If Supabase is configured and imageBlob is supplied, upload to Storage bucket
  if (isSupabaseConfigured && supabase && imageBlob) {
    try {
      const filename = `${reportId}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('flood-images')
        .upload(filename, imageBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('flood-images')
          .getPublicUrl(filename);
        if (publicUrlData?.publicUrl) {
          finalImageUrl = publicUrlData.publicUrl;
        }
      } else {
        console.error('Image upload failed:', uploadError);
      }
    } catch (err) {
      console.error('Error during Supabase upload:', err);
    }
  }

  const reportToSave: FloodReport = {
    ...newReport,
    id: reportId,
    created_at: now,
    image_url: finalImageUrl,
    upvotes: 0,
  };

  // Try saving to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('flood_reports')
        .insert([reportToSave]);

      if (error) {
        console.error('Error inserting report to Supabase:', error);
      } else {
        return reportToSave;
      }
    } catch (err) {
      console.error('Supabase insert exception:', err);
    }
  }

  // Save to localStorage
  if (typeof window !== 'undefined') {
    try {
      const existing = await getReports();
      const updated = [reportToSave, ...existing];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage:', e);
    }
  }

  return reportToSave;
}

export async function upvoteReport(id: string): Promise<number> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.rpc('increment_upvotes', { report_id: id });
      if (typeof data === 'number') return data;
    } catch (e) {
      console.warn('RPC not configured or failed, updating locally', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = await getReports();
      const updated = existing.map((r) =>
        r.id === id ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      const target = updated.find((r) => r.id === id);
      return target?.upvotes || 1;
    } catch (e) {
      console.error(e);
    }
  }

  return 1;
}

export async function deleteReport(id: string): Promise<boolean> {
  // If Supabase is configured, delete from database
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('flood_reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete report from Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
  }

  // Delete from localStorage
  if (typeof window !== 'undefined') {
    try {
      const existing = await getReports();
      const updated = existing.filter((r) => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Failed to update localStorage after delete:', e);
      return false;
    }
  }

  return true;
}

export async function toggleVerifyReport(id: string, isVerified: boolean): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('flood_reports')
        .update({ is_verified: isVerified })
        .eq('id', id);

      if (error) {
        console.error('Failed to update verified status in Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase update verified exception:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = await getReports();
      const updated = existing.map((r) =>
        r.id === id ? { ...r, is_verified: isVerified } : r
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  return true;
}

export async function clearAllReports(): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('flood_reports').delete().neq('id', '');
    } catch (e) {
      console.error(e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return true;
}
