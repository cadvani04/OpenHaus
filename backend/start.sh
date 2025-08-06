#!/bin/bash

echo "🚀 Starting HomeShow Backend..."
echo "📊 Environment check:"
echo "   PORT: ${PORT:-'not set (will use 3001)'}"
echo "   NODE_ENV: ${NODE_ENV:-'development'}"
echo "   DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "   JWT_SECRET: ${JWT_SECRET:+'set'}"

# Wait a moment for Railway to fully initialize
sleep 2

# Start the application
exec node src/app.js 