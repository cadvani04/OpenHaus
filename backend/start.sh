#!/bin/bash

echo "🚀 Starting HomeShow Backend..."

# Log environment variables
echo "📊 Environment check:"
echo "   PORT: ${PORT:-'not set (will use 3001)'}"
echo "   NODE_ENV: ${NODE_ENV:-'development'}"
echo "   DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "   JWT_SECRET: ${JWT_SECRET:+'set'}"

# Log Railway-specific variables
echo "🔍 Railway environment variables:"
env | grep -E "(PORT|RAILWAY|NODE_ENV)" || echo "No Railway-specific variables found"

# Start the application directly (no sleep, no exec)
node src/app.js 