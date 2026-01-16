# Guide de Déploiement - Kamoa Supervision

Ce document explique comment déployer l'application Kamoa Supervision sur différentes plateformes.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration](#configuration)
3. [Déploiement sur Vercel](#déploiement-sur-vercel)
4. [Déploiement avec Docker](#déploiement-avec-docker)
5. [Configuration Supabase](#configuration-supabase)

---

## Prérequis

- Node.js 18+ installé
- Compte Supabase avec un projet créé
- Git installé
- Compte Vercel (pour déploiement Vercel) ou Docker (pour déploiement Docker)

---

## Configuration

### 1. Variables d'environnement

Copiez `.env.example` vers `.env.local` pour le développement local :

```bash
cp .env.example .env.local
```

Remplissez les variables avec vos valeurs Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS votre fichier `.env.local` ou vos clés secrètes !

### 2. Installation des dépendances

```bash
npm install
```

### 3. Test en local

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## Déploiement sur Vercel

### Méthode 1 : Via Vercel Dashboard (Recommandé)

1. **Connectez votre repository GitHub à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "New Project"
   - Importez votre repository GitHub

2. **Configurez les variables d'environnement**
   - Dans les paramètres du projet → Environment Variables
   - Ajoutez les 3 variables suivantes :
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Assurez-vous de les ajouter pour **Production**, **Preview**, et **Development**

3. **Déployez**
   - Vercel déploiera automatiquement à chaque push sur la branche principale

### Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour déployer en production
vercel --prod
```

**Configuration des variables d'environnement via CLI :**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

---

## Déploiement avec Docker

### Prérequis Docker

- Docker installé
- Docker Compose installé (optionnel mais recommandé)

### Méthode 1 : Docker Compose (Recommandé)

1. **Créez un fichier `.env` à la racine** :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
```

2. **Build et lancez le container** :

```bash
docker-compose up -d --build
```

3. **Vérifiez les logs** :

```bash
docker-compose logs -f app
```

4. **Accédez à l'application** : [http://localhost:3000](http://localhost:3000)

5. **Arrêter l'application** :

```bash
docker-compose down
```

### Méthode 2 : Docker seul

```bash
# Build l'image
docker build -t kamoa-supervision .

# Lancer le container
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon \
  -e SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role \
  --name kamoa-app \
  kamoa-supervision
```

### Commandes Docker utiles

```bash
# Voir les containers en cours
docker ps

# Voir les logs
docker logs kamoa-app -f

# Arrêter le container
docker stop kamoa-app

# Redémarrer le container
docker restart kamoa-app

# Supprimer le container
docker rm kamoa-app
```

---

## Configuration Supabase

### 1. Créer les tables

Exécutez les scripts SQL dans l'ordre suivant via l'interface Supabase SQL Editor :

```bash
1. db/init.sql          # Crée les tables de base
2. db/rls_policies.sql  # Configure les politiques RLS (si besoin)
```

### 2. Tables requises

- **units** : Liste des unités de production
- **faults_library** : Bibliothèque des pannes
- **reports** : Rapports de production

### 3. Configuration RLS (Row Level Security)

Si vous utilisez RLS, exécutez `db/rls_policies_for_auth.sql` pour configurer les politiques d'accès.

**Note** : L'application utilise la clé `service_role` pour les opérations serveur qui bypasse RLS.

### 4. Realtime

Activez Realtime pour la table `reports` :

1. Allez dans Database → Replication
2. Ajoutez la table `reports` aux publications Realtime

---

## Mise à jour de l'application

### Sur Vercel

Les mises à jour sont automatiques avec chaque push sur GitHub.

### Avec Docker

```bash
# Pull les dernières modifications
git pull

# Rebuild et redémarrer
docker-compose up -d --build
```

---

## Troubleshooting

### Erreur de connexion Supabase

- Vérifiez que les variables d'environnement sont correctement configurées
- Assurez-vous que l'URL Supabase est accessible
- Vérifiez les clés API dans votre dashboard Supabase

### L'application ne démarre pas avec Docker

```bash
# Vérifiez les logs
docker-compose logs app

# Vérifiez les variables d'environnement
docker-compose config
```

### Erreurs de build

```bash
# Nettoyez le cache et rebuilder
rm -rf .next node_modules
npm install
npm run build
```

---

## Support

Pour toute question ou problème, consultez la documentation officielle :

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
