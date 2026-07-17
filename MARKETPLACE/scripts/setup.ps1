param(
  [string]$DbName = "marocmarket",
  [string]$DbUser = "postgres",
  [string]$DbPass = "postgres"
)

Write-Host "=== MarocMarket Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
  Write-Host "ERROR: Node.js is not installed. Please install Node.js 20+" -ForegroundColor Red
  exit 1
}
Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor Green

# Check npm
$npmVersion = npm --version 2>$null
Write-Host "✓ npm $npmVersion detected" -ForegroundColor Green

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install
if ($?) {
  Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
  Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
  exit 1
}

# Copy env file
if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
  Write-Host "✓ Created .env.local from .env.example" -ForegroundColor Green
  Write-Host "  Edit .env.local with your configuration" -ForegroundColor Yellow
} else {
  Write-Host "• .env.local already exists" -ForegroundColor Cyan
}

# Setup environment
$env:MARKETPLACE_DATABASE_URL = "postgresql://${DbUser}:${DbPass}@localhost:5432/${DbName}?schema=public"
$env:MARKETPLACE_DIRECT_URL = "postgresql://${DbUser}:${DbPass}@localhost:5432/${DbName}?schema=public"

# Generate Prisma client
Write-Host "`nGenerating Prisma client..." -ForegroundColor Yellow
npx prisma generate --schema=prisma/schema.prisma
if ($?) {
  Write-Host "✓ Prisma client generated" -ForegroundColor Green
}

# Push database
Write-Host "`nPushing database schema..." -ForegroundColor Yellow
npx prisma db push --schema=prisma/schema.prisma
if ($?) {
  Write-Host "✓ Database schema pushed" -ForegroundColor Green
} else {
  Write-Host "WARNING: Could not push schema. Make sure PostgreSQL is running." -ForegroundColor Yellow
}

# Seed database
Write-Host "`nSeeding database..." -ForegroundColor Yellow
npx tsx prisma/seed.ts
if ($?) {
  Write-Host "✓ Database seeded" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run 'npm run dev' to start the development server" -ForegroundColor Green
Write-Host "Open http://localhost:3000/fr/marketplace" -ForegroundColor Green
