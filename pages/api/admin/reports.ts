import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseServer';

// GET: list all reports (admin server-side endpoint)
// Protected by x-admin-key header
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Protect admin endpoint with x-admin-key header
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing x-admin-key header' });
  }

  try {
    const { data, error } = await supabaseAdmin.from('reports').select('*').order('created_at', { ascending: false }).limit(1000);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: String(err) });
  }
}