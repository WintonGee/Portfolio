#!/usr/bin/env node

/**
 * Chatbot Testing Script
 * Tests the chatbot API endpoint to ensure it's working properly
 */

const fetch = require("node-fetch").default || require("node-fetch");

const API_URL = process.env.API_URL || "http://localhost:3000/api/chat";
const TEST_MESSAGES = [
  "Tell me about your experience",
  "What projects have you worked on?",
  "What technologies do you use?",
  "Tell me about your education",
  "What's your current role?",
];

async function testChatbot() {
  console.log("🤖 Testing Chatbot API...\n");

  for (let i = 0; i < TEST_MESSAGES.length; i++) {
    const message = TEST_MESSAGES[i];
    console.log(`Test ${i + 1}/${TEST_MESSAGES.length}: "${message}"`);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Read the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let sources = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
              }
              if (parsed.sources) {
                sources = parsed.sources;
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      console.log(`✅ Response received (${fullResponse.length} chars)`);
      if (sources && sources.length > 0) {
        console.log(`📚 Sources found: ${sources.length}`);
        sources.forEach((source, idx) => {
          console.log(
            `   ${idx + 1}. ${source.title} (${Math.round(
              source.similarity * 100
            )}% match)`
          );
        });
      } else {
        console.log(
          "⚠️  No sources found (this might indicate embeddings issue)"
        );
      }
      console.log("");
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log("");
    }
  }

  console.log("🏁 Testing complete!");
}

// Run the test
testChatbot().catch(console.error);
