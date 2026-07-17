# MarocMarket

La première marketplace marocaine moderne — Une plateforme de petites annonces inspirée d'Avito, mais plus rapide, plus moderne et plus complète.

## Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Langage**: TypeScript 5.6 (strict)
- **Design**: Tailwind CSS 3.4, shadcn/ui, Framer Motion
- **Base de données**: PostgreSQL 16 + Prisma ORM
- **Authentification**: Better Auth / NextAuth.js
- **Paiements**: Stripe / Paddle
- **Recherche**: Elasticsearch
- **Cache**: Redis (Upstash)
- **Images**: Cloudinary
- **IA**: OpenAI (GPT-4)
- **Conteneurisation**: Docker

## Fonctionnalités

- 🌍 Multilingue (Français / Arabe RTL)
- 🏠 14 catégories principales, 150+ sous-catégories
- 📍 Toutes les villes du Maroc
- 🔍 Recherche instantanée avec filtres avancés
- 💬 Messagerie temps réel
- ⭐ Avis et évaluations
- 📊 Tableau de bord utilisateur et administrateur
- 🚀 Pages SEO automatiques (Ville + Catégorie)
- 🎨 Mode sombre / Mode clair
- 📱 100% responsive
- ⚡ Lighthouse 95+

## Démarrage rapide

### Prérequis

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker (optionnel)

### Installation

```bash
# Cloner le projet
git clone <url>
cd MARKETPLACE

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Générer le client Prisma
npx prisma generate --schema=prisma/schema.prisma

# Appliquer les migrations
npx prisma db push --schema=prisma/schema.prisma

# Seed la base de données
npx tsx prisma/seed.ts

# Lancer le serveur de développement
npm run dev
```

### Docker

```bash
docker-compose up -d
```

## Structure du projet

```
MARKETPLACE/
├── prisma/                     # Schéma et seed
│   ├── schema.prisma           # Modèles de données
│   └── seed.ts                 # Données d'exemple
├── src/
│   ├── app/
│   │   ├── [locale]/marketplace/  # Pages marketplace
│   │   └── api/marketplace/       # API REST
│   ├── components/
│   │   ├── layout/             # Header, Footer, Hero
│   │   ├── listings/           # Cartes, galeries, formulaires
│   │   ├── categories/         # Grille catégories
│   │   ├── search/             # Recherche et filtres
│   │   ├── dashboard/          # Sidebar, statistiques
│   │   └── messaging/          # Messagerie
│   ├── data/
│   │   ├── cities.ts           # Villes marocaines
│   │   └── categories.ts       # Catégories
│   ├── lib/
│   │   ├── prisma.ts           # Client Prisma
│   │   ├── utils.ts            # Fonctions utilitaires
│   │   ├── validations.ts      # Schémas Zod
│   │   └── seo.ts              # SEO metadata
│   └── types/                  # Types TypeScript
├── __tests__/                  # Tests unitaires
├── .github/workflows/          # CI/CD
└── docker-compose.yml          # Docker
```

## Licence

Propriétaire — Tous droits réservés.
