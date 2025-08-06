# Python FastAPI Backend Deployment Guide

## 🚀 Quick Start

### 1. Local Development
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2. Railway Deployment

#### Step 1: Set Environment Variables
In Railway dashboard, add these variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=8000
```

#### Step 2: Optional Variables (for SMS)
```
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
FRONTEND_URL=https://your-frontend-url.com
```

#### Step 3: Deploy
1. Push code to GitHub
2. Railway will auto-detect Python and deploy
3. Check logs for startup messages

### 3. Test Endpoints

#### Health Checks:
- `GET /` - Basic health check
- `GET /health` - Database health check
- `GET /api/test` - API test endpoint

#### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

#### Agreements:
- `POST /api/agreements/` - Create agreement (requires auth)
- `GET /api/agreements/user` - Get user agreements (requires auth)
- `GET /api/agreements/public/{token}` - Get agreement by token
- `POST /api/agreements/public/{token}/view` - Mark as viewed
- `POST /api/agreements/public/{token}/sign` - Sign agreement

## 🔧 Features

### ✅ What's Included:
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Database support
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation
- **Twilio SMS** - Optional SMS notifications
- **CORS** - Cross-origin support
- **Health Checks** - Railway-compatible health endpoints

### 🛠️ Architecture:
```
backend/
├── main.py              # FastAPI app entry point
├── requirements.txt     # Python dependencies
├── app/
│   ├── core/
│   │   └── config.py   # Settings management
│   ├── database.py      # Database models & connection
│   ├── routers/
│   │   ├── auth.py      # Authentication endpoints
│   │   └── agreements.py # Agreement endpoints
│   ├── schemas/
│   │   ├── auth.py      # Auth request/response models
│   │   └── agreements.py # Agreement models
│   └── services/
│       └── sms.py       # Twilio SMS service
```

## 📊 Expected Logs

### Successful Startup:
```
🚀 Starting HomeShow Backend...
📊 Environment: production
🔗 Database URL: set
🔐 JWT Secret: set
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Health Check Response:
```json
{
  "status": "OK",
  "message": "HomeShow Backend is running",
  "timestamp": "2025-08-06T20:00:00.000Z",
  "environment": "production"
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Module not found" errors**
   - Make sure all dependencies are in `requirements.txt`
   - Check that `PYTHONPATH=/app` is set

2. **Database connection errors**
   - Verify `DATABASE_URL` is correct
   - Check that PostgreSQL service is running

3. **JWT errors**
   - Ensure `JWT_SECRET` is set
   - Check token format in requests

4. **Port issues**
   - Railway sets `PORT=8000` automatically
   - App listens on `0.0.0.0:8000`

### Debug Commands:
```bash
# Test locally
python main.py

# Check dependencies
pip list

# Test database connection
python -c "from app.database import engine; print(engine.execute('SELECT 1').fetchone())"
```

## 🚀 Advantages of Python FastAPI

- **Faster development** - Less boilerplate than Node.js
- **Automatic API docs** - Visit `/docs` for interactive docs
- **Type safety** - Pydantic validation
- **Better error handling** - Clear error messages
- **Railway friendly** - Python is well-supported
- **Easy debugging** - Clear stack traces

Your Python backend is ready to deploy! 🎉 