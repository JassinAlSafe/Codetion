# Deployment Guide 🚀

This guide covers various deployment options for CodeNotion, from one-click deployments to self-hosting.

## 🌐 Platform Deployments

### Vercel (Recommended)

Vercel is the easiest way to deploy CodeNotion, created by the makers of Next.js.

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/code-notion)

#### Manual Deploy

1. **Fork and clone** the repository
2. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```
3. **Deploy**:
   ```bash
   cd code-notion
   vercel
   ```
4. Follow the prompts to configure your deployment

#### Custom Domain

1. In your Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update your DNS records as instructed

### Netlify

Netlify offers another excellent deployment option with great performance.

#### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/code-notion)

#### Manual Deploy

1. **Build the project**:
   ```bash
   npm run build
   npm run export  # If using static export
   ```
2. **Deploy to Netlify**:
   - Drag and drop the `out` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository in Netlify dashboard

#### Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next` (or `out` for static export)
- **Node version**: `18.x` or later

### Railway

Railway provides a simple deployment experience with automatic HTTPS.

1. **Connect your repository** at [railway.app](https://railway.app)
2. **Configure build**:
   - Build command: `npm run build`
   - Start command: `npm start`
3. **Deploy** automatically on every push

### Render

Render offers free tier deployment with automatic SSL.

1. **Create a new Web Service** at [render.com](https://render.com)
2. **Connect your repository**
3. **Configure**:
   - Build command: `npm run build`
   - Start command: `npm start`
   - Environment: `Node`

## 🏠 Self-Hosting

### Docker Deployment

#### Using Docker Compose

1. **Create `docker-compose.yml`**:
   ```yaml
   version: '3.8'
   services:
     code-notion:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       restart: unless-stopped
   ```

2. **Create `Dockerfile`**:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Build the application
   RUN npm run build
   
   # Expose port
   EXPOSE 3000
   
   # Start the application
   CMD ["npm", "start"]
   ```

3. **Deploy**:
   ```bash
   docker-compose up -d
   ```

#### Using Docker Run

```bash
# Build the image
docker build -t code-notion .

# Run the container
docker run -d \
  --name code-notion \
  -p 3000:3000 \
  --restart unless-stopped \
  code-notion
```

### VPS/Server Deployment

#### Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18.17+
- PM2 process manager
- Nginx (for reverse proxy)

#### Setup Steps

1. **Install dependencies**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx
   ```

2. **Clone and build**:
   ```bash
   git clone https://github.com/yourusername/code-notion.git
   cd code-notion
   npm install
   npm run build
   ```

3. **Configure PM2**:
   ```bash
   # Create ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [
       {
         name: 'code-notion',
         script: 'npm',
         args: 'start',
         cwd: '/path/to/code-notion',
         env: {
           NODE_ENV: 'production',
           PORT: 3000
         }
       }
     ]
   }
   EOF
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**:
   ```nginx
   # /etc/nginx/sites-available/code-notion
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable site and SSL**:
   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/code-notion /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   
   # Install SSL with Let's Encrypt
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## ⚙️ Environment Configuration

### Environment Variables

Create a `.env.local` file for configuration:

```bash
# Application
NODE_ENV=production
PORT=3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Optional: Error Tracking
SENTRY_DSN=your-sentry-dsn

# Optional: Database (for future features)
DATABASE_URL=your-database-url
```

### Build Optimization

For production builds, consider these optimizations:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
  
  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 📊 Monitoring

### Performance Monitoring

1. **Vercel Analytics** (if using Vercel):
   ```bash
   npm install @vercel/analytics
   ```

2. **Google Analytics**:
   ```javascript
   // Add to layout.tsx
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>{children}</body>
         <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
       </html>
     )
   }
   ```

### Error Tracking

1. **Sentry Integration**:
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**:
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 0.1,
   })
   ```

## 🔧 Troubleshooting

### Common Issues

1. **Monaco Editor not loading**:
   - Ensure dynamic imports are working
   - Check if CSP headers allow loading

2. **Build failures**:
   - Verify Node.js version (18.17+)
   - Clear `.next` folder and rebuild

3. **Performance issues**:
   - Enable compression in production
   - Optimize images and assets
   - Use CDN for static files

### Health Checks

Create a health check endpoint:

```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  })
}
```

## 🔒 Security

### Security Headers

Configure security headers in your deployment:

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
]
```

### HTTPS Configuration

Always use HTTPS in production:
- Use platform SSL (Vercel, Netlify)
- Configure Let's Encrypt for self-hosting
- Update all API calls to use HTTPS

---

Need help with deployment? [Create an issue](https://github.com/yourusername/code-notion/issues) or join our [community discussions](https://github.com/yourusername/code-notion/discussions)!