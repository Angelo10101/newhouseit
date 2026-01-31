#!/bin/bash

# Chatbot Configuration Verification Script
# Run this to check if your backend is properly set up

echo "🔍 Checking Chatbot Configuration..."
echo "=================================="
echo ""

BACKEND_DIR="backend"
ERRORS=0
WARNINGS=0

# Check 1: Backend folder exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ ERROR: backend/ folder not found"
    echo "   Make sure you're running this from the project root"
    exit 1
fi

echo "✅ Backend folder found"

# Check 2: node_modules exists
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "❌ ERROR: Backend dependencies not installed"
    echo "   Run: cd backend && npm install"
    ((ERRORS++))
else
    echo "✅ Backend dependencies installed"
fi

# Check 3: .env file exists
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "❌ ERROR: .env file not found"
    echo "   Run: cd backend && cp .env.example .env"
    echo "   Then edit .env and add your Gemini API key"
    ((ERRORS++))
else
    echo "✅ .env file exists"
    
    # Check 4: API key is configured
    if grep -q "your_api_key_here" "$BACKEND_DIR/.env"; then
        echo "⚠️  WARNING: .env file still contains placeholder"
        echo "   Edit backend/.env and replace 'your_api_key_here' with your actual Gemini API key"
        echo "   Get one at: https://makersuite.google.com/app/apikey"
        ((WARNINGS++))
    else
        if grep -q "GEMINI_API_KEY=" "$BACKEND_DIR/.env"; then
            API_KEY=$(grep "GEMINI_API_KEY=" "$BACKEND_DIR/.env" | cut -d '=' -f 2 | tr -d ' ')
            if [ ! -z "$API_KEY" ]; then
                echo "✅ Gemini API key is configured"
            else
                echo "❌ ERROR: GEMINI_API_KEY is empty in .env file"
                ((ERRORS++))
            fi
        else
            echo "❌ ERROR: GEMINI_API_KEY not found in .env file"
            ((ERRORS++))
        fi
    fi
fi

# Check 5: Test if backend is running
echo ""
echo "🔌 Testing backend connection..."
if curl -s -f -m 5 http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:3001"
    
    # Get the health check response
    HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "⚠️  WARNING: Backend is not running"
    echo "   Start it with: cd backend && npm start"
    ((WARNINGS++))
fi

# Summary
echo ""
echo "=================================="
echo "Summary:"
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 SUCCESS! Everything is configured correctly!"
    echo ""
    echo "You can now:"
    echo "1. Make sure backend is running: cd backend && npm start"
    echo "2. Start your app: cd my-app && npx expo start"
    echo "3. Test the chatbot by tapping the brain icon"
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  Configuration is mostly correct but has warnings."
    echo "   Review the warnings above."
elif [ $ERRORS -eq 1 ]; then
    echo "❌ Found $ERRORS critical error. Please fix it to use the chatbot."
else
    echo "❌ Found $ERRORS critical errors. Please fix them to use the chatbot."
fi

echo ""
echo "For detailed setup instructions, see:"
echo "  - QUICK_START.md"
echo "  - CHATBOT_TROUBLESHOOTING.md"
echo ""

exit $ERRORS
