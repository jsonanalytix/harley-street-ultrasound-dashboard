# Cloudflare Pages Environment Variables Setup

## Required Environment Variables

The following environment variables need to be set in your Cloudflare Pages deployment:

- `VITE_APP_USERNAME` - The username for authentication (e.g., `admin@harleystreetultrasound.com`)
- `VITE_APP_PASSWORD` - The password for authentication (e.g., `HSU2024!Portal`)

## How to Set Environment Variables in Cloudflare Pages

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to Pages

2. **Select Your Project**
   - Click on "harley-street-ultrasound-dashboard"

3. **Go to Settings**
   - Click on the "Settings" tab
   - Navigate to "Environment variables"

4. **Add Production Variables**
   - Click "Add variable" under the Production section
   - Add the following variables:
     ```
     Variable name: VITE_APP_USERNAME
     Value: admin@harleystreetultrasound.com
     
     Variable name: VITE_APP_PASSWORD
     Value: HSU2024!Portal
     ```

5. **Save and Redeploy**
   - Click "Save"
   - Go to the "Deployments" tab
   - Click on "Retry deployment" for the latest deployment

## Local Development

For local development, create a `.env` file in the root directory:

```env
VITE_APP_USERNAME=admin@harleystreetultrasound.com
VITE_APP_PASSWORD=HSU2024!Portal
```

**Note:** The `.env` file is already included in `.gitignore` to prevent accidentally committing credentials.

## Security Best Practices

- Never commit actual credentials to the repository
- Use strong, unique passwords for production
- Consider rotating credentials periodically
- Limit access to the Cloudflare dashboard to authorized personnel only 