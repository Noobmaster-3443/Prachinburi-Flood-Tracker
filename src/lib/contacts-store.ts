import { EmergencyContact } from '@/types';
import { DEFAULT_OFFICIAL_CONTACTS } from '@/data/emergency-contacts';
import { supabase, isSupabaseConfigured } from './supabase';

const CONTACTS_STORAGE_KEY = 'prachinburi_emergency_contacts_prod_v1';

export async function getEmergencyContacts(includePending = false): Promise<EmergencyContact[]> {
  // If Supabase is configured
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('emergency_contacts').select('*').order('created_at', { ascending: false });
      if (!includePending) {
        query = query.eq('is_approved', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as EmergencyContact[];
      }
    } catch (e) {
      console.error('Supabase getEmergencyContacts error:', e);
    }
  }

  // LocalStorage fallback
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (saved) {
        const parsed: EmergencyContact[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return includePending ? parsed : parsed.filter((c) => c.is_approved);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return includePending ? DEFAULT_OFFICIAL_CONTACTS : DEFAULT_OFFICIAL_CONTACTS.filter((c) => c.is_approved);
}

export async function suggestEmergencyContact(
  contactData: Omit<EmergencyContact, 'id' | 'is_approved' | 'is_official' | 'created_at'>
): Promise<EmergencyContact> {
  const newContact: EmergencyContact = {
    ...contactData,
    id: 'contact-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    is_approved: false, // Must be approved by admin before public display!
    is_official: false,
    created_at: new Date().toISOString(),
  };

  // Try saving to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('emergency_contacts').insert([newContact]);
      if (error) console.error('Supabase suggestEmergencyContact error:', error);
    } catch (err) {
      console.error(err);
    }
  }

  // Save to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const all = await getEmergencyContacts(true);
      const updated = [newContact, ...all];
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  return newContact;
}

export async function approveEmergencyContact(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('emergency_contacts').update({ is_approved: true }).eq('id', id);
    } catch (e) {
      console.error(e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const all = await getEmergencyContacts(true);
      const updated = all.map((c) => (c.id === id ? { ...c, is_approved: true } : c));
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error(e);
    }
  }

  return true;
}

export async function deleteEmergencyContact(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('emergency_contacts').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const all = await getEmergencyContacts(true);
      const updated = all.filter((c) => c.id !== id);
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error(e);
    }
  }

  return true;
}
