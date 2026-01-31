#!/bin/bash

# AI Recommendation Feature Setup Verification Script
# This script helps verify that everything is set up correctly

echo "=================================================="
echo "🔍 AI Recommendation Feature Setup Verification"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ERRORS=0
WARNINGS=0

echo "📂 Checking directory structure..."
echo ""

# Check backend directory
if [ -d "backend" ]; then
  echo -e "${GREEN}✓${NC} Backend directory exists"
else
  echo -e "${RED}✗${NC} Backend directory not found"
  ERRORS=$((ERRORS + 1))
fi

# Check backend files
if [ -f "backend/package.json" ]; then
  echo -e "${GREEN}✓${NC} Backend package.json exists"
else
  echo -e "${RED}✗${NC} Backend package.json not found"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "backend/src/index.js" ]; then
  echo -e "${GREEN}✓${NC} Backend server code exists"
else
  echo -e "${RED}✗${NC} Backend server code not found"
  ERRORS=$((ERRORS + 1))
fi

# Check .env file
if [ -f "backend/.env" ]; then
  echo -e "${GREEN}✓${NC} Backend .env file exists"
  
  # Check if API key is configured
  if grep -q "GEMINI_API_KEY=your_api_key_here" backend/.env; then
    echo -e "${YELLOW}⚠${NC}  API key is still set to placeholder"
    echo "   Update backend/.env with your actual Gemini API key"
    WARNINGS=$((WARNINGS + 1))
  elif grep -q "GEMINI_API_KEY=" backend/.env; then
    echo -e "${GREEN}✓${NC} API key appears to be configured"
  else
    echo -e "${RED}✗${NC} GEMINI_API_KEY not found in .env"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${YELLOW}⚠${NC}  Backend .env file not found"
  echo "   Copy backend/.env.example to backend/.env and add your API key"
  WARNINGS=$((WARNINGS + 1))
fi

# Check if .env is properly ignored
if git check-ignore backend/.env > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Backend .env is properly gitignored"
else
  echo -e "${YELLOW}⚠${NC}  Backend .env may not be gitignored"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📦 Checking backend dependencies..."
echo ""

# Check if node_modules exists
if [ -d "backend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
  echo -e "${YELLOW}⚠${NC}  Backend dependencies not installed"
  echo "   Run: cd backend && npm install"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📱 Checking frontend files..."
echo ""

# Check frontend files
if [ -f "my-app/hooks/useBusinessRecommendation.ts" ]; then
  echo -e "${GREEN}✓${NC} Business recommendation hook exists"
else
  echo -e "${RED}✗${NC} Business recommendation hook not found"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "my-app/components/AIRecommendationChat.tsx" ]; then
  echo -e "${GREEN}✓${NC} AI chat component exists"
else
  echo -e "${RED}✗${NC} AI chat component not found"
  ERRORS=$((ERRORS + 1))
fi

# Check if my-app dependencies are installed
if [ -d "my-app/node_modules" ]; then
  echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
  echo -e "${YELLOW}⚠${NC}  Frontend dependencies not installed"
  echo "   Run: cd my-app && npm install"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📚 Checking documentation..."
echo ""

if [ -f "AI_RECOMMENDATION_GUIDE.md" ]; then
  echo -e "${GREEN}✓${NC} AI Recommendation Guide exists"
else
  echo -e "${YELLOW}⚠${NC}  AI Recommendation Guide not found"
  WARNINGS=$((WARNINGS + 1))
fi

if [ -f "backend/README.md" ]; then
  echo -e "${GREEN}✓${NC} Backend README exists"
else
  echo -e "${YELLOW}⚠${NC}  Backend README not found"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=================================================="
echo "📊 Verification Summary"
echo "=================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 All checks passed!${NC}"
  echo ""
  echo "✅ You're ready to run the AI recommendation feature:"
  echo ""
  echo "1. Start the backend:"
  echo "   cd backend && npm start"
  echo ""
  echo "2. Start the Expo app:"
  echo "   cd my-app && npx expo start"
  echo ""
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ Setup is mostly complete with ${WARNINGS} warning(s)${NC}"
  echo ""
  echo "Review the warnings above and address them if needed."
else
  echo -e "${RED}❌ Setup verification failed with ${ERRORS} error(s) and ${WARNINGS} warning(s)${NC}"
  echo ""
  echo "Please address the errors above before proceeding."
fi

echo ""
echo "For detailed setup instructions, see: AI_RECOMMENDATION_GUIDE.md"
echo ""
