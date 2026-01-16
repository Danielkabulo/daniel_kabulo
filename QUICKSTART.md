# 🚀 Démarrage Rapide - Kamoa Supervision

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# Éditez .env.local avec vos clés Supabase

# 3. Lancer en développement
npm run dev
```

## Déploiement

### ⚡ Vercel (Recommandé)
```bash
# Via CLI
npm i -g vercel
vercel --prod
```

Ou via le [dashboard Vercel](https://vercel.com) → Import Git Repository

### 🐳 Docker
```bash
docker-compose up -d --build
```

## Variables d'Environnement Requises

```env
NEXT_PUBLIC_SUPABASE_URL=<votre-url-supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre-clé-anon>
SUPABASE_SERVICE_ROLE_KEY=<votre-clé-service-role>
```

## Scripts Disponibles

- `npm run dev` - Développement
- `npm run build` - Build production
- `npm start` - Démarrer en production
- `npm run lint` - Vérifier le code
- `npm run type-check` - Vérifier TypeScript

## 📖 Documentation

- [Guide de déploiement rapide](./DEPLOY-QUICK.md)
- [Guide de déploiement complet](./DEPLOYMENT.md)

## ✨ Améliorations Récentes

- ✅ Correction des erreurs de linting
- ✅ Amélioration de l'accessibilité (ARIA labels)
- ✅ Optimisation pour la production
- ✅ Configuration Docker optimisée
- ✅ Support Vercel prêt à l'emploi
- ✅ Headers de sécurité configurés
- ✅ Dependencies mises à jour
- ✅ Support Safari avec préfixes webkit
