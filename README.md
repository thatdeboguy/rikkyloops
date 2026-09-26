# Rikkyloops storefront

Next.js App Router storefront with request-time server rendering for home, shop, and product pages. The separate Express API, MySQL database, R2 upload service, email delivery, and admin panel are future integrations; this repository does not implement or deploy them.

## Run locally

Use Node.js 20.9 or newer. Run `npm install`, then `npm run dev` and open http://localhost:3000. On PowerShell systems that block npm.ps1, use `npm.cmd` instead of `npm`.

Checks: `npm run lint` and `npm run build`. Run the production app with `npm start`.

## Included

- Home, shop, five categories, product details, contact/FAQs, returns, size guide, and shopping bag.
- Server-rendered search, category filtering, price sorting, and product metadata.
- Responsive navigation, size selection, and a persistent localStorage bag. This preview does not accept payment or place orders.
- Validated server-side contact proxy with unavailable/error feedback; no false success when unconfigured.
- Original AI-generated demonstration imagery optimized as local WebP assets. Replace with actual product photography before launch.
- Sample NGN prices, descriptions, and size chart. Return terms await business confirmation.

## Connect the separate API

Copy `.env.example` to `.env.local` and set `API_BASE_URL` to the Express API root. Leave unset for the five labelled sample products. A configured but unavailable API displays an error instead of silently substituting samples.

`GET /products` returns an array:

```json
[{"id":"solana-dress","name":"The Solana Dress","category":"Dresses","price":65000,"image":"https://images.rikkyloops.com/products/solana.webp","color":"Natural cream","sizes":["S","M","L"],"description":"Product description"}]
```

Prices are NGN major units. Categories: Dresses, Tops, Sweaters, Bags and accessories, Hats. IDs must be URL-safe slugs. Set `R2_PUBLIC_HOSTNAME` to the image hostname and rebuild to allow Next.js image optimization. R2 credentials and upload signing belong in the backend, never the browser.

`POST /contact` accepts `{ "name": "...", "email": "...", "message": "..." }`. Return success only after accepting the message for durable storage/delivery. Optional `API_SERVICE_TOKEN` supplies bearer authentication. The backend must enforce appropriate authentication, rate limits, spam protection, validation, and email delivery.

Set `CONTACT_EMAIL` to the confirmed public business email. Until then no invented contact address is shown.

## Architecture and remaining launch work

Frontend (this repository, Vercel) → HTTPS → separate Node/Express repository (Koyeb) → Aiven MySQL. The backend uses R2 for images and an email provider for order confirmations. Check hosting availability and pricing at deployment; no free-tier guarantees are made.

Build the backend and authenticated admin panel, establish real catalogue/content and return terms, integrate orders/payments with server-authoritative prices and verified payment events, configure email delivery, and replace preview labels before opening orders. The client-side bag is not an order record.

Design references: https://www.crochellaa.ng/, https://lazoet.com/, and https://crochetcraftvilla.com/. Their text and photography have not been reused. Reference contact, returns, and size-guide pages could not be retrieved, so these use original preview content.
