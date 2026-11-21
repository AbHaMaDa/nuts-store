# Nuts Store

An e-commerce store built with [Evershop](https://github.com/evershopcommerce/evershop) v2.4.0, using the custom **Crispa** theme with Arabic translations.

## Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** database
- npm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AbHaMaDa/nuts-store.git
cd nuts-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (it is gitignored — never commit it):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nuts_store
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSLMODE=disable
```

Make sure the PostgreSQL database exists and is reachable.

### 4. Install Evershop

```bash
npm run setup
# equivalent to: evershop install
```

This creates the database schema and seeds the store.

### 5. Run the store

```bash
npm run dev     # development mode with hot reload
npm run start   # production mode
npm run build   # build assets for production
```

The storefront and admin panel will be available at `http://localhost:3000` (admin at `/admin`).

## Project Structure

```
├── config/default.json      # Store config (language, currency, theme, extensions)
├── extensions/sample/       # Sample extension (i18n, custom pages)
├── themes/
│   ├── crispa/              # Active custom theme (React/TSX + SCSS)
│   └── sample/              # Default sample theme
├── translations/ar/         # Arabic translation files
├── public/                  # Static files & sitemaps
└── media/                   # Uploaded media (gitignored)
```

## Learn More

- [Evershop Documentation](https://evershop.io/docs)
- [Evershop GitHub Repository](https://github.com/evershopcommerce/evershop)
