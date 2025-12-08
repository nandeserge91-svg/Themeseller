# ThemePro - Marketplace de Thèmes & Templates Premium

![ThemePro](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop)

ThemePro est une marketplace multi-vendeurs francophone pour la vente de thèmes, templates et tunnels de vente téléchargeables, inspirée de ThemeForest.

## ✨ Fonctionnalités

### Pour les Clients
- 🛒 Parcourir et acheter des templates premium
- 🔍 Recherche avancée avec filtres (catégorie, prix, note)
- 💳 Paiement sécurisé via Stripe
- 📥 Téléchargement instantané après achat
- ⭐ Système de notes et avis
- 👤 Espace client complet

### Pour les Vendeurs
- 📊 Dashboard avec statistiques de ventes
- 📦 Gestion complète des produits
- 💰 Commission attractive (85% pour le vendeur)
- 📈 Suivi des revenus et téléchargements
- 🔔 Notifications de ventes

### Pour les Administrateurs
- 👥 Gestion des utilisateurs et vendeurs
- ✅ Validation des produits avant publication
- 🛡️ Modération des avis
- 📊 Statistiques globales
- ⚙️ Configuration de la plateforme

## 🛠️ Stack Technique

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: API Routes Next.js
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: JWT avec cookies HTTP-only
- **Paiement**: Stripe Checkout + Webhooks
- **État**: Zustand (panier, auth)

## 📁 Structure du Projet

```
src/
├── app/                    # App Router Next.js
│   ├── api/               # Routes API
│   │   ├── auth/          # Authentification
│   │   ├── products/      # CRUD produits
│   │   ├── orders/        # Commandes
│   │   ├── reviews/       # Avis
│   │   └── webhook/       # Webhooks Stripe
│   ├── admin/             # Espace admin
│   ├── vendeur/           # Espace vendeur
│   ├── mon-compte/        # Espace client
│   ├── produit/[slug]/    # Page produit
│   ├── produits/          # Liste produits
│   ├── panier/            # Panier
│   ├── checkout/          # Paiement
│   └── connexion/         # Auth
├── components/
│   ├── layout/            # Header, Footer, CartSidebar
│   └── ui/                # Composants réutilisables
├── lib/
│   ├── auth.ts            # Utilitaires auth
│   ├── db.ts              # Client Prisma
│   ├── stripe.ts          # Intégration Stripe
│   └── utils.ts           # Fonctions utilitaires
├── store/
│   ├── authStore.ts       # État authentification
│   └── cartStore.ts       # État panier
└── prisma/
    ├── schema.prisma      # Schéma base de données
    └── seed.ts            # Données initiales
```

## 🚀 Installation

### Prérequis
- Node.js 18+
- PostgreSQL
- Compte Stripe (pour les paiements)

### 1. Cloner et installer

```bash
git clone https://github.com/votre-repo/themepro.git
cd themepro
npm install
```

### 2. Configuration

Créez un fichier `.env` à la racine :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/themepro_db?schema=public"

# JWT
JWT_SECRET="votre-secret-jwt-tres-securise"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# URL de base
NEXTAUTH_URL="http://localhost:3000"

# Commission plateforme (%)
PLATFORM_COMMISSION=15
```

### 3. Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer le schéma
npm run db:push

# (Optionnel) Insérer les données de test
npm run db:seed
```

### 4. Lancer le serveur

```bash
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000)

## 👤 Comptes de Test

Après avoir exécuté le seed :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@themepro.fr | admin123456 |
| Vendeur | vendeur@themepro.fr | vendeur123456 |
| Client | client@themepro.fr | client123456 |

## 💳 Configuration Stripe

### Webhooks

Pour tester les webhooks en local, utilisez Stripe CLI :

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### Événements écoutés
- `checkout.session.completed` - Valide la commande
- `checkout.session.expired` - Annule la commande
- `payment_intent.payment_failed` - Log l'échec

## 📝 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # Linter
npm run db:generate  # Générer Prisma
npm run db:push      # Sync schéma
npm run db:migrate   # Migration
npm run db:studio    # Interface Prisma
npm run db:seed      # Seed données
```

## 🎨 Design System

### Couleurs Principales
- **Primary**: Indigo (#6366f1)
- **Secondary**: Violet (#8b5cf6)
- **Accent**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)

### Composants UI
- `Button` - Boutons avec variantes
- `Input` - Champs de formulaire
- `ProductCard` - Carte produit
- `CategoryCard` - Carte catégorie
- `StarRating` - Notes étoiles

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- Tokens JWT signés avec expiration
- Cookies HTTP-only et Secure
- Protection CSRF
- Validation des webhooks Stripe
- Routes protégées par rôle

## 📈 Améliorations Futures

- [ ] Stripe Connect pour paiements vendeurs
- [ ] Système de favoris
- [ ] Chat vendeur/client
- [ ] Notifications email
- [ ] Multi-langue
- [ ] Analytics avancés
- [ ] API publique
- [ ] Application mobile

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

Développé avec ❤️ pour la communauté francophone







