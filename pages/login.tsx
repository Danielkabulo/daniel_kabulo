import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/useAuth';
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const sendMagicLink = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setStatus('Envoi du lien...');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setStatus('Erreur: ' + error.message);
    } else {
      setStatus('Lien envoyé — vérifie ta boîte mail.');
    }
  };

  return (
    <>
      <Head>
        <title>Login - Kamoa Supervision</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/5 p-6 rounded-2xl glass-panel">
          <h2 className="text-xl font-bold mb-4">Connexion</h2>

          {user ? (
            <div>
              <p className="mb-2">Connecté en tant que: <strong>{user.email}</strong></p>
              <button className="px-4 py-2 bg-red-600 rounded" onClick={() => signOut()}>Se déconnecter</button>
            </div>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-3">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="ios-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@example.com"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Envoyer lien</button>
                <button type="button" className="px-4 py-2 bg-gray-600 text-white rounded" onClick={() => { setEmail('') }}>Effacer</button>
              </div>
              {status && <p className="text-sm mt-2">{status}</p>}
            </form>
          )}
        </div>
      </div>
    </>
  );
}