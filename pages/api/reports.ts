import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseServer';

// POST: insert a report (server-side, uses service_role key).
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { unit_id, status, emoji, description, raw_message } = req.body;
  if (!unit_id || !status) return res.status(400).json({ error: 'unit_id and status are required' });

  try {
    const now = new Date().toISOString();
    const payload = { unit_id, status, emoji: emoji ?? null, description: description ?? null, raw_message: raw_message ?? null, created_at: now };

    const { data, error } = await supabaseAdmin.from('reports').insert([payload]).select().limit(1);

    if (error) {
      console.error('Insert report error', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ data: (data && data[0]) ?? null });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}