import React, { useState } from 'react';
import { useAuth } from '../lib/useAuth';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      // Rediriger selon le rôle
      if (result.user.role === 'admin') {
        router.push('/admin/users');
      } else {
        router.push('/');
      }
    } else {
      setError(result.error || 'Erreur de connexion');
    }
  };

  return (
    <>
      <Head>
        <title>Connexion - Kamoa Supervision</title>
      </Head>

      {/* PLEIN ÉCRAN avec fixed inset-0 */}
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Content centered */}
        <div className="relative h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/30 mb-6">
                <i className="fas fa-hard-hat text-4xl text-white"></i>
              </div>
              <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
                Kamoa Supervision
              </h1>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <i className="fas fa-industry"></i>
                <span>Empire Manzaka - Système de Surveillance</span>
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Connexion</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <i className="fas fa-envelope text-amber-500"></i>
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johnym@kamoacopper"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <i className="fas fa-lock text-amber-500"></i>
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-400 flex items-start gap-3 animate-fade-in">
                    <i className="fas fa-exclamation-circle mt-0.5"></i>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Se connecter</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
                <i className="fas fa-shield-alt"></i>
                <span>Connexion sécurisée</span>
              </p>
              <p className="text-gray-600 text-xs">
                © 2026 Kamoa Copper - Tous droits réservés
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
