# 🚀 Guide de Déploiement - ThemePro

## Options de Déploiement

### Option 1: Vercel (Recommandé) ⭐

Vercel est créé par les développeurs de Next.js - c'est la solution la plus simple.

#### Étapes :

1. **Créez un compte** sur [vercel.com](https://vercel.com)

2. **Connectez votre dépôt Git** :
   - Poussez votre code sur GitHub/GitLab/Bitbucket
   - Importez le projet dans Vercel

3. **Configurez les variables d'environnement** dans Vercel Dashboard :
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=votre-clé-secrète
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
   ```

4. **Cliquez sur Deploy** !

---

### Option 2: Netlify

1. Créez un compte sur [netlify.com](https://netlify.com)
2. Connectez votre dépôt Git
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Ajoutez les variables d'environnement

---

### Option 3: Railway

Railway est idéal si vous voulez héberger la base de données et l'app ensemble.

1. Créez un compte sur [railway.app](https://railway.app)
2. Créez un nouveau projet
3. Ajoutez une base de données PostgreSQL
4. Déployez depuis GitHub
5. Les variables d'environnement sont auto-configurées pour la DB

---

## 📦 Base de Données PostgreSQL Gratuite

### Neon (Recommandé) 🌟
- **URL**: [neon.tech](https://neon.tech)
- **Gratuit**: 3 GB de stockage
- **Avantages**: Rapide, serverless, parfait pour Vercel

### Supabase
- **URL**: [supabase.com](https://supabase.com)
- **Gratuit**: 500 MB de stockage
- **Avantages**: Interface admin, fonctionnalités bonus

### Railway
- **URL**: [railway.app](https://railway.app)
- **Gratuit**: $5 de crédit/mois
- **Avantages**: Simple, tout-en-un

---

## 🔐 Variables d'Environnement

Créez ces variables dans votre hébergeur :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Clé secrète JWT (32+ caractères) | `votre-cle-tres-secrete-123` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | `whsec_...` |
| `NEXT_PUBLIC_APP_URL` | URL de votre site | `https://themepro.com` |

### Générer une clé JWT secrète :
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

---

## 💳 Configuration Stripe

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Obtenez vos clés API dans Dashboard > Developers > API Keys
3. Configurez le webhook :
   - URL: `https://votre-site.com/api/webhook/stripe`
   - Événements: `checkout.session.completed`

---

## 🗄️ Initialisation de la Base de Données

Après le déploiement, initialisez la base de données :

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push

# (Optionnel) Ajouter des données de démo
npx prisma db seed
```

Sur Vercel, vous pouvez ajouter ces commandes dans le build :
- Build Command: `npx prisma generate && npm run build`

---

## 🌐 Configuration du Domaine Personnalisé

### Sur Vercel :
1. Settings > Domains
2. Ajoutez votre domaine
3. Configurez les DNS chez votre registrar :
   - Type: CNAME
   - Name: @ ou www
   - Value: cname.vercel-dns.com

### Sur Netlify :
1. Domain settings > Add custom domain
2. Suivez les instructions DNS

---

## ✅ Checklist de Déploiement

- [ ] Code poussé sur GitHub/GitLab
- [ ] Base de données PostgreSQL créée
- [ ] Variables d'environnement configurées
- [ ] Compte Stripe créé et configuré
- [ ] Webhook Stripe configuré
- [ ] Domaine personnalisé (optionnel)
- [ ] SSL/HTTPS activé (automatique sur Vercel/Netlify)

---

## 🐛 Résolution de Problèmes

### Erreur "Database connection failed"
- Vérifiez que `DATABASE_URL` est correcte
- Ajoutez `?sslmode=require` à la fin de l'URL

### Erreur "Module not found: prisma"
- Ajoutez `npx prisma generate` dans le build command

### Pages 404 après déploiement
- Vérifiez que le build s'est terminé sans erreur
- Redéployez si nécessaire

### Stripe webhooks ne fonctionnent pas
- Vérifiez l'URL du webhook
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct

---

## 📞 Support

Pour toute question, consultez :
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Prisma](https://prisma.io/docs)
- [Documentation Stripe](https://stripe.com/docs)


