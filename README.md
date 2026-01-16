# Kamoa Supervision - Next.js + Supabase

Application de supervision avec authentification Supabase, base de données temps réel et API protégées.

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration des variables d'environnement

Copiez `.env.local.example` vers `.env.local` et remplissez les valeurs :

```bash
cp .env.local.example .env.local
```

Variables requises :
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anon (publique) de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service_role (⚠️ STRICTEMENT côté serveur, NE JAMAIS EXPOSER)
- `ADMIN_API_KEY` : Clé secrète pour protéger les endpoints `/api/admin/*`

### 3. Configuration de la base de données Supabase

#### a) Créer les tables et données initiales

Dans le SQL Editor de Supabase, exécutez :

```bash
# Contenu du fichier db/init.sql
```

Ce script créera :
- Extension `pgcrypto` pour les UUID
- Table `units` (unités de production)
- Table `faults_library` (bibliothèque des défauts)
- Table `reports` (rapports d'incidents)
- Données de seed pour 11 unités et 7 types de défauts

#### b) Configurer les politiques RLS (Row Level Security)

Dans le SQL Editor de Supabase, exécutez :

```bash
# Contenu du fichier db/rls_policies_for_auth.sql
```

Ce script configure :
- RLS activé sur toutes les tables
- Lecture publique des unités (pour la UI)
- Lecture/écriture authentifiée pour reports et faults_library

### 4. Développement local

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📦 Structure du projet

```
├── lib/
│   ├── supabaseClient.ts       # Client Supabase côté frontend (anon key)
│   ├── supabaseServer.ts       # Client Supabase côté serveur (service_role key)
│   └── useAuth.tsx             # Hook d'authentification React
├── pages/
│   ├── _app.tsx                # Configuration Next.js avec AuthProvider
│   ├── index.tsx               # Page d'accueil (dashboard)
│   ├── login.tsx               # Page de connexion (magic link)
│   └── api/
│       ├── reports.ts          # API POST pour créer des reports
│       └── admin/
│           └── reports.ts      # API GET admin protégée par x-admin-key
├── db/
│   ├── init.sql                # Script d'initialisation de la DB
│   └── rls_policies_for_auth.sql  # Politiques de sécurité RLS
├── styles/
│   └── globals.css             # Styles Tailwind CSS
├── Dockerfile                  # Configuration Docker pour production
└── .github/workflows/ci.yml    # CI/CD GitHub Actions
```

## 🔐 Sécurité

### Protection des endpoints admin

Tous les endpoints sous `/api/admin/*` sont protégés par le header `x-admin-key` :

```typescript
// Exemple dans pages/api/admin/reports.ts
const adminKey = req.headers['x-admin-key'];
const expectedKey = process.env.ADMIN_API_KEY;

if (!adminKey || adminKey !== expectedKey) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

### ⚠️ Ne jamais committer de secrets

- ✅ Utilisez `.env.local` pour le développement (ignoré par git)
- ✅ Configurez les variables dans Vercel pour la production
- ❌ Ne commitez JAMAIS `.env` ou `.env.local`
- ❌ Ne commitez JAMAIS `SUPABASE_SERVICE_ROLE_KEY`

## 🌐 Déploiement sur Vercel

### 1. Connecter votre repository

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Import Project"
3. Sélectionnez votre repository GitHub

### 2. Configurer les variables d'environnement

Dans Vercel → Project → Settings → Environment Variables, ajoutez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Clé anon de Supabase (publique) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Clé service_role (⚠️ sensible) |
| `ADMIN_API_KEY` | `your-secure-random-key` | Clé pour protéger /api/admin/* |

**Astuce** : Générez une clé sécurisée pour `ADMIN_API_KEY` :
```bash
openssl rand -hex 32
```

### 3. Déployer

Vercel déploiera automatiquement à chaque push sur la branche `main`.

## 🧪 Tester l'application

### Test de l'endpoint public

```bash
# POST: Créer un rapport (nécessite un token utilisateur authentifié)
curl -X POST https://your-app.vercel.app/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_USER_JWT" \
  -d '{
    "unit_id": "CV001",
    "status": "fault",
    "description": "Test report",
    "start_time": "2026-01-16T10:00:00Z"
  }'
```

### Test de l'endpoint admin protégé

```bash
# GET: Lister tous les rapports (protégé par x-admin-key)
curl -X GET https://your-app.vercel.app/api/admin/reports \
  -H "x-admin-key: your-secure-random-key"
```

**Réponse attendue (succès)** :
```json
{
  "data": [
    {
      "id": "uuid...",
      "unit_id": "CV001",
      "status": "fault",
      "description": "...",
      "created_at": "2026-01-16T10:00:00Z"
    }
  ]
}
```

**Réponse attendue (erreur 401)** si `x-admin-key` est manquant/incorrect :
```json
{
  "error": "Unauthorized: Invalid or missing x-admin-key header"
}
```

## 🛠️ Build et production

### Build local

```bash
npm run build
npm start
```

### Docker

```bash
# Build l'image
docker build -t kamoa-supervision .

# Run le container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJ... \
  -e ADMIN_API_KEY=your-key \
  kamoa-supervision
```

## 📚 Pages et fonctionnalités

- **`/`** : Dashboard principal (liste des unités et rapports)
- **`/login`** : Page de connexion (magic link Supabase Auth)
- **`/api/reports`** : API pour créer des rapports (POST, authentifié)
- **`/api/admin/reports`** : API admin pour lister tous les rapports (GET, protégé par header)

## 🔧 Scripts SQL

### Exécuter db/init.sql

1. Ouvrez Supabase Dashboard → SQL Editor
2. Copiez le contenu de `db/init.sql`
3. Exécutez le script

### Exécuter db/rls_policies_for_auth.sql

1. Ouvrez Supabase Dashboard → SQL Editor
2. Copiez le contenu de `db/rls_policies_for_auth.sql`
3. Exécutez le script

**Note** : Les scripts sont idempotents (utilisent `if not exists` et `on conflict do nothing`).

## 📝 CI/CD

Le workflow GitHub Actions (`.github/workflows/ci.yml`) exécute automatiquement :
- `npm ci` : Installation des dépendances
- `npm run build` : Build de production

Sur chaque push/PR vers `main` ou `master`.

## 🤝 Contribution

1. Créez une branche feature
2. Commitez vos changements
3. Poussez vers GitHub
4. Ouvrez une Pull Request

## 📄 Licence

Privé - Kamoa Supervision