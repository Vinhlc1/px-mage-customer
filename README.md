# PixelMage — Customer Portal

Customer-facing storefront for purchasing and managing Magic: The Gathering card templates and physical cards.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: React Context (Auth, Cart, Collection, PurchaseHistory, Community)
- **API**: Direct calls to BE at `http://localhost:8386` via Bearer token (non-httpOnly cookie)

## Features

| Feature | Status | Notes |
|---|---|---|
| Home / Card Catalog | ✅ Live | Real card templates from BE |
| Marketplace | ✅ Live | Real card templates from BE |
| Authentication | ✅ Live | Login / Register via Next.js proxy |
| My Cards | ✅ Live | Real owned physical cards from BE |
| Collection | ✅ Live | Real owned card templates from BE |
| Purchase (Card Tiers) | ✅ Live | Real price tiers → creates BE order |
| Checkout | ✅ Live | Creates real BE order (payment UI is placeholder) |
| Orders List (`/orders`) | ✅ Live | Lists all customer orders from BE |
| Order Detail (`/orders/[id]`) | ✅ Live | Full order detail with items from BE |
| Profile | ✅ Live | Account info and tabs |
| Auctions | 🚧 Dev | Mock data — DevNotice displayed |
| Community | 🚧 Dev | Mock data — DevNotice displayed |
| About / Contact | ✅ Static | Static content pages |

## API Pattern

The customer portal calls the backend **directly** from the browser:

```
Browser → http://localhost:8386/api/...
           (Bearer token from ACCESS_TOKEN_COOKIE)
```

Auth routes use a Next.js proxy at `/api/auth/*` to set httpOnly session cookies.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8386
```

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # Shared UI components
  contexts/      # React contexts (Auth, Cart, Collection, etc.)
  lib/api/       # BE API functions (direct fetch)
  types/         # TypeScript interfaces
  hooks/         # Custom React hooks
```

# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
