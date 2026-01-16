# Kamoa Supervision - Supabase Integration

Application Next.js intégrant Supabase pour l'authentification, la base de données et le temps réel.

## 📋 Fonctionnalités

- ✅ Authentification Supabase (Magic Link)
- ✅ Base de données PostgreSQL via Supabase
- ✅ API Routes protégées (admin endpoints avec header protection)
- ✅ RLS (Row Level Security) policies
- ✅ Client/Server Supabase separation
- ✅ Docker support
- ✅ CI/CD avec GitHub Actions
- ✅ **Next.js 14.2.35** (version sécurisée, corrige les vulnérabilités CVE)

## 🔒 Sécurité

**Version Next.js mise à jour :** Ce projet utilise Next.js 14.2.35, qui corrige les vulnérabilités de sécurité critiques présentes dans les versions antérieures :
- ✅ Denial of Service (DoS) avec Server Components
- ✅ Authorization Bypass dans Middleware
- ✅ Server-Side Request Forgery (SSRF)
- ✅ HTTP Request Smuggling

## 🚀 Configuration & Déploiement

### 1. Configuration Supabase

#### A. Créer un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `Project URL` et vos clés API

#### B. Initialiser la base de données
Exécutez les scripts SQL dans l'ordre dans le SQL Editor de Supabase :

```bash
# 1. Créer les tables et insérer les données initiales
# Copiez le contenu de db/init.sql dans le SQL Editor de Supabase et exécutez-le

# 2. Configurer les politiques RLS (Row Level Security)
# Copiez le contenu de db/rls_policies_for_auth.sql dans le SQL Editor et exécutez-le
```

**Fichiers SQL:**
- `db/init.sql` - Crée les tables (units, faults_library, reports) et insère les données de test
- `db/rls_policies_for_auth.sql` - Active RLS et configure les policies d'accès

### 2. Variables d'Environnement

#### Variables requises :

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (anon) | Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role (⚠️ PRIVÉE) | Settings → API → service_role (secret) |
| `ADMIN_API_KEY` | Clé pour protéger les endpoints admin | Générer une clé aléatoire sécurisée |

#### Configuration locale (.env.local)

```bash
# Copiez .env.local.example vers .env.local
cp .env.local.example .env.local

# Éditez .env.local et remplissez vos valeurs
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_API_KEY=votre-cle-secrete-aleatoire-123456
```

⚠️ **IMPORTANT**: Ne committez JAMAIS le fichier `.env.local` ! Il doit être dans `.gitignore`.

#### Configuration Vercel (Production)

1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez les 4 variables ci-dessus :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Cochez "Sensitive" pour cette variable
   - `ADMIN_API_KEY` ⚠️ Cochez "Sensitive" pour cette variable
4. Redéployez votre application

### 3. Installation & Développement

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# L'application sera disponible sur http://localhost:3000
```

### 4. Build & Production

```bash
# Build pour production
npm run build

# Lancer en production
npm start
```

### 5. Docker

```bash
# Build l'image Docker
docker build -t kamoa-supervision .

# Lancer le container (avec variables d'environnement)
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJ... \
  -e ADMIN_API_KEY=your-key \
  kamoa-supervision
```

## 🔐 Sécurité

### Row Level Security (RLS)

Les policies RLS sont configurées dans `db/rls_policies_for_auth.sql` :

- **units** : Lecture publique (SELECT pour tous)
- **reports** : SELECT/INSERT pour utilisateurs authentifiés uniquement
- **faults_library** : SELECT/INSERT pour utilisateurs authentifiés uniquement

### Protection des Endpoints Admin

Les routes API admin (`/api/admin/*`) sont protégées par un header HTTP :

```bash
# Exemple d'appel à l'API admin
curl -H "x-admin-key: your-secure-admin-key" \
  https://your-app.vercel.app/api/admin/reports
```

**Implémentation :**
- Le header `x-admin-key` doit correspondre à la variable d'environnement `ADMIN_API_KEY`
- Si absent ou incorrect → 401 Unauthorized
- Si non configuré sur le serveur → 500 Internal Server Error

### Bonnes Pratiques de Sécurité

✅ **À FAIRE :**
- Utiliser des clés aléatoires fortes pour `ADMIN_API_KEY` (32+ caractères)
- Stocker `SUPABASE_SERVICE_ROLE_KEY` uniquement côté serveur
- Activer RLS sur toutes les tables sensibles
- Utiliser HTTPS en production
- Renouveler régulièrement `ADMIN_API_KEY`

❌ **À NE PAS FAIRE :**
- Committer `.env.local` ou des clés secrètes dans Git
- Exposer `SUPABASE_SERVICE_ROLE_KEY` côté client
- Utiliser `ADMIN_API_KEY` dans le code frontend
- Désactiver RLS sans raison valable

## 📁 Structure du Projet

```
.
├── pages/
│   ├── _app.tsx              # App wrapper avec Supabase context
│   ├── index.tsx             # Page d'accueil avec formulaire de rapport
│   ├── login.tsx             # Page d'authentification (magic link)
│   └── api/
│       ├── reports.ts        # POST - Créer un rapport (service_role)
│       └── admin/
│           └── reports.ts    # GET - Liste des rapports (protégé par header)
├── lib/
│   ├── supabaseClient.ts     # Client Supabase côté client (anon key)
│   ├── supabaseServer.ts     # Client Supabase côté serveur (service_role)
│   └── useAuth.tsx           # Hook d'authentification React
├── db/
│   ├── init.sql              # Script d'initialisation de la DB
│   └── rls_policies_for_auth.sql  # Policies RLS
├── styles/
│   └── globals.css           # Styles Tailwind CSS
├── .github/workflows/
│   └── ci.yml                # GitHub Actions CI
├── Dockerfile                # Configuration Docker
├── .env.local.example        # Template des variables d'environnement
└── README.md                 # Ce fichier
```

## 🧪 Tests

### Tester l'endpoint admin

```bash
# Sans header (doit retourner 401)
curl https://localhost:3000/api/admin/reports

# Avec mauvais header (doit retourner 401)
curl -H "x-admin-key: wrong-key" https://localhost:3000/api/admin/reports

# Avec bon header (doit retourner les données)
curl -H "x-admin-key: your-secure-admin-key" https://localhost:3000/api/admin/reports
```

### Tester l'authentification

1. Allez sur `/login`
2. Entrez votre email
3. Vérifiez votre boîte mail pour le magic link
4. Cliquez sur le lien pour vous connecter
5. Vous serez redirigé vers la page d'accueil

### Tester la création de rapport

1. Connectez-vous via `/login`
2. Sur la page d'accueil, sélectionnez une unité
3. Choisissez un statut et ajoutez une description
4. Soumettez le formulaire
5. Le rapport sera créé via `/api/reports` avec la clé service_role

## 📚 Documentation Supplémentaire

- [Documentation Supabase](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

## 🐛 Troubleshooting

### Erreur : "Missing NEXT_PUBLIC_SUPABASE_* env variables"
→ Vérifiez que les variables d'environnement sont bien configurées dans `.env.local`

### Erreur : "Missing SUPABASE env vars for server client"
→ Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est définie côté serveur

### Erreur 401 sur `/api/admin/reports`
→ Vérifiez que le header `x-admin-key` correspond à `ADMIN_API_KEY`

### Les tables n'existent pas
→ Exécutez `db/init.sql` dans le SQL Editor de Supabase

### RLS bloque mes requêtes
→ Vérifiez que les policies sont correctement configurées avec `db/rls_policies_for_auth.sql`
→ Les API routes utilisant `supabaseAdmin` (service_role) bypassent RLS

## 📝 License

MIT