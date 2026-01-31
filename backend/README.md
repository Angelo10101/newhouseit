# NewHouseIt Backend API

This is the backend server for the NewHouseIt app, providing AI-powered business recommendations using Google Gemini API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

## Running the Server

Start the development server:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Recommend Business
```
POST /api/recommend-business
```

Request body:
```json
{
  "userProblem": "My lights keep flickering and I need help",
  "businesses": [
    {
      "id": "electrician-1",
      "name": "Lightning Electric Co.",
      "category": "Electrician",
      "description": "Professional electrical services"
    },
    {
      "id": "plumber-1",
      "name": "AquaFix Pro",
      "category": "Plumber",
      "description": "Expert plumbing services"
    }
  ]
}
```

Response:
```json
{
  "recommendedBusinessId": "electrician-1",
  "confidence": 0.95,
  "reason": "Flickering lights indicate an electrical issue that requires a licensed electrician"
}
```

If no business matches:
```json
{
  "recommendedBusinessId": "NO_MATCH",
  "confidence": 0.0,
  "reason": "No suitable business found for this problem"
}
```

## Security

- The Gemini API key is stored in `.env` file (server-side only)
- The API key is NEVER exposed to the frontend
- CORS is enabled for local development
- All sensitive data stays on the backend

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `PORT` - Server port (default: 3001)
