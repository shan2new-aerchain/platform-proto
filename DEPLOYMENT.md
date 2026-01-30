# Vercel Deployment Guide

This app is ready for deployment to Vercel with client-side authentication.

## Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add login authentication"
   git push
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and use the correct settings
   - Click "Deploy"

## Environment Setup

No environment variables are required. Authentication uses a hardcoded password (`aerchain0126`) stored client-side.

## Routes

All routes are protected and will redirect to `/login` if not authenticated:

- `/` - Home (Apps listing)
- `/login` - Login page (public)
- `/apps/[appId]` - App details
- `/apps/[appId]/workflows/[workflowId]` - Workflow builder
- `/step-definitions` - Step definitions
- `/settings` - Settings
- `/help` - Help

## Authentication

- **Type**: Client-side session-based
- **Storage**: Browser sessionStorage (clears on browser close)
- **Password**: `aerchain0126`
- **Logout**: Available in sidebar footer

## Node Version

The app requires Node.js 20+. Vercel will automatically use the version specified in `.nvmrc`.

## Build Configuration

The `vercel.json` and `next.config.ts` are pre-configured for optimal deployment.

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run start
```

## Testing Locally

Before deploying, test the production build:

```bash
npm run build
npm run start
```

Visit `http://localhost:3000` and verify:
- Login page loads with logo and matrix background
- Authentication works with password
- All dynamic routes are accessible
- Logout redirects to login

## Troubleshooting

**Issue**: Routes return 404
- **Solution**: Ensure `next.config.ts` has proper configuration (already done)

**Issue**: Authentication doesn't persist
- **Solution**: This is expected - sessionStorage clears on browser close

**Issue**: Build fails
- **Solution**: Check Node version is 20+ (specified in `.nvmrc`)
