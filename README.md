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

### Variables d'environnement (Netlify / Vercel / .env.local)
- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - ⚠️ **MUST be set in deployment platform and NOT committed**
- `JWT_SECRET` - ⚠️ **Secret key for JWT tokens (min 32 characters) - NEVER commit this**

### Système d'authentification (JWT)

**Login avec Email/Password**:
- Page de connexion plein écran: `/login`
- Authentification via JWT tokens (expiration: 24h)
- Mots de passe sécurisés avec bcrypt

**Compte Admin par défaut**:
- Email: `johnym@kamoacopper`
- Password: `Johnnyka@4569801` (à changer après première connexion)

**Initialisation**:
1. Exécuter `db/users_table.sql` dans Supabase
2. Appeler `POST /api/auth/init-admin` pour créer le compte admin
3. Se connecter avec les credentials admin

### Pages/API

**Authentification**:
- `/login` - Page de connexion email/password
- `POST /api/auth/login` - Authentification utilisateur
- `POST /api/auth/init-admin` - Initialisation du compte admin

**Administration** (Admin uniquement):
- `/admin/users` - Gestion des utilisateurs
- `POST /api/admin/create-user` - Créer un utilisateur
- `GET /api/admin/list-users` - Lister tous les utilisateurs
- `GET /api/admin/reports` - Admin fetch reports

**Rapports**:
- `POST /api/reports` - Insert report via server-side key

**Bibliothèques**:
- `lib/supabaseClient.ts` - Client frontend (anon)
- `lib/supabaseServer.ts` - Client server-side (service_role)
- `lib/useAuth.tsx` - Hook d'authentification JWT

### Sécurité
- ⚠️ Ne commit jamais `SUPABASE_SERVICE_ROLE_KEY` ou `JWT_SECRET`
- Mots de passe hashés avec bcrypt (10 salt rounds)
- JWT tokens avec expiration 24h
- Vérification de rôle admin sur endpoints protégés
- Validation d'entrée sur tous les formulaires
- Protection CSRF via tokens JWT

### Guide de test
Voir [TESTING_GUIDE.md](./TESTING_GUIDE.md) pour les instructions complètes de test après déploiement.

## 📚 Documentation

- [Guide de déploiement rapide](./DEPLOY-QUICK.md)
- [Guide de déploiement complet](./DEPLOYMENT.md)
- [Changelog](./CHANGELOG.md)

## ✨ Fonctionnalités

- ✅ Authentification email/password avec JWT
- ✅ Gestion des utilisateurs par administrateur
- ✅ Mots de passe sécurisés (bcrypt)
- ✅ Gestion des rapports de production
- ✅ Bibliothèque de pannes
- ✅ Temps réel avec Supabase
- ✅ 3 thèmes (iOS, SCADA, Classic)
- ✅ Interface responsive
- ✅ Export de rapports

## 🛠️ Technologies

- Next.js 15
- TypeScript
- Supabase (PostgreSQL)
- JWT Authentication
- bcryptjs (password hashing)
- Tailwind CSS
- Docker

---

**Développé pour Kamoa Copper - Empire Manzaka**
