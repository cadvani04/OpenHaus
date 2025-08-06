# Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Make sure you have a Railway account
2. **PostgreSQL Database**: You'll need a PostgreSQL database (Railway provides this)
3. **Environment Variables**: Set up the required environment variables

## Step 1: Deploy to Railway

1. Connect your GitHub repository to Railway
2. Select the `backend` folder as your deployment source
3. Railway will automatically detect it's a Node.js project

## Step 2: Set Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add these environment variables:

### Required Variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### How to get DATABASE_URL:
1. In Railway, go to your project
2. Click "New Service" → "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Go to the database service → "Connect" → "Postgres Connection URL"
5. Copy the connection URL and set it as `DATABASE_URL`

### JWT_SECRET:
Generate a secure random string (at least 32 characters):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Deploy and Setup Database

1. **Deploy your code**: Railway will automatically build and deploy your app
2. **Setup database**: After deployment, run the database setup:
   ```bash
   # In Railway terminal or via Railway CLI
   npm run deploy-setup
   ```

## Step 4: Verify Deployment

1. **Health Check**: Visit `https://your-app-name.railway.app/health`
2. **Test Endpoint**: Visit `https://your-app-name.railway.app/api/test`

## Troubleshooting

### Common Issues:

1. **"Missing required environment variables"**
   - Make sure all required variables are set in Railway
   - Check that variable names match exactly (case-sensitive)

2. **"Database connection failed"**
   - Verify `DATABASE_URL` is correct
   - Make sure the PostgreSQL service is running
   - Check that the database exists

3. **"Schema already exists"**
   - This is normal if you've run the setup before
   - The app will continue to work

4. **"Invalid credentials" on login/register**
   - Make sure `JWT_SECRET` is set
   - Check that the database schema was applied correctly

### Debugging:

1. **Check Railway logs**: Go to your app service → "Deployments" → "View Logs"
2. **Test database connection**: Use the `/health` endpoint
3. **Check environment variables**: Look for missing variable errors in logs

## API Endpoints

After successful deployment, your API will be available at:
- **Health Check**: `GET /health`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Agreements**: `GET /api/agreements`, `POST /api/agreements`

## Security Notes

1. **JWT_SECRET**: Use a strong, random secret
2. **DATABASE_URL**: Keep this secure and don't commit it to version control
3. **CORS**: Currently set to allow all origins for debugging - consider restricting this in production
4. **SSL**: Railway automatically provides SSL certificates

## Monitoring

- **Railway Dashboard**: Monitor your app's performance and logs
- **Health Endpoint**: Use `/health` to check if your app and database are working
- **Logs**: Check Railway logs for any errors or issues 