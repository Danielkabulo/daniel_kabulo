import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseServer';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vérifier si un admin existe déjà
    const { data: existingAdmins, error: queryError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (queryError) {
      console.error('Database error:', queryError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return res.status(200).json({ message: 'Admin already exists' });
    }

    // Créer le compte admin initial
    // NOTE: Password is hard-coded as per requirements for initial admin account.
    // This endpoint should be called once during initial setup, then the admin
    // can change their password through a password change endpoint (to be implemented).
    const password = 'Johnnyka@4569801';
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newAdmin, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: 'johnym@kamoacopper',
          name: 'Johnny M (Admin)',
          password_hash: passwordHash,
          role: 'admin',
          status: 'active',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ error: 'Erreur lors de la création de l\'admin' });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin created',
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    });
  } catch (err: any) {
    console.error('Init admin error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
