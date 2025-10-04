const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

// Test cases for the chatbot
const testCases = [
  {
    id: "basic_info",
    question: "What is your name?",
    expectedKeywords: ["Winton", "Gee"],
    category: "personal",
  },
  {
    id: "contact_info",
    question: "How can I contact you?",
    expectedKeywords: ["email", "wintongee@gmail.com", "phone", "415"],
    category: "contact",
  },
  {
    id: "current_role",
    question: "What do you do for work?",
    expectedKeywords: ["AI/ML Engineer", "Mercor", "San Francisco"],
    category: "professional",
  },
  {
    id: "location",
    question: "Where are you located?",
    expectedKeywords: ["San Francisco", "CA"],
    category: "personal",
  },
  {
    id: "unknown_info",
    question: "What programming languages do you know?",
    expectedKeywords: ["don't have", "information", "available"],
    category: "skills",
  },
];

async function testChatbot() {
  console.log("🧪 Starting Simple Chatbot Testing...\n");

  const results = [];

  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.id}`);
    console.log(`❓ Question: ${testCase.question}`);

    try {
      // Use curl to test the API
      const curlCommand = `curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"message": "${testCase.question}"}' --no-buffer`;

      const { stdout, stderr } = await execAsync(curlCommand);

      if (stderr) {
        console.log(`⚠️  Warning: ${stderr}`);
      }

      // Parse the streaming response
      let fullResponse = "";
      const lines = stdout.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullResponse += parsed.content;
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }

      console.log(
        `🤖 Response: ${fullResponse.substring(0, 200)}${
          fullResponse.length > 200 ? "..." : ""
        }`
      );

      // Analyze response quality
      const analysis = analyzeResponse(fullResponse, testCase);
      results.push({
        ...testCase,
        response: fullResponse,
        analysis,
      });

      console.log(`📊 Analysis: ${analysis.score}/10 - ${analysis.notes}\n`);

      // Wait between requests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
      results.push({
        ...testCase,
        response: null,
        analysis: { score: 0, notes: `Error: ${error.message}` },
      });
    }
  }

  // Generate test report
  generateTestReport(results);
}

function analyzeResponse(response, testCase) {
  if (!response || response.trim() === "") {
    return { score: 0, notes: "No response received" };
  }

  let score = 0;
  const notes = [];

  // Check for expected keywords
  const foundKeywords = testCase.expectedKeywords.filter((keyword) =>
    response.toLowerCase().includes(keyword.toLowerCase())
  );

  if (foundKeywords.length === testCase.expectedKeywords.length) {
    score += 5;
    notes.push("All expected keywords found");
  } else if (foundKeywords.length > 0) {
    score += 3;
    notes.push(
      `Found ${foundKeywords.length}/${testCase.expectedKeywords.length} keywords`
    );
  } else {
    score += 0;
    notes.push("No expected keywords found");
  }

  // Check for hallucination indicators
  const hallucinationIndicators = [
    "i don't know",
    "i don't have",
    "not available",
    "need to check",
    "don't have that information",
  ];

  const hasHallucinationPrevention = hallucinationIndicators.some((indicator) =>
    response.toLowerCase().includes(indicator)
  );

  if (hasHallucinationPrevention && testCase.category === "skills") {
    score += 3;
    notes.push("Good hallucination prevention");
  } else if (!hasHallucinationPrevention && testCase.category !== "skills") {
    score += 2;
    notes.push("No hallucination prevention needed");
  }

  // Check response length and quality
  if (response.length > 50 && response.length < 500) {
    score += 2;
    notes.push("Appropriate response length");
  } else if (response.length < 50) {
    score += 0;
    notes.push("Response too short");
  } else {
    score += 1;
    notes.push("Response might be too long");
  }

  // Check for first person usage
  if (
    response.includes("I ") ||
    response.includes("I'm ") ||
    response.includes("I am ")
  ) {
    score += 1;
    notes.push("Good first person usage");
  }

  return { score: Math.min(score, 10), notes: notes.join(", ") };
}

function generateTestReport(results) {
  console.log("\n📊 TEST REPORT");
  console.log("=".repeat(50));

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.analysis.score >= 7).length;
  const averageScore =
    results.reduce((sum, r) => sum + r.analysis.score, 0) / totalTests;

  console.log(`📈 Overall Score: ${averageScore.toFixed(1)}/10`);
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests\n`);

  // Detailed results
  results.forEach((result) => {
    const status = result.analysis.score >= 7 ? "✅" : "❌";
    console.log(
      `${status} ${result.id}: ${result.analysis.score}/10 - ${result.analysis.notes}`
    );
  });

  // Recommendations
  console.log("\n🔧 RECOMMENDATIONS:");

  const failedTests = results.filter((r) => r.analysis.score < 7);
  if (failedTests.length > 0) {
    console.log("❌ Failed tests need attention:");
    failedTests.forEach((test) => {
      console.log(`   - ${test.id}: ${test.analysis.notes}`);
    });
  }

  const lowScoreTests = results.filter((r) => r.analysis.score < 5);
  if (lowScoreTests.length > 0) {
    console.log("\n⚠️  Critical issues:");
    lowScoreTests.forEach((test) => {
      console.log(`   - ${test.id}: ${test.analysis.notes}`);
    });
  }

  console.log("\n🎯 Next steps:");
  console.log("1. Review failed tests");
  console.log("2. Update prompt if needed");
  console.log("3. Add missing data files");
  console.log("4. Re-run tests");
}

// Run the tests
if (require.main === module) {
  testChatbot().catch(console.error);
}

module.exports = { testChatbot };
