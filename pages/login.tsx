import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/useAuth';
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();

  const sendMagicLink = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setStatus('Envoi du lien...');
    const { error } = await supabase.auth.signInWithOtp({ email });
    setIsLoading(false);
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
      
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Animated background elements - mining theme */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Content */}
        <div className="relative min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            
            {/* Logo/Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/30 mb-4">
                <i className="fas fa-hard-hat text-3xl text-white"></i>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Kamoa Supervision
              </h1>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <i className="fas fa-industry"></i>
                <span>Empire Manzaka - Système de Surveillance</span>
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8">
              
              {user ? (
                // Logged in state
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <i className="fas fa-check text-green-400"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Connecté en tant que</p>
                      <p className="font-semibold text-white truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
                    onClick={() => signOut()}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Se déconnecter
                  </button>
                </div>
              ) : (
                // Login form
                <form onSubmit={sendMagicLink} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                      <i className="fas fa-envelope text-amber-500"></i>
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operateur@kamoa.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Envoyer le lien de connexion</span>
                      </>
                    )}
                  </button>

                  {status && (
                    <div className={`p-4 rounded-xl border ${
                      status.includes('Erreur') 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    } flex items-start gap-3 animate-fade-in`}>
                      <i className={`fas ${status.includes('Erreur') ? 'fa-exclamation-circle' : 'fa-info-circle'} mt-0.5`}></i>
                      <p className="text-sm">{status}</p>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Footer info */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
                <i className="fas fa-shield-alt"></i>
                <span>Connexion sécurisée via lien magique</span>
              </p>
              <p className="text-gray-600 text-xs">
                © 2026 Kamoa Copper - Tous droits réservés
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
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