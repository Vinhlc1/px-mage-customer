# PixelMage — Customer Portal

Customer-facing storefront for the PixelMage NFC trading-card platform. Allows players to browse card templates, purchase physical NFC cards, manage their collection, track orders, and participate in auctions and community discussions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI Library | React 19.2.3 + TypeScript 5.9 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Forms | React Hook Form 7 + Zod 4 |
| Linter / formatter | Biome 2.2 |
| Package manager | pnpm / npm |

---

## Architecture

### Authentication

The customer portal uses a **dual-cookie** authentication pattern to allow both secure server-side enforcement and client-side API access:

| Cookie | Name | httpOnly | Purpose |
|---|---|---|---|
| Session token | `pm_token` | ✅ Yes | Used by Next.js to validate sessions (server-side only) |
| Access token | `pm_access` | ❌ No | Read by client JS to attach `Authorization: Bearer` header to direct BE calls |
| User info | `pm_user` | ❌ No | JSON blob with `customerId`, `email`, `name`, `phoneNumber` |

Login and logout are handled by Next.js API routes at `/api/auth/login` and `/api/auth/logout`, which proxy to the Spring Boot backend and manage both cookies.

### API Pattern — Direct BE Calls

Unlike the admin and staff portals (which route all requests through a server-side proxy), the customer portal calls the backend **directly from the browser**:

```
Browser  →  http://localhost:8386/api/...
             Authorization: Bearer <pm_access token>
```

All API functions live in `src/lib/api/`. They use `apiFetch` from `src/lib/api-client.ts`, which reads `pm_access` from the cookie and attaches the Bearer token automatically.

Auth routes are the only exception — they go through `/api/auth/*` to manage the httpOnly cookie server-side.

### State Management

State is managed via React Contexts:

| Context | File | Data Source |
|---|---|---|
| `AuthContext` | `contexts/AuthContext.tsx` | `pm_user` cookie + `/api/auth/me` |
| `CartContext` | `contexts/CartContext.tsx` | In-memory (no backend persistence) |
| `CollectionContext` | `contexts/CollectionContext.tsx` | `GET /api/owned-cards/customer/{id}` (live BE) |
| `PurchaseHistoryContext` | `contexts/PurchaseHistoryContext.tsx` | `GET /api/orders/customer/{id}` (live BE) |
| `CommunityContext` | `contexts/CommunityContext.tsx` | Hardcoded mock data |

---

## Pages & Features

### Home — `/`
- Hero banner with animated background.
- Card gallery using real card templates from `GET /api/card-templates`.
- Rarity filter (All, Common, Rare, Epic, Legendary).
- Animated 6-card **skeleton loading** grid while templates fetch.
- Each card opens a story modal (lore text) or NFC-scan modal.
- Authenticated users see their owned status via `CollectionContext`.

### Marketplace — `/marketplace`
- Same card grid as Home, independently fetched.
- Supports rarity filtering and search.
- Cards link to `/purchase/{cardProductId}` for buying.

### Purchase — `/purchase/[cardId]`
- Shows available price tiers for a given card product.
- Selecting a tier adds to the cart via `CartContext`.
- Redirects to `/checkout` after adding.

### Checkout — `/checkout`
- Displays cart items with subtotal.
- Collects shipping address, phone, and payment card details (placeholder UI — no real payment gateway).
- On confirm, calls `POST /api/orders` to create a real backend order with status `PENDING` and `paymentStatus: PENDING`.
- Redirects to `/orders` after successful order creation.
- Auth guard: redirects to `/login?redirect=/checkout` if not authenticated.

### Orders List — `/orders`
- Lists all customer orders fetched from `GET /api/orders/customer/{customerId}`.
- Shows order ID, creation date, status badge, payment status badge, item count, and total amount.
- Each row links to `/orders/{id}`.
- Animated skeleton cards (4 rows) while loading.
- Empty state with "Mua thẻ ngay" button linking to `/marketplace`.
- Auth guard with redirect to `/login?redirect=/orders`.

### Order Detail — `/orders/[id]`
- Fetches a single order from `GET /api/orders/{id}`.
- Displays order metadata: date, status, payment status, payment method, shipping address, notes.
- Line-items table: per-item quantity × unit price = subtotal, custom text if any.
- Grand total row.
- Back button to `/orders`, "Tiếp tục mua sắm" CTA to `/marketplace`.
- Skeleton loading and not-found state.
- Auth guard.

### My Cards — `/my-cards`
- Lists all physical NFC cards owned by the customer via `GET /api/owned-cards/customer/{id}`.
- Shows card name, framework, template, NFC UID, bind status.
- Auth guard.

### Collection — `/collection`
- Lists all card templates the customer has purchased at least once.
- Data comes from `CollectionContext` (real BE).
- Auth guard.

### Profile — `/profile`
- Tabbed layout: Account Info, Purchase History, Settings.
- Account tab: display name, email, phone (non-editable for now).
- Purchase History tab: shorthand order list from `PurchaseHistoryContext`.
  Links to `/orders` for the full list.
- Auth guard.

### Auctions — `/auctions`
- 🚧 **Development stub** — currently displays mock auction cards.
- `DevNotice` component displayed prominently at the top.

### Community — `/community`
- 🚧 **Development stub** — posts sourced from hardcoded mock data in `CommunityContext`.
- `DevNotice` component displayed at the top.
- Create Post modal UI is functional (adds to in-memory state only).
- Likes and comments update in-memory only.

### About — `/about`
Static page with platform lore and team info.

### Contact — `/contact`
Static contact form (no backend submission).

---

## Auth API Routes (Next.js Proxy)

These are the only routes that proxy to the backend server-side:

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Forward credentials, set `pm_token`, `pm_access`, `pm_user` cookies |
| POST | `/api/auth/logout` | Clear all auth cookies |
| GET | `/api/auth/me` | Return current user info from `pm_user` cookie |

---

## Direct BE API Functions (`src/lib/api/`)

| File | Functions |
|---|---|
| `orders.ts` | `createOrder`, `getOrdersByCustomer`, `getOrderById` |
| `collections.ts` | `getOwnedCards` |
| `cards.ts` | `getCardTemplates`, `getCardTemplateById`, `getCardProducts` |
| `payments.ts` | Payment-related stubs |
| `accounts.ts` | `getAccountById`, `updateAccount` |
| `auth.ts` | `login`, `logout`, `getCurrentUser` |

---

## Project Structure

```
src/
  app/
    page.tsx            # Home — card gallery + hero
    layout.tsx          # Root layout + Providers
    providers.tsx       # All context providers wrapped together
    marketplace/        # Marketplace grid page
    purchase/[cardId]/  # Card purchase / tier selection
    checkout/           # Cart review + order creation
    orders/
      page.tsx          # Orders list
      [id]/page.tsx     # Order detail
    my-cards/           # Owned physical cards
    collection/         # Owned card templates
    profile/            # User profile tabs
    auctions/           # Dev stub — mock auction cards
    community/          # Dev stub — mock community posts
    about/              # Static about page
    contact/            # Static contact page
    login/              # Login / register page
    api/auth/           # Auth proxy routes (login, logout, me)
    globals.css
  components/
    Navbar.tsx          # Top nav with auth-aware dropdown + mobile menu
    CardGrid.tsx        # Responsive card grid + skeleton loading
    CardItem.tsx        # Single card tile with hover effects
    CardModals.tsx      # Story modal + NFC scan modal
    DevNotice.tsx       # Development-notice banner (auctions, community)
    BidModal.tsx        # Bid submission modal (auctions — stub)
    AuthModal.tsx       # Login prompt modal
    EmptyState.tsx      # Reusable empty-state illustration
    RarityFilter.tsx    # Rarity pill filter buttons
    layout/             # PageLayout wrapper component
    ui/                 # shadcn/ui component library
  contexts/
    AuthContext.tsx          # User auth state + login/logout actions
    CartContext.tsx           # In-memory cart items + helpers
    CollectionContext.tsx     # Owned card templates (live BE)
    PurchaseHistoryContext.tsx# Customer orders (live BE)
    CommunityContext.tsx      # Community posts (mock)
  lib/
    api-client.ts       # apiFetch → BE with Bearer token; apiGet, apiPost, apiPut, apiDelete
    api/                # BE API function modules
      orders.ts
      collections.ts
      cards.ts
      payments.ts
      accounts.ts
      auth.ts
    auth-utils.ts       # Cookie name constants, JWT decode, AuthUser schema
    cookies.ts          # Browser cookie read/write
    utils.ts            # cn(), formatVND()
  hooks/
    use-card-templates.ts     # Fetches card templates with loading state
    use-card-interactions.ts  # Modal open/close event handlers
  types/
    card.ts             # CardTemplate, CardProduct, CartItem, Rarity
    order.ts            # BeOrder, BeOrderItem, legacy Order
    community.ts        # CommunityPost, Comment
  data/
    cards.ts            # Static card data used by dev-stub pages (auctions, community)
  assets/
    cards/              # Card artwork images
```

---

## Custom CSS Classes

Defined in `globals.css`:

| Class | Effect |
|---|---|
| `.card-glass` | Semi-transparent card background with border |
| `.card-glow` | Animated golden glow on hover |
| `.starfield` | Animated star particle background |
| `.text-gradient-gold` | Gold gradient text |
| `.btn-glow` | Pulsing glow on primary buttons |
| `.text-shadow-glow` | Glowing text shadow |

---

## Getting Started

```bash
pnpm install      # or: npm install
pnpm dev          # http://localhost:3001 (or 3000 if admin not running)
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8386   # Spring Boot backend
```

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run Biome linter |
| `pnpm type-check` | TypeScript type check only |

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
