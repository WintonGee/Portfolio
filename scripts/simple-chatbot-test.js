#!/usr/bin/env node

/**
 * Simple Chatbot Test
 * Uses built-in Node.js modules to test the chatbot
 */

const http = require("http");
const https = require("https");

const API_URL = process.env.API_URL || "http://localhost:3000/api/chat";

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const postData = JSON.stringify(data);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = client.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testChatbot() {
  console.log("🤖 Testing Chatbot API...\n");

  const testMessage = "Tell me about your experience";
  console.log(`Testing: "${testMessage}"`);

  try {
    const response = await makeRequest(API_URL, { message: testMessage });

    if (response.statusCode === 200) {
      console.log("✅ API responded successfully");
      console.log("📊 Response length:", response.data.length, "characters");

      // Check for streaming data
      const lines = response.data.split("\n");
      let hasContent = false;
      let hasSources = false;

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) hasContent = true;
            if (parsed.sources) hasSources = true;
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }

      if (hasContent) {
        console.log("✅ Content streaming works");
      } else {
        console.log("⚠️  No content found in response");
      }

      if (hasSources) {
        console.log("✅ Sources found - embeddings working");
      } else {
        console.log("⚠️  No sources found - embeddings might not be working");
      }
    } else {
      console.log(`❌ API returned status ${response.statusCode}`);
      console.log("Response:", response.data);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log("\n💡 Make sure your development server is running:");
    console.log("   npm run dev");
  }

  console.log("\n🏁 Test complete!");
}

// Run the test
testChatbot().catch(console.error);
