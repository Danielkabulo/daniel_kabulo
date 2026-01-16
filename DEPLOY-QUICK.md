# Kamoa Supervision - Guide de Déploiement Rapide 🚀

## ⚡ Déploiement Express sur Vercel (5 minutes)

### 1. Préparez Supabase
```bash
# Allez sur https://app.supabase.com
# Créez un nouveau projet
# Exécutez les scripts SQL dans cet ordre :
# - db/init.sql
# - db/rls_policies.sql (si nécessaire)
```

### 2. Configurez le projet
```bash
# Clonez et installez
git clone <votre-repo>
cd kabulo
npm install

# Copiez .env.example vers .env.local
cp .env.example .env.local

# Remplissez vos clés Supabase dans .env.local
```

### 3. Déployez sur Vercel

**Option A : Via Dashboard (Recommandé)**
1. Allez sur [vercel.com](https://vercel.com)
2. "New Project" → Importez votre repo GitHub
3. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Cliquez sur "Deploy"

**Option B : Via CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🐳 Déploiement avec Docker

```bash
# 1. Créez un fichier .env avec vos variables Supabase
# 2. Build et lancez
docker-compose up -d --build

# Vérifiez
docker-compose logs -f app

# Accédez à http://localhost:3000
```

---

## ✅ Vérifications Post-Déploiement

1. ✅ Application accessible
2. ✅ Connexion Supabase OK
3. ✅ Realtime fonctionne (table reports)
4. ✅ Les unités s'affichent
5. ✅ Création de rapports fonctionne

---

## 🔧 Troubleshooting

**Erreur "Cannot connect to Supabase"**
- Vérifiez vos variables d'environnement
- Assurez-vous que l'URL Supabase est correcte

**Erreur 404 sur les API routes**
- Redéployez l'application
- Vérifiez que les fichiers dans `/pages/api/` sont bien présents

**Les rapports ne s'enregistrent pas**
- Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est configurée
- Vérifiez les tables dans Supabase

---

## 📚 Documentation Complète

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour la documentation détaillée.

---

## 🎯 Commandes Utiles

```bash
# Développement local
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Vérifier le typage TypeScript
npm run type-check

# Linter
npm run lint
```

---

## 📞 Support

- Documentation Next.js : https://nextjs.org/docs
- Documentation Supabase : https://supabase.com/docs
- Documentation Vercel : https://vercel.com/docs
