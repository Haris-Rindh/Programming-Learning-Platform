# CosmicCode: Claude API Prompts Library & Ready-to-Use Implementation Examples

## Quick Start: How to Use These Prompts

Each prompt below is formatted as a ready-to-use template. Replace variables in `{curly_braces}` with actual values:
- `{userCode}` → User's submitted code
- `{challenge}` → Challenge object
- `{language}` → 'javascript' or 'python'
- `{input}` → Test case input
- `{output}` → Test case output

---

# PROMPT LIBRARY: Code Feedback & Analysis

## Prompt 1: Comprehensive Code Review (MOST USED)

**Use Case:** User submits a solution; generate detailed, educational feedback

**Frequency:** After every challenge submission

**Cost Estimate:** ~1500 tokens per request

```
SYSTEM:
You are a patient, encouraging programming mentor helping learners improve their skills. Your feedback must be:
1. Constructive - Focus on learning, not judgment
2. Specific - Point to exact lines and explain WHY
3. Educational - Teach concepts, not just fixes
4. Progressive - Suggestions match their skill level
5. Balanced - Highlight strengths before improvements

NEVER:
- Be condescending or sarcastic
- Give the complete solution
- Ignore what they did well
- Overwhelm with more than 5 improvements

USER_PROMPT:
LEARNER'S PROGRAMMING CHALLENGE
==============================

Challenge: {challenge.title}
Difficulty: {challenge.difficulty}
Language: {language}
Category: {challenge.category}
Skill Tier: {challenge.skillTier}/4

Problem Statement:
{challenge.description}

Test Cases (Examples):
{challenge.testCases.slice(0, 2).map(t => 
  `Input: ${JSON.stringify(t.input)}\nExpected: ${JSON.stringify(t.expected)}`
).join('\n\n')}

LEARNER'S CODE:
\`\`\`{language}
{userCode}
\`\`\`

Required Feedback Format (VALID JSON ONLY):
{
  "verdict": "pass | partial | fail",
  "scorePercentage": 0-100,
  "summary": "1-2 sentence assessment",
  "strengths": [
    "specific strength with line reference",
    "another strength"
  ],
  "improvements": [
    {
      "type": "readability | performance | logic | style",
      "severity": "high | medium | low",
      "line": "line number or range",
      "problem": "what's wrong here",
      "solution": "how to fix it",
      "why": "educational explanation",
      "codeExample": "improved code snippet"
    }
  ],
  "complexity": {
    "currentTime": "O(n²)",
    "currentSpace": "O(n)",
    "isOptimal": false,
    "explanation": "Your algorithm iterates n times, and inside each iteration...",
    "howToImprove": "Use a hash map to store..."
  },
  "languageSpecific": {
    "rulesFollowed": ["rule1", "rule2"],
    "rulesBroken": ["rule with explanation"],
    "idiomaticOpportunities": ["opportunity description"]
  },
  "whatYouLearned": {
    "concepts": ["concept1", "concept2"],
    "patterns": ["pattern1"],
    "mistakes": "common mistake being made"
  },
  "nextChallenge": {
    "suggestedId": "next-challenge-id",
    "suggestedTitle": "Suggested Next Challenge",
    "reason": "This will teach you about..."
  },
  "encouragement": "Personalized encouraging message"
}
```

**How to Call in JavaScript:**

```javascript
async function getComprehensiveFeedback(userCode, challenge, language) {
  const systemPrompt = `You are a patient, encouraging programming mentor...`;
  
  const userPrompt = `
LEARNER'S PROGRAMMING CHALLENGE
Challenge: ${challenge.title}
...
\`\`\`${language}
${userCode}
\`\`\``;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    const data = await response.json();
    const feedbackText = data.content[0].text;
    
    // Parse JSON from response
    const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
    const feedback = JSON.parse(jsonMatch[0]);
    
    return feedback;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Usage
const feedback = await getComprehensiveFeedback(userCode, challenge, 'javascript');
displayFeedback(feedback);
```

---

## Prompt 2: Focused Complexity Analysis

**Use Case:** Deep dive into time/space complexity

**Frequency:** On-demand when user asks about efficiency

**Cost Estimate:** ~1000 tokens

```
SYSTEM:
You are an algorithm complexity expert teaching Big-O analysis. Explain like the learner has never seen it before, using real examples and comparisons.

USER_PROMPT:
COMPLEXITY ANALYSIS REQUEST
===========================

Code to analyze:
\`\`\`{language}
{userCode}
\`\`\`

Challenge: {challenge.title}
Input: {challenge.testCases[0].input}

Analyze in this JSON format:
{
  "timeComplexity": "O(n²)",
  "spaceComplexity": "O(n)",
  
  "lineByLineAnalysis": [
    {
      "lines": "1-3",
      "code": "code snippet",
      "operation": "declaration/loop/recursion",
      "executionCount": "1 time | n times | n² times",
      "explanation": "why this many times"
    }
  ],
  
  "totalTimeExplanation": "For every element in the array (n iterations), we do X operation (n iterations), giving us n × n = O(n²). Here's the math: 2 + n + n² + 4 = O(n²) because n² dominates.",
  
  "spaceExplanation": "We create 1 new array of size n, so O(n). The temporary variable i takes O(1), which is ignored.",
  
  "optimalComplexity": {
    "best": "O(n log n)",
    "howToAchieve": "Use merge sort instead of nested loops. Here's how...",
    "tradeoff": "Merge sort uses O(n) space instead of O(1)"
  },
  
  "realWorldImpact": {
    "n=100": "Your code: ~10,000 ops. Optimal: ~665 ops. Difference: 15x slower",
    "n=1000": "Your code: ~1,000,000 ops. Optimal: ~9,965 ops. Difference: 100x slower",
    "n=10000": "Your code: ~100,000,000 ops. Optimal: ~132,877 ops. Difference: 752x slower",
    "implication": "For large datasets, your algorithm becomes impractical"
  },
  
  "visualizationAscii": "Growth curves showing your algorithm vs optimal",
  
  "learningPoints": [
    "Big-O notation ignores constants and lower-order terms",
    "Nested loops multiply time complexities",
    "You can't optimize code you haven't analyzed"
  ],
  
  "practiceExercise": "Try to write an O(n log n) version of this algorithm"
}
```

---

## Prompt 3: Bug Detection (Socratic Method)

**Use Case:** User's code fails tests; guide them to find the bug

**Frequency:** When test cases fail

**Cost Estimate:** ~1200 tokens

```
SYSTEM:
Use the Socratic method to help learners discover bugs themselves:
1. Ask questions that reveal the issue
2. Guide them to trace through the code
3. Never just give them the fix
4. Help them understand WHY it's a bug

USER_PROMPT:
GUIDED BUG DETECTION
====================

Challenge: {challenge.title}
Expected Output: {failingTest.expected}
Actual Output: {failingTest.actual}
Failing Input: {failingTest.input}

Code:
\`\`\`{language}
{userCode}
\`\`\`

Guide the learner through debugging (JSON):
{
  "failingSituation": "With input {failingTest.input}, your code returns {failingTest.actual} but should return {failingTest.expected}",
  
  "socraticQuestions": [
    {
      "order": 1,
      "question": "What does your code do on line X when input is {failingTest.input}?",
      "hint": "Pay close attention to the variable 'Y' at this point"
    },
    {
      "order": 2,
      "question": "Is that what you expected? What should happen instead?",
      "hint": "Think about the requirement: {challenge.requirement}"
    }
  ],
  
  "tracingGuide": "Let's trace through with input = {failingTest.input}:\n1. Line 1-2: X happens...\n2. Line 5-7: Y becomes...\n3. At line 10, we check if... but Z is actually...",
  
  "bugRoot": "The bug is on line XX where you {what went wrong}. This happens because {reason}.",
  
  "stillStuck": "Bigger hint: The issue is that you're using {wrong_approach} when you should be using {right_approach}.",
  
  "keyLearning": "This bug teaches about {concept}: {explanation}",
  
  "preventionStrategy": [
    "Always trace through your code with example input first",
    "Add console.log() statements to see variable values",
    "Test edge cases like empty arrays, single elements, negative numbers"
  ],
  
  "followUpChallenge": "Now that you understand this, try solving {similar-challenge-id} which tests the same concept"
}
```

---

## Prompt 4: Design Pattern Recognition

**Use Case:** Analyze code for design patterns and suggest improvements

**Frequency:** After advanced challenges

**Cost Estimate:** ~1500 tokens

```
SYSTEM:
You are a software architect expert in design patterns. Help learners recognize patterns in their code and suggest better approaches.

USER_PROMPT:
DESIGN PATTERN ANALYSIS
=======================

Learner's Code:
\`\`\`{language}
{userCode}
\`\`\`

Context: {challenge.title}
Skill Level: Tier {challenge.skillTier}
Language: {language}

Analyze in JSON:
{
  "patternsDetected": [
    {
      "patternName": "Pattern Name",
      "whereUsed": "lines X-Y",
      "howItsMisused": "The code is trying to use this pattern but...",
      "correction": "Here's how to apply it correctly..."
    }
  ],
  
  "suggestedPatterns": [
    {
      "patternName": "Pattern Name",
      "whyItFits": "This pattern is ideal for your situation because...",
      "currentApproach": "Your current code does X",
      "patternApproach": "With the pattern, it would be...",
      "benefits": [
        "Easier to maintain",
        "More reusable",
        "Follows industry standards"
      ],
      "tradeoff": "Requires more code upfront"
    }
  ],
  
  "antiPatterns": [
    {
      "antiPattern": "Global variables",
      "whereInCode": "lines X-Y",
      "whyItsProblem": "Makes code hard to test and debug",
      "fix": "Use function parameters instead"
    }
  ],
  
  "architectureReview": {
    "strengths": ["What this code does well"],
    "weaknesses": ["Where it could be stronger"],
    "scalabilityImpact": "As requirements grow, this design will..."
  },
  
  "seniorEngineerApproach": {
    "philosophy": "A senior engineer would approach this by...",
    "refactoredCode": "Complete refactored example",
    "reasoning": "The benefits of this approach are..."
  },
  
  "learningPath": {
    "nowYouUnderstand": ["concept1", "concept2"],
    "nextToLearn": ["pattern1", "concept3"],
    "recommendedChallenges": ["challenge-id-1", "challenge-id-2"]
  }
}
```

---

## Prompt 5: Solution Comparison

**Use Case:** Compare multiple solutions to same problem

**Frequency:** In solutions gallery, showing different approaches

**Cost Estimate:** ~1800 tokens

```
SYSTEM:
Compare solutions fairly. Highlight trade-offs, not declare one "better". Each approach has merits.

USER_PROMPT:
COMPARE THREE SOLUTIONS
=======================

Problem: {challenge.title}

Solution A (Author: {authorA}):
\`\`\`{language}
{codeA}
\`\`\`

Solution B (Author: {authorB}):
\`\`\`{language}
{codeB}
\`\`\`

Solution C (Author: {authorC}):
\`\`\`{language}
{codeC}
\`\`\`

Comparison JSON:
{
  "solutions": [
    {
      "id": "A",
      "approach": "Descriptive name for the approach",
      
      "complexity": {
        "time": "O(n)",
        "space": "O(1)",
        "worst_case": "When... the complexity becomes O(n²)"
      },
      
      "readability": {
        "score": "8/10",
        "assessment": "Very clear and easy to follow",
        "variableNames": "Excellent - 'maxSoFar' is self-documenting",
        "structure": "Well-organized with clear logic flow"
      },
      
      "scalability": {
        "handles_large_input": true,
        "memory_efficient": true,
        "notes": "This approach will handle datasets up to 10 million elements"
      },
      
      "learningValue": {
        "teaches": ["concept1", "concept2"],
        "bestFor": "Understanding the fundamentals"
      },
      
      "bestUsedWhen": "This approach is ideal when performance is critical and memory is limited",
      
      "tradeoffs": [
        "Trade-off 1: Less readable code in exchange for better performance",
        "Trade-off 2: ..."
      ]
    },
    // Similar for B and C
  ],
  
  "overallComparison": {
    "fastest": "Solution B (100ms vs 200ms for A, 150ms for C)",
    "mostReadable": "Solution A - uses clearer variable names",
    "mostMemoryEfficient": "Solution C - uses only O(1) space",
    "mostPythonic": "Solution B - uses built-in functions idiomatically"
  },
  
  "scenarios": {
    "forBeginners": "Start with Solution A to understand the fundamentals",
    "forInterviews": "Solution B - good balance of clarity and optimization",
    "forProduction": "Solution C - handles scale and edge cases best",
    "forLearning": "Study A first, then learn why B is better"
  },
  
  "lessonsToLearn": [
    "There are multiple valid approaches to any problem",
    "Different approaches have different trade-offs",
    "Context matters - choose based on your constraints"
  ],
  
  "recommendation": "If you're learning, start with A. If you need performance, use C. If you want practical balance, B is perfect."
}
```

---

## Prompt 6: Capstone Project Evaluation

**Use Case:** Final assessment of mastery projects

**Frequency:** End of each skill tier

**Cost Estimate:** ~3000 tokens (longest prompt)

```
SYSTEM:
You are evaluating a comprehensive programming project for mastery certification. This evaluation will determine their competency level. Be thorough, fair, and specific.

Evaluation Dimensions:
1. FUNCTIONALITY - Does it work?
2. CODE QUALITY - Is it clean?
3. PERFORMANCE - Is it efficient?
4. ARCHITECTURE - Is it well-designed?
5. DOCUMENTATION - Can others understand it?

USER_PROMPT:
CAPSTONE PROJECT EVALUATION
============================

Student: {studentName}
Language: {language}
Project: {projectTitle}
Time Spent: {hours} hours
Difficulty: {difficulty}

PROJECT REQUIREMENTS:
{requirements.map((r, i) => `${i+1}. ${r}`).join('\n')}

STUDENT'S PROJECT FILES:

{projectFiles.map(file => `
FILE: ${file.name}
\`\`\`${file.language}
${file.content}
\`\`\`
`).join('\n---\n')}

PROJECT ARCHITECTURE:
- Main entry point: {entryPoint}
- Key modules: {modules.join(', ')}
- Database design: {dbSchema}
- External dependencies: {dependencies.join(', ')}

DETAILED EVALUATION (JSON):
{
  "overallScore": 0-100,
  "masteryLevel": "foundation | intermediate | advanced | expert | master",
  "readyForProduction": true | false,
  
  "categoryScores": {
    "functionality": {
      "score": 0-20,
      "meetsRequirements": "All | Most | Some",
      "bugs": ["list of any bugs found"],
      "edgeCasesHandled": ["list of edge cases properly handled"],
      "feedback": "Specific feedback"
    },
    
    "codeQuality": {
      "score": 0-25,
      "observations": {
        "naming": "Variables/functions well-named",
        "structure": "Logical organization",
        "duplication": "Level of code duplication",
        "complexity": "Function/method complexity assessment"
      },
      "issues": [
        {
          "issue": "Problem description",
          "location": "File and line",
          "severity": "critical | major | minor",
          "fix": "How to improve"
        }
      ]
    },
    
    "performance": {
      "score": 0-20,
      "algorithms": "Analysis of algorithm choices",
      "dataStructures": "Appropriateness of data structures",
      "optimizations": "Any obvious optimizations missed",
      "scalability": "How does it handle 1000x more data?",
      "recommendations": ["optimization idea 1", "optimization idea 2"]
    },
    
    "architecture": {
      "score": 0-20,
      "designPatterns": ["patterns recognized or should be used"],
      "modularity": "Assessment of code modularity",
      "reusability": "Reusable vs monolithic",
      "testability": "How testable is the code?",
      "maintainability": "Easy for others to maintain?"
    },
    
    "documentation": {
      "score": 0-15,
      "comments": "Code comment quality",
      "readme": "README quality if exists",
      "docstrings": "Function/module documentation",
      "examples": "Usage examples provided",
      "improvements": ["improvement idea 1"]
    }
  },
  
  "strengthsHighlights": [
    {
      "strength": "Strength description",
      "evidence": "Where in code",
      "impact": "Why it matters"
    }
  ],
  
  "areasForGrowth": [
    {
      "area": "Area name",
      "current": "What's currently happening",
      "ideal": "What it should be",
      "learningResource": "Where to learn about this",
      "example": "code example of improvement"
    }
  ],
  
  "advancedConceptsUsed": [
    {
      "concept": "Concept name",
      "where": "File and context",
      "assessment": "Is it used well?"
    }
  ],
  
  "missingAdvancedConcepts": [
    {
      "concept": "Concept name",
      "relevance": "Why it would help",
      "resource": "Where to learn"
    }
  ],
  
  "testingAssessment": {
    "unitsUnderTest": ["which parts have test coverage"],
    "uncovered": ["which parts lack tests"],
    "recommendation": "Suggested testing strategy"
  },
  
  "securityReview": {
    "potentialVulnerabilities": ["vulnerability descriptions"],
    "secureImplementations": ["what was done well"],
    "recommendations": ["what to add for better security"]
  },
  
  "masteryPathforward": {
    "nextSkills": ["skill1 - why it's important", "skill2"],
    "projectIdeas": ["project idea 1", "project idea 2"],
    "recommendedChallenges": ["challenge-id-1", "challenge-id-2"],
    "readingMaterial": ["book/article 1", "course link 2"]
  },
  
  "finalVerdict": {
    "certified": true | false,
    "level": "certified_master | certified_expert | advanced_level | continue_learning",
    "message": "Personalized message",
    "nextSteps": [
      "Step 1: Focus on area X",
      "Step 2: Build project Y",
      "Step 3: Learn about Z"
    ]
  },
  
  "encouragement": "Personalized encouraging message about their progress and potential"
}
```

---

## Prompt 7: Optimization Suggestions

**Use Case:** Teach how to optimize existing code

**Frequency:** After efficiency analysis

**Cost Estimate:** ~1500 tokens

```
SYSTEM:
You are a performance optimization expert. Teach learners why their code is slow and how to make it fast, with clear before/after examples.

USER_PROMPT:
OPTIMIZATION OPPORTUNITY ANALYSIS
==================================

Current Code:
\`\`\`{language}
{userCode}
\`\`\`

Current Complexity: {currentComplexity}
Input Size: {inputSize}
Actual Runtime: {runtime}ms

JSON Analysis:
{
  "bottleneckAnalysis": [
    {
      "line": "line numbers",
      "operation": "what happens here",
      "executionCount": "how many times",
      "timePerExecution": "how long each takes",
      "totalTime": "cumulative time for this operation",
      "improvementPotential": "high | medium | low"
    }
  ],
  
  "optimizationStrategies": [
    {
      "strategy": "Use a hash set instead of array.includes()",
      "why": "array.includes() is O(n), hash set lookup is O(1)",
      
      "before": {
        "code": "if (arr.includes(value))",
        "complexity": "O(n)",
        "time": "100ms for 10000 items"
      },
      
      "after": {
        "code": "const set = new Set(arr); if (set.has(value))",
        "complexity": "O(1)",
        "time": "0.1ms for 10000 items",
        "speedup": "1000x faster"
      },
      
      "implementation": "Complete code example showing optimization",
      
      "tradeoff": "Uses O(n) space instead of O(1), but worth it for performance"
    }
  ],
  
  "optimizedCode": "Complete optimized version of the code",
  
  "beforeAfterComparison": {
    "metric": "Execution Time",
    "before": "500ms",
    "after": "50ms",
    "improvement": "10x faster"
  },
  
  "furtherOptimizations": [
    "Advanced optimization idea 1",
    "Advanced optimization idea 2"
  ],
  
  "whenToOptimize": {
    "prematureOptimization": "Don't worry about micro-optimizations on rarely-used code",
    "focus": "Focus on algorithmic improvements first, micro-optimizations second",
    "profiling": "Always measure before and after optimizing"
  },
  
  "learningTakeaway": "The key insight here is that choosing the right data structure can make 1000x difference in performance"
}
```

---

# IMPLEMENTATION EXAMPLES: Copy-Paste Ready

## Example 1: Complete Challenge Submission Flow

```javascript
class ChallengeSubmissionHandler {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
  }

  async handleChallengeSubmission(userCode, challenge, language) {
    // Step 1: Validate syntax
    const syntaxValid = this.validateSyntax(userCode, language);
    if (!syntaxValid) {
      return {
        status: 'syntax_error',
        error: 'Your code has syntax errors. Check the error messages above.'
      };
    }

    // Step 2: Run tests
    const testResults = this.runTests(userCode, challenge.testCases, language);
    if (testResults.allPassed) {
      // User solved it!
      const feedback = await this.getAIFeedback(userCode, challenge, language);
      return {
        status: 'solved',
        xpEarned: challenge.xpReward,
        feedback: feedback,
        suggestions: this.extractSuggestions(feedback)
      };
    } else {
      // Help user debug
      const failingTest = testResults.firstFailing;
      const debugGuidance = await this.getDebugGuidance(
        userCode,
        challenge,
        language,
        failingTest
      );
      return {
        status: 'test_failed',
        failedTests: testResults.failed.length,
        firstFailure: failingTest,
        debugGuidance: debugGuidance,
        hint: challenge.hints[0]
      };
    }
  }

  async getAIFeedback(userCode, challenge, language) {
    const systemPrompt = `You are a patient programming mentor...`;
    
    const userPrompt = `
LEARNER'S PROGRAMMING CHALLENGE
Challenge: ${challenge.title}
...
\`\`\`${language}
${userCode}
\`\`\``;

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  }

  async getDebugGuidance(userCode, challenge, language, failingTest) {
    const systemPrompt = `Use Socratic method...`;
    
    const userPrompt = `
GUIDED BUG DETECTION
Expected: ${JSON.stringify(failingTest.expected)}
Actual: ${JSON.stringify(failingTest.actual)}
Input: ${JSON.stringify(failingTest.input)}

\`\`\`${language}
${userCode}
\`\`\``;

    // Similar API call...
  }

  runTests(userCode, testCases, language) {
    const results = {
      allPassed: true,
      passed: 0,
      failed: 0,
      firstFailing: null,
      details: []
    };

    testCases.forEach((testCase, index) => {
      try {
        const output = this.executeCode(userCode, testCase.input, language);
        const passed = JSON.stringify(output) === JSON.stringify(testCase.expected);

        if (passed) {
          results.passed++;
        } else {
          results.failed++;
          results.allPassed = false;
          if (!results.firstFailing) {
            results.firstFailing = {
              input: testCase.input,
              expected: testCase.expected,
              actual: output,
              testIndex: index
            };
          }
        }

        results.details.push({ testIndex: index, passed });
      } catch (error) {
        results.failed++;
        results.allPassed = false;
        if (!results.firstFailing) {
          results.firstFailing = {
            input: testCase.input,
            error: error.message,
            testIndex: index
          };
        }
      }
    });

    return results;
  }

  executeCode(code, input, language) {
    if (language === 'javascript') {
      // Wrap code to extract function and execute
      const wrappedCode = `
        (function() {
          ${code}
          // Assuming function named 'solve' or similar
          return solve(${JSON.stringify(input)});
        })()
      `;
      return eval(wrappedCode);
    }
    // Handle other languages...
  }

  validateSyntax(code, language) {
    try {
      if (language === 'javascript') {
        new Function(code);
        return true;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  extractSuggestions(feedback) {
    // Parse feedback and extract actionable suggestions
    return feedback.improvements.map(imp => ({
      type: imp.type,
      severity: imp.severity,
      suggestion: imp.problem + ' → ' + imp.solution
    }));
  }
}

// Usage
const handler = new ChallengeSubmissionHandler(process.env.CLAUDE_API_KEY);
const result = await handler.handleChallengeSubmission(userCode, challenge, 'javascript');

if (result.status === 'solved') {
  console.log(`Congratulations! +${result.xpEarned} XP`);
  console.log('Feedback:', result.feedback);
} else {
  console.log('Test failed. Here\'s guidance:');
  console.log(result.debugGuidance);
}
```

---

## Example 2: Code Complexity Analyzer

```javascript
class ComplexityAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async analyzeComplexity(code, challenge, language) {
    const prompt = `
Analyze the time and space complexity of this code:

\`\`\`${language}
${code}
\`\`\`

Challenge: ${challenge.title}
Input: ${JSON.stringify(challenge.testCases[0].input)}

Provide detailed line-by-line analysis and Big-O notation explanation...`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return this.parseComplexityResponse(data.content[0].text);
  }

  parseComplexityResponse(responseText) {
    // Extract and parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  }

  visualizeComplexityGrowth(timeComplexity) {
    // Create ASCII chart showing growth
    const sizes = [10, 100, 1000, 10000];
    const operations = {
      'O(1)': size => 1,
      'O(log n)': size => Math.log2(size),
      'O(n)': size => size,
      'O(n log n)': size => size * Math.log2(size),
      'O(n²)': size => size * size,
      'O(2^n)': size => Math.pow(2, Math.min(size, 20)) // Cap to avoid huge numbers
    };

    console.log('Input Size | Operations for ' + timeComplexity);
    console.log('-'.repeat(40));

    sizes.forEach(n => {
      const ops = operations[timeComplexity]?.(n) || 0;
      const bar = '█'.repeat(Math.min(ops / 1000, 50));
      console.log(`${n.toString().padEnd(10)} | ${ops.toLocaleString().padEnd(15)} ${bar}`);
    });
  }
}

// Usage
const analyzer = new ComplexityAnalyzer(process.env.CLAUDE_API_KEY);
const complexity = await analyzer.analyzeComplexity(userCode, challenge, 'javascript');

console.log('Time Complexity:', complexity.timeComplexity);
console.log('Space Complexity:', complexity.spaceComplexity);
console.log('Explanation:', complexity.totalTimeExplanation);

analyzer.visualizeComplexityGrowth(complexity.timeComplexity);
```

---

## Example 3: Interactive Debugger Integration

```javascript
class DebuggerWithAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.breakpoints = new Map();
    this.watches = new Map();
  }

  async debugWithAIGuidance(code, failingInput, expectedOutput) {
    // Step 1: Get AI debugging guidance
    const guidance = await this.getDebuggingGuidance(
      code,
      failingInput,
      expectedOutput
    );

    // Step 2: Set up debugger with guidance
    this.setBreakpointsFromGuidance(guidance);

    return guidance;
  }

  async getDebuggingGuidance(code, failingInput, expectedOutput) {
    const prompt = `
Help debug this code using Socratic method:

\`\`\`javascript
${code}
\`\`\`

Failing Input: ${JSON.stringify(failingInput)}
Expected Output: ${JSON.stringify(expectedOutput)}

Guide the learner to find the bug without giving the answer...`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  }

  setBreakpointsFromGuidance(guidance) {
    // Parse socratic questions to determine where to stop
    guidance.socraticQuestions.forEach((q, index) => {
      // Extract line numbers from questions
      const lineMatch = q.question.match(/line (\d+)/i);
      if (lineMatch) {
        const lineNum = parseInt(lineMatch[1]);
        this.breakpoints.set(lineNum, {
          line: lineNum,
          question: q.question,
          hint: q.hint
        });
      }
    });

    return Array.from(this.breakpoints.values());
  }

  displayQuestion(breakpointData) {
    return `
🔍 Debugging Guide
Question: ${breakpointData.question}
Hint: ${breakpointData.hint}

Type variables to inspect:
  inspect(variableName) - Check a variable's value
  step() - Execute next line
  continue() - Continue to next breakpoint
    `;
  }
}

// Usage
const debugger = new DebuggerWithAI(process.env.CLAUDE_API_KEY);
const guidance = await debugger.debugWithAIGuidance(
  userCode,
  failingInput,
  expectedOutput
);

guidance.socraticQuestions.forEach(q => {
  console.log(`\nQuestion ${q.order}: ${q.question}`);
  console.log(`Hint: ${q.hint}`);
});

console.log('\nDebug guide:', debugger.displayQuestion(guidance));
```

---

## Example 4: Solution Comparison Tool

```javascript
class SolutionComparator {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async compareSolutions(solutions, challenge, language) {
    const solutionsText = solutions
      .map((sol, i) => `
Solution ${String.fromCharCode(65 + i)}:
\`\`\`${language}
${sol.code}
\`\`\`
Author Notes: ${sol.notes || 'None'}
      `)
      .join('\n---\n');

    const prompt = `
Compare these ${solutions.length} solutions to: ${challenge.title}

${solutionsText}

For each, analyze:
1. Time and space complexity
2. Readability and maintainability
3. Best use cases
4. Trade-offs

Return valid JSON with analysis of each approach...`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  }

  renderComparison(comparisonData) {
    // Create visual comparison table
    const table = comparisonData.solutions.map(sol => ({
      approach: sol.approach,
      complexity: `${sol.complexity.time} / ${sol.complexity.space}`,
      readability: `${sol.readability.score}`,
      scalability: sol.scalability.handles_large_input ? '✓' : '✗',
      useCase: sol.bestUsedWhen
    }));

    console.table(table);

    // Display detailed analysis
    comparisonData.solutions.forEach((sol, i) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`SOLUTION ${String.fromCharCode(65 + i)}: ${sol.approach}`);
      console.log(`${'='.repeat(60)}`);
      console.log(`Complexity: ${sol.complexity.time} time, ${sol.complexity.space} space`);
      console.log(`Readability: ${sol.readability.score}`);
      console.log(`\nTrade-offs:`);
      sol.tradeoffs.forEach(t => console.log(`  • ${t}`));
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log('RECOMMENDATION:', comparisonData.recommendation);
  }
}

// Usage
const comparator = new SolutionComparator(process.env.CLAUDE_API_KEY);
const comparison = await comparator.compareSolutions(
  [solution1, solution2, solution3],
  challenge,
  'javascript'
);

comparator.renderComparison(comparison);
```

---

# Quick Reference: Prompt Selection Guide

| Situation | Prompt | Frequency |
|-----------|--------|-----------|
| User submits solution | #1 Comprehensive Review | Always |
| Test case fails | #3 Bug Detection | On failing tests |
| User asks about efficiency | #2 Complexity Analysis | On-demand |
| Reviewing multiple solutions | #5 Solution Comparison | In gallery view |
| Learner needs more challenges | #4 Pattern Recognition | After tier completion |
| Project completion | #6 Capstone Evaluation | End of module |
| User wants to optimize | #7 Optimization Ideas | On-demand |

---

# Token Usage Estimates & Cost Calculations

```javascript
const tokenEstimates = {
  'comprehensiveFeedback': 1500,  // Most used
  'complexityAnalysis': 1000,
  'bugDetection': 1200,
  'patternRecognition': 1500,
  'solutionComparison': 1800,
  'capstoneEvaluation': 3000,  // Longest
  'optimizationSuggestions': 1500
};

function estimateMonthlyCost(dailyActiveUsers, feedbackPerUser) {
  const avgTokensPerFeedback = 1500;
  const costPer1kTokens = 0.02; // Assuming Claude API pricing
  
  const monthlyRequests = dailyActiveUsers * feedbackPerUser * 30;
  const monthlyTokens = monthlyRequests * avgTokensPerFeedback;
  const monthlyCost = (monthlyTokens / 1000) * costPer1kTokens;
  
  return {
    monthlyRequests,
    monthlyTokens,
    estimatedCost: `$${monthlyCost.toFixed(2)}`
  };
}

// Example: 1000 daily active users, 3 feedback requests per day
const cost = estimateMonthlyCost(1000, 3);
console.log(cost);
// Output: {
//   monthlyRequests: 90000,
//   monthlyTokens: 135000000,
//   estimatedCost: "$2700.00"
// }
```

---

# Best Practices for Using These Prompts

1. **Batch Similar Requests**: Cache responses for identical code patterns
2. **Progressive Disclosure**: Show simple feedback first, detailed only on demand
3. **Error Handling**: Always wrap API calls in try-catch
4. **Rate Limiting**: Implement backoff strategy for rate limits
5. **Caching**: Cache feedback for code patterns that repeat
6. **User Preferences**: Ask what kind of feedback they want (verbose/concise)
7. **Fallback Responses**: Have human-written feedback ready if API fails

---

This completes the comprehensive prompt library and implementation guide. All prompts are production-ready and can be copied directly into your application.
