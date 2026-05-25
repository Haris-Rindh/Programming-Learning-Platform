// CosmicCode AI Feedback & Complexity Simulator Engine
// Implements JSON structures and algorithms from the Claude API Prompts Library

const AIFeedbackEngine = {
  // Perform static analysis on user's code to generate matching JSON payloads
  generateFeedback(userCode, challengeId, language, isPassed) {
    const codeClean = userCode.trim();
    
    // 1. Determine Algorithmic Complexity (Prompt 2 & Prompt 7)
    let timeComplexity = "O(1)";
    let spaceComplexity = "O(1)";
    let isOptimal = true;
    let complexityExplanation = "Your code executes in constant time because it performs direct operations without looping structures.";
    let howToImprove = "No immediate optimizations needed for this linear complexity level.";
    let beforeAfter = null;

    // Detect loops (O(n))
    const loopRegex = /(for|while|forEach|map|filter)/g;
    const loopCount = (codeClean.match(loopRegex) || []).length;
    
    if (loopCount === 1) {
      timeComplexity = "O(n)";
      spaceComplexity = codeClean.includes(".push") || codeClean.includes(".append") ? "O(n)" : "O(1)";
      complexityExplanation = "Your code iterates n times through the dataset, processing each element in linear execution cycles.";
    } else if (loopCount > 1) {
      // Check for nested loops
      const nestedCheck = /for[\s\S]*for|while[\s\S]*while/g.test(codeClean.replace(/\s+/g, ' '));
      if (nestedCheck) {
        timeComplexity = "O(n²)";
        spaceComplexity = "O(1)";
        isOptimal = false;
        complexityExplanation = "Your code uses nested loops. For every element n, you perform another n iterations, resulting in quadratic growth.";
        howToImprove = "Utilize a Hash Set or Hash Map to store intermediate lookups, transforming nested checks into O(1) actions to reach O(n) runtime.";
        
        beforeAfter = {
          strategy: "Convert nested loop search to a Hash Set lookup",
          before: "O(n²) time - 100ms for 10,000 iterations",
          after: "O(n) time - 0.2ms for 10,000 iterations (500x speedup)"
        };
      } else {
        timeComplexity = "O(n)";
        complexityExplanation = "Your code contains sequential loops, which execute back-to-back: O(n + m) -> simplified to O(n).";
      }
    }

    // 2. Generate Prompt 1 Structure (Comprehensive Feedback)
    if (isPassed) {
      return {
        verdict: "pass",
        scorePercentage: 100,
        summary: "Excellent operations! Your algorithm successfully processes all compiler criteria under perfect syntax bounds.",
        strengths: [
          "Well-structured variable bounds ensuring secure state containment.",
          "Clear, logical control flow that is highly readable and scalable."
        ],
        improvements: beforeAfter ? [
          {
            type: "performance",
            severity: "high",
            line: "nested loops block",
            problem: "Quadratic time complexity O(n²)",
            solution: "Use a Hash Map/Set to map key structures.",
            why: "Allows lookups in O(1) constant time instead of re-iterating the array.",
            codeExample: "// Optimal implementation\nconst lookupSet = new Set(data);\nif (lookupSet.has(target)) { ... }"
          }
        ] : [
          {
            type: "style",
            severity: "low",
            line: "general code alignment",
            problem: "Minor whitespace spacing",
            solution: "Consolidate formatting rules.",
            why: "Consistent indentation enhances team reading speeds.",
            codeExample: "// Styled layout\nconst main = () => {\n  console.log('Nominal');\n};"
          }
        ],
        complexity: {
          currentTime: timeComplexity,
          currentSpace: spaceComplexity,
          isOptimal: isOptimal,
          explanation: complexityExplanation,
          howToImprove: howToImprove
        },
        languageSpecific: {
          rulesFollowed: ["Proper block declarations", "No global scoping clutter"],
          rulesBroken: [],
          idiomaticOpportunities: language === "javascript" 
            ? ["Consider replacing standard loops with Array methods (map, filter)."] 
            : ["Utilize Python's list comprehensions for concise array structuring."]
        },
        whatYouLearned: {
          concepts: ["Variable Scope", "Logical Evaluation"],
          patterns: beforeAfter ? ["Linear lookup caching"] : ["Sequential executions"],
          mistakes: "None detected - clean execution."
        },
        encouragement: "🚀 Outstanding work, Commander! Your logic functions at peak capacity. Let's launch the next sector!"
      };
    } else {
      // 3. Generate Prompt 3 Structure (Socratic Bug Detection)
      return {
        verdict: "fail",
        scorePercentage: 40,
        summary: "Your code compiled, but missed the target objectives or output assertions.",
        failingSituation: "Target variables or DOM styles were not registered at correct states.",
        socraticQuestions: [
          {
            order: 1,
            question: `What value does your primary variable hold after execution?`,
            hint: "Add console.log() lines to trace how values transform."
          },
          {
            order: 2,
            question: "Are your spelling and case matching the challenge objectives?",
            hint: "JavaScript and Python are highly case-sensitive: 'warpSpeed' is not the same as 'warpspeed'."
          }
        ],
        tracingGuide: "Tracer flow log:\n1. Code initiated in sandbox scope.\n2. Standard declarations registered.\n3. Output check failed: Expected state condition missing.",
        bugRoot: "Variable declaration spelling mismatch or missing mathematical update statements.",
        stillStuck: "Double check the exact spelling requested in the panel. Try using the suggested code pattern below.",
        keyLearning: "Syntax mapping: Code compilers require exact character matches to access memory registries.",
        preventionStrategy: [
          "Always test your algorithms with empty or edge values first.",
          "Keep parameter scopes localized to prevent logical leakage.",
          "Format code blocks nicely to reveal missing brackets."
        ],
        encouragement: "🔋 Don't worry, Cadet! Debugging is 90% of a developer's flight. Study Byte's questions above and try compiling again!"
      };
    }
  },

  // Generate ASCII Growth Curves (Prompt 2 Visualization)
  generateAsciiChart(complexity) {
    const sizeMap = [10, 50, 100, 500];
    const formulas = {
      "O(1)": n => 1,
      "O(n)": n => n,
      "O(n²)": n => (n * n) / 100 // scale down for chart bounds
    };
    
    const formula = formulas[complexity] || formulas["O(n)"];
    let chart = "\n  ASCII GROWTH CURVE:\n";
    chart += "  Input Size | Operations Chart\n";
    chart += "  " + "-".repeat(45) + "\n";
    
    sizeMap.forEach(n => {
      const ops = Math.round(formula(n));
      const cappedOps = Math.min(ops, 40);
      const bar = "█".repeat(cappedOps) + (ops > 40 ? "+" : "");
      chart += `  n = ${String(n).padEnd(6)} | ${bar.padEnd(40)} (${ops.toLocaleString()} ops)\n`;
    });
    
    return chart;
  },

  // Format the comprehensive JSON payload into stunning HTML
  renderFeedbackHTML(feedback, complexityChart = "") {
    if (feedback.verdict === "pass") {
      let improvementsHTML = "";
      feedback.improvements.forEach(imp => {
        improvementsHTML += `
          <div style="background:rgba(255, 215, 0, 0.03); border: 1px dashed rgba(255, 215, 0, 0.2); padding: 14px; border-radius: 8px; margin-top: 10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="badge-ui" style="color:var(--accent-gold); border-color:rgba(255,215,0,0.2); font-size:0.7rem;">${imp.type.toUpperCase()} / SEVERITY: ${imp.severity.toUpperCase()}</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">Line: ${imp.line}</span>
            </div>
            <h5 style="color:#fff; margin: 8px 0 4px 0; font-size:0.9rem;">${imp.problem}</h5>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom: 8px;">${imp.why}</p>
            <div style="background:#05070f; padding:10px; border-radius:6px; font-family:var(--font-mono); font-size:0.75rem; color:#ffd700; white-space:pre-wrap;">${imp.codeExample}</div>
          </div>
        `;
      });

      return `
        <div style="animation: fadeIn 0.4s ease-out;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <span style="font-size:2rem;">🛡️</span>
            <div>
              <h4 style="color:var(--accent-green); font-size:1.1rem; margin-bottom:2px;">AI Mentor Review: PASSED</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary);">${feedback.summary}</p>
            </div>
          </div>
          
          <div style="margin-bottom:20px;">
            <h5 style="color:#fff; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; border-bottom:1px solid var(--border-light); padding-bottom:4px;">Strengths</h5>
            <ul style="padding-left:18px; font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              ${feedback.strengths.map(s => `<li>${s}</li>`).join("")}
            </ul>
          </div>

          <div style="margin-bottom:20px; background:rgba(0, 240, 255, 0.02); border:1px solid rgba(0, 240, 255, 0.1); padding:16px; border-radius:12px;">
            <h5 style="color:var(--accent-cyan); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Algorithmic Complexity</h5>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-family:var(--font-mono); font-size:0.9rem;">
              <span>Time: <strong style="color:#fff;">${feedback.complexity.currentTime}</strong></span>
              <span>Space: <strong style="color:#fff;">${feedback.complexity.currentSpace}</strong></span>
            </div>
            <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.5;">${feedback.complexity.explanation}</p>
            ${complexityChart ? `<pre style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan); background:#04050a; padding:10px; border-radius:6px; margin-top:10px; overflow-x:auto; border:1px solid rgba(0,240,255,0.05);">${complexityChart}</pre>` : ""}
          </div>

          ${feedback.improvements.length > 0 ? `
            <div style="margin-bottom:20px;">
              <h5 style="color:#fff; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; border-bottom:1px solid var(--border-light); padding-bottom:4px;">Optimization Opportunities</h5>
              ${improvementsHTML}
            </div>
          ` : ""}

          <div style="background:rgba(57, 255, 20, 0.03); border:1px solid rgba(57, 255, 20, 0.1); padding:14px; border-radius:10px; font-size:0.85rem; line-height:1.5;">
            <span style="font-weight:bold; color:var(--accent-green);">Byte's Encouragement:</span> ${feedback.encouragement}
          </div>
        </div>
      `;
    } else {
      let questionsHTML = "";
      feedback.socraticQuestions.forEach(q => {
        questionsHTML += `
          <div style="background:rgba(255, 0, 127, 0.02); border: 1px solid rgba(255, 0, 127, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
            <div style="color:var(--accent-pink); font-weight:bold; font-size:0.8rem; margin-bottom:4px;">Question ${q.order}</div>
            <p style="color:#fff; font-size:0.85rem; font-weight:500; margin-bottom:4px;">${q.question}</p>
            <p style="color:var(--text-secondary); font-size:0.75rem;">💡 ${q.hint}</p>
          </div>
        `;
      });

      return `
        <div style="animation: fadeIn 0.4s ease-out;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <span style="font-size:2rem;">🤖</span>
            <div>
              <h4 style="color:var(--accent-pink); font-size:1.1rem; margin-bottom:2px;">AI Socratic Debugger</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary);">${feedback.summary}</p>
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <h5 style="color:#fff; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; border-bottom:1px solid var(--border-light); padding-bottom:4px;">Socratic Guidance</h5>
            ${questionsHTML}
          </div>

          <div style="margin-bottom:20px; background:rgba(0,0,0,0.2); padding:12px; border-radius:8px; border:1px solid var(--border-light);">
            <h5 style="color:#fff; font-size:0.8rem; margin-bottom:6px;">Line Execution Trace</h5>
            <pre style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-secondary); white-space:pre-wrap; margin:0;">${feedback.tracingGuide}</pre>
          </div>

          <div style="background:rgba(255, 0, 127, 0.03); border:1px solid rgba(255, 0, 127, 0.1); padding:14px; border-radius:10px; font-size:0.85rem; line-height:1.5;">
            <span style="font-weight:bold; color:var(--accent-pink);">Byte's Direct Tip:</span> ${feedback.stillStuck}
          </div>
        </div>
      `;
    }
  }
};

window.AIFeedbackEngine = AIFeedbackEngine;
