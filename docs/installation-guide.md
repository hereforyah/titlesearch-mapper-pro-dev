# Titlesearch Pro Mapper - Installation Guide

## System Requirements

Titlesearch Pro Mapper is a web application that can be run in modern web browsers. To install and run the application, you'll need:

### Development Environment
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher) or yarn (v1.22.0 or higher)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Production Environment
- Web server capable of serving static files
- HTTPS support recommended for production deployments

## Installation Options

There are several ways to install and run Titlesearch Pro Mapper:

1. **Local Development Setup**
2. **Production Deployment**
3. **Docker Deployment** (optional)

## Local Development Setup

Follow these steps to set up the application for local development:

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/titlesearch-pro-mapper.git
cd titlesearch-pro-mapper
```

### 2. Install Dependencies

Navigate to the mapper directory and install the required dependencies:

```bash
cd mapper
npm install
```

### 3. Configure Environment

Create a `.env` file in the mapper directory with the following content:

```
VITE_APP_TITLE=Titlesearch Pro Mapper
VITE_DEFAULT_MAP_CENTER=40.7128,-74.0060
VITE_DEFAULT_ZOOM=13
```

Adjust the default map center coordinates and zoom level as needed for your specific use case.

### 4. Start Development Server

Run the development server:

```bash
npm run dev
```

This will start the application in development mode with hot-reloading enabled. The application will be available at `http://localhost:5173`.

## Production Deployment

To deploy the application to a production environment, follow these steps:

### 1. Build the Application

```bash
cd mapper
npm run build
```

This will create a production-ready build in the `dist` directory.

### 2. Deploy to Web Server

Copy the contents of the `dist` directory to your web server's document root or appropriate subdirectory.

Example using rsync:

```bash
rsync -avz dist/ user@your-server:/path/to/document-root/
```

### 3. Server Configuration

Ensure your web server is configured to:

- Serve static files correctly
- Redirect all requests to `index.html` for client-side routing
- Set appropriate cache headers for static assets

#### Apache Configuration Example

Create or modify `.htaccess` file in your document root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

#### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/document-root;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

## Docker Deployment (Optional)

For containerized deployment, you can use Docker:

### 1. Create a Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY mapper/package*.json ./
RUN npm install
COPY mapper/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create Nginx Configuration

Create a `docker/nginx.conf` file:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

### 3. Build and Run Docker Container

```bash
docker build -t titlesearch-pro-mapper .
docker run -p 8080:80 titlesearch-pro-mapper
```

The application will be available at `http://localhost:8080`.

## Updating the Application

To update the application to a newer version:

### Development Environment

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Install any new dependencies:
   ```bash
   cd mapper
   npm install
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

### Production Environment

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild the application:
   ```bash
   cd mapper
   npm install
   npm run build
   ```

3. Deploy the updated build to your web server.

## Troubleshooting

### Common Installation Issues

#### Node.js Version Compatibility

If you encounter errors during installation or build, ensure you're using a compatible Node.js version:

```bash
node -v  # Should be v16.0.0 or higher
```

If needed, use a tool like nvm to install and use the correct Node.js version:

```bash
nvm install 16
nvm use 16
```

#### Build Errors

If you encounter build errors related to PostCSS or Tailwind:

1. Delete the `node_modules` directory and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

3. Ensure postcss.config.cjs has the correct format:
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     }
   }
   ```

#### CORS Issues with Map Tiles

If map tiles fail to load due to CORS issues, you may need to configure your server to allow cross-origin requests or use a CORS proxy.

## Support and Resources

For additional support:

- Check the [User Guide](./user-guide.md) for usage instructions
- Refer to the [Technical Documentation](./technical-documentation.md) for code details
- Contact your system administrator or development team for specific issues

## License and Legal Information

Titlesearch Pro Mapper is proprietary software. All rights reserved.

This software is provided for use by authorized users only. Unauthorized copying, distribution, or modification is strictly prohibited.
