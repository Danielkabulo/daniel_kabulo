import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Décoder le JWT (simple, sans vérification - la vérification est côté serveur)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Vérifier si le token est expiré
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token expiré, le supprimer
          localStorage.removeItem('auth_token');
        } else {
          setUser(payload);
        }
      } catch (e) {
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error };
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, signIn, signOut };
}
