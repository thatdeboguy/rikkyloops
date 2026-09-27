# Rikkyloops storefront and admin

Next.js App Router storefront with request-time catalogue/content rendering and a protected admin panel at `/admin`. The separate Express API in `../Backend` connects to Aiven PostgreSQL and Cloudflare R2.

## Run

Use Node.js 22+. Run `npm ci`, set `.env.local` from `.env.example`, then `npm run dev` (default http://localhost:3000). Use `npm.cmd` in PowerShell if script execution blocks npm.ps1. Start the backend separately with its own environment configuration.

Set `API_BASE_URL=http://localhost:4000` for local development. Set `R2_PUBLIC_HOSTNAME` to the hostname from the backend's public R2 URL; restart/rebuild after changing it. Never copy R2 secrets, database passwords, JWT_SECRET, or admin credentials into public frontend environment variables.

Without API_BASE_URL the public store uses sample products/content; admin login requires the API. With the API configured, the catalogue is read from PostgreSQL. An empty database displays an empty shop. There is a placeholder for products without images. The catalogue fetches all API pages; admin lists are paginated in groups of 20.

## Admin

Visit `/admin` and sign in with an account provisioned using the backend's `admin:create` script. The login page is `/admin/login`. Public sign-up is not provided.

- Create, edit, and delete products; set name, sizes, price, category, description, colour, and image.
- Upload JPG/PNG/WebP images up to 3 MB to R2.
- Edit the announcement, footer description, homepage copy/images, category images, contact details, FAQs, return policy, size-guide text, and measurement chart.
- Change the account password or sign out.

JWTs are stored in HttpOnly, SameSite=Strict cookies, Secure in production. All admin browser requests pass through a same-origin Next.js route that checks the Origin on mutations and forwards the cookie token to Express. The backend authorizes every write; hiding the page alone is not the security boundary. Sessions expire after two hours. Logout and password changes revoke sessions in the database. The static ADMIN_API_KEY is no longer used.

Website edits are fetched without caching and appear on new page loads after saving. Content uses plain text; line breaks are supported, HTML is not. Uploading an image stores it immediately; press Save product/Save website changes to attach its URL to the content. Deleting a product leaves its media in R2 to avoid breaking shared references.

For manual image URLs, use the configured R2 public hostname (or extend `next.config.ts` to trust another image host). The bucket's public URL must be enabled and point to the same bucket used for uploads.

## Checks

Run `npm run lint` and `npm run build`. Production uses `npm start`.

`npm run test:admin` uses Playwright with installed Chrome. Start both services first, and supply `E2E_BASE_URL`, `E2E_USERNAME`, and `E2E_PASSWORD` in your shell. The test creates/edits/deletes a temporary product, checks the content editor and mobile width, and verifies logout. It skips without credentials. Tracing is disabled to avoid recording login secrets.

The public store still has a preview bag and does not collect payments or place orders. Contact form delivery is pending the backend messaging/email implementation. Review the size chart, returns text, and illustrative imagery before opening orders.

Design references: https://www.crochellaa.ng/, https://lazoet.com/, and https://crochetcraftvilla.com/. Their text and photos are not reused; the supplied sample imagery is AI generated.

## Display currencies

Enter independent NGN, USD and TRY prices in the admin product editor. NGN is required; blank USD or TRY prices are shown as unavailable in that currency. No conversion or exchange-rate environment variables are needed. The header selection persists in a cookie and applies to cards, details, bag totals and shop price sorting. Existing products keep their NGN prices; edit each to add other currencies. Deploy the backend migration 003-product-currencies.sql before the updated backend and frontend.
