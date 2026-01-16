```markdown
## Auth & Server API (résumé)

1. Variables d'environnement (Vercel / .env.local)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY    <-- MUST be set in Vercel (Production) and NOT committed

2. Pages/API ajoutées
   - /login (pages/login.tsx) : page d'auth (magic link)
   - /api/reports (pages/api/reports.ts) : insert report via server-side key (POST)
   - /api/admin/reports (pages/api/admin/reports.ts) : admin fetch (GET)
   - lib/supabaseClient.ts : client frontend (anon)
   - lib/supabaseServer.ts : client server-side (service_role)
   - lib/useAuth.tsx : hook d'auth simple

3. RLS
   - Si RLS activée, exécute db/rls_policies_for_auth.sql (ou adapte tes policies).
   - La clé service_role bypassera RLS pour les API server-side qui l'utilisent.

4. Déploiement Vercel
   - Définis les 3 variables d'environnement dans Project → Settings → Environment Variables.
   - Connecte ton repo et déploie. Les routes API utiliseront la clé service_role côté serveur.

5. Sécurité
   - Ne commit jamais SUPABASE_SERVICE_ROLE_KEY.
   - Pour opérations admin sensibles, protège endpoints (ex: basic auth, ou vérifie l'user JWT côté serveur).
```