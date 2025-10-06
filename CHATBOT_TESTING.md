# Chatbot Testing Guide

## 🧪 How to Test Your Chatbot

### 1. **Local Testing**

#### Start the development server:

```bash
npm run dev
```

#### Test the chatbot manually:

1. Open `http://localhost:3000` in your browser
2. Scroll down to find the chatbot component
3. Try asking questions like:
   - "Tell me about your experience"
   - "What projects have you worked on?"
   - "What technologies do you use?"

#### Run automated tests:

```bash
# Test the API endpoint directly
node scripts/test-chatbot.js

# Or test with a specific URL
API_URL=https://your-production-url.com/api/chat node scripts/test-chatbot.js
```

### 2. **Check Embeddings Files**

#### Verify files exist:

```bash
# Check if embeddings files are present
ls -la data/chatbot-embeddings.json
ls -la data/embeddings.json

# Check file sizes (should be > 0)
wc -c data/chatbot-embeddings.json
```

#### Test embeddings loading:

```bash
# Quick test to see if embeddings load
node -e "
const fs = require('fs');
const path = require('path');

try {
  const data = JSON.parse(fs.readFileSync('data/chatbot-embeddings.json', 'utf8'));
  console.log('✅ Embeddings loaded successfully');
  console.log('📊 Total embeddings:', data.length);
  console.log('📝 Sample titles:', data.slice(0, 3).map(d => d.metadata.title));
} catch (error) {
  console.log('❌ Error loading embeddings:', error.message);
}
"
```

### 3. **Production Testing**

#### Check production logs:

```bash
# If using Vercel
vercel logs

# If using other platforms, check their logging systems
```

#### Test production API:

```bash
# Replace with your actual production URL
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about your experience"}' \
  --no-buffer
```

### 4. **What to Look For**

#### ✅ **Success Indicators:**

- Chatbot responds with relevant content
- Sources are displayed (if embeddings work)
- No console errors in browser
- API returns 200 status codes
- Streaming responses work properly

#### ❌ **Warning Signs:**

- "Portfolio information not available" messages
- No sources displayed
- API returns 500 errors
- Console shows embedding loading errors
- Empty or very short responses

### 5. **Troubleshooting**

#### If embeddings aren't working:

1. Check if `data/chatbot-embeddings.json` exists in production
2. Verify file permissions
3. Check if the file is included in your deployment
4. Look for "No embeddings files found" in logs

#### If API is failing:

1. Check environment variables (GEMINI_API_KEY)
2. Verify network connectivity
3. Check rate limits
4. Review error logs

### 6. **Environment Variables**

Make sure these are set in production:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 7. **Deployment Checklist**

- [ ] Embeddings files are included in deployment
- [ ] Environment variables are set
- [ ] API endpoint is accessible
- [ ] No build errors
- [ ] Chatbot component renders correctly

## 🚀 Quick Test Commands

```bash
# 1. Test locally
npm run dev
# Then visit http://localhost:3000 and test the chatbot

# 2. Test API directly
node scripts/test-chatbot.js

# 3. Check embeddings
ls -la data/chatbot-embeddings.json

# 4. Test production (replace URL)
API_URL=https://your-domain.com/api/chat node scripts/test-chatbot.js
```
