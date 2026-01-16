# Kamoa Supervision - Empire Manzaka

Application de supervision pour le réseau de convoyeurs Kamoa 1.

## 🚀 Démarrage Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# Éditez .env.local avec vos clés Supabase

# 3. Lancer en développement
npm run dev
```

## Auth & Server API

### Variables d'environnement (Vercel / .env.local)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **MUST be set in Vercel (Production) and NOT committed**

### Pages/API ajoutées
- `/login` - Page d'authentification (magic link)
- `/api/reports` - Insert report via server-side key (POST)
- `/api/admin/reports` - Admin fetch (GET)
- `lib/supabaseClient.ts` - Client frontend (anon)
- `lib/supabaseServer.ts` - Client server-side (service_role)
- `lib/useAuth.tsx` - Hook d'auth simple

### RLS (Row Level Security)
- Si RLS activée, exécute `db/rls_policies_for_auth.sql`
- La clé service_role bypassera RLS pour les API server-side

### Déploiement Vercel
- Définis les 3 variables d'environnement dans Project → Settings → Environment Variables
- Connecte ton repo et déploie
- Les routes API utiliseront la clé service_role côté serveur

### Sécurité
- ⚠️ Ne commit jamais `SUPABASE_SERVICE_ROLE_KEY`
- Pour opérations admin sensibles, protège endpoints (ex: basic auth, ou vérifie l'user JWT côté serveur)

## 📚 Documentation

- [Guide de déploiement rapide](./DEPLOY-QUICK.md)
- [Guide de déploiement complet](./DEPLOYMENT.md)
- [Changelog](./CHANGELOG.md)

## ✨ Fonctionnalités

- ✅ Gestion des rapports de production
- ✅ Bibliothèque de pannes
- ✅ Temps réel avec Supabase
- ✅ 3 thèmes (iOS, SCADA, Classic)
- ✅ Interface responsive
- ✅ Export de rapports

## 🛠️ Technologies

- Next.js 14
- TypeScript
- Supabase
- Tailwind CSS
- Docker

---

**Développé pour Kamoa Copper - Empire Manzaka**
