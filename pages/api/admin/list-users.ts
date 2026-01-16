import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseServer';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vérifier le JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Configuration serveur manquante' });
    }

    // Décoder et vérifier le token
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    // Vérifier que l'utilisateur est admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Récupérer tous les utilisateurs (sans les password_hash)
    const { data: users, error: queryError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role, status, created_at')
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('Database error:', queryError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    return res.status(200).json({ users });
  } catch (err: any) {
    console.error('List users error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
