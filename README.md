# ExtraLife GYM

A custom marketing site built with Next.js App Router for a gym brand. It includes:

- Responsive landing page with hero section
- Mobile-friendly navigation menu
- Contact form with server-side API endpoint
- Member attendance check-in API route
- Page metadata for SEO and social sharing
- `robots.txt` and `sitemap.xml` for search engines

## Available Scripts

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run typecheck
```

## Local Development

Start the app locally and open it in your browser:

```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000).

## Notes

- `src/app/api/contact/route.ts` saves contact submissions to `contact-submissions.json`.
- `src/app/api/attendance/route.ts` saves attendance check-ins to `attendance-submissions.json`.
- Update the production URL in `src/app/layout.tsx` under `metadata.metadataBase`.

## Deployment

Deploy to Vercel, Netlify, or any platform that supports Next.js.

If deploying to Vercel, the default configuration should work out of the box.
