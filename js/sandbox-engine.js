// CosmicCode Sandbox Laboratory Engine

document.addEventListener("DOMContentLoaded", () => {
  let currentLang = "htmlcss";

  // UI Bindings
  const editor = document.getElementById("sandbox-editor");
  const iframe = document.getElementById("sandbox-iframe");
  const consoleFeed = document.getElementById("sandbox-console-feed");
  const memoryStage = document.getElementById("sandbox-memory-stage");
  
  const stageHTML = document.getElementById("preview-stage-html");
  const stageVars = document.getElementById("preview-stage-vars");
  
  const tabHTML = document.getElementById("tab-html");
  const tabJS = document.getElementById("tab-js");
  const tabPY = document.getElementById("tab-py");
  
  const btnRun = document.getElementById("btn-sandbox-run");
  const btnAI = document.getElementById("btn-sandbox-ai");
  const templateSelect = document.getElementById("template-select");
  const stageAI = document.getElementById("preview-stage-ai");
  const aiStage = document.getElementById("sandbox-ai-stage");

  // Template Database
  const TEMPLATES = {
    htmlcss: `<!-- Cosmic Visual Reacting Panel -->
<div class="panel">
  <h2>COCKPIT PROPULSION</h2>
  <div class="reactor">
    <div class="core"></div>
  </div>
  <h3>SYSTEM NOMINAL</h3>
  <button class="btn-warp" onclick="engageWarp()">ENGAGE WARP CORE</button>
</div>

<script>
  function engageWarp() {
    alert("Warp Drive engaged! Accelerating to speed factor 5!");
  }
</script>

<style>
  body {
    background-color: #070915;
    color: #f8fafc;
    font-family: sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  
  .panel {
    border: 1px solid rgba(0, 240, 255, 0.3);
    background: rgba(13, 17, 35, 0.85);
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
    width: 280px;
  }
  
  h2 {
    font-size: 1.1rem;
    letter-spacing: 0.1em;
    color: #94a3b8;
    margin-bottom: 20px;
  }

  .reactor {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    margin-bottom: 20px;
  }

  .core {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ff007f;
    box-shadow: 0 0 20px #ff007f;
    animation: corePulse 2s infinite alternate;
  }

  @keyframes corePulse {
    from { transform: scale(0.9); box-shadow: 0 0 15px #ff007f; }
    to { transform: scale(1.1); box-shadow: 0 0 30px #ff007f; }
  }

  h3 {
    font-size: 0.9rem;
    color: #00f0ff;
    text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
    margin-bottom: 20px;
  }

  .btn-warp {
    background: transparent;
    border: 1px solid #00f0ff;
    padding: 10px 20px;
    color: #00f0ff;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
    transition: 0.3s;
  }

  .btn-warp:hover {
    background: #00f0ff;
    color: #070915;
    box-shadow: 0 0 20px #00f0ff;
  }
</style>
`,
    javascript: `// Space Velocity Physics Simulator
let baseSpeed = 120;
let turboBoost = 35;
let frictionCoefficient = 0.85;

// Formula execution
let vectorVelocity = (baseSpeed + turboBoost) * frictionCoefficient;

console.log("Base Speed Limit: " + baseSpeed);
console.log("Turbo Boost active: " + turboBoost);
console.log("Calculated Sector Velocity: " + vectorVelocity);

// Conditional operations check
if (vectorVelocity > 100) {
  console.log("✓ Warning: Speed barrier crossed!");
}
`,
    python: `# Scanning sectors loop sequence
sectors = ["alpha_nebula", "gamma_blackhole"]
sectors.append("neutron_pulse")

print("Initiating sector scan sequence...")
print(sectors)

# Pulse levels
for count in range(3):
    print("Pulse signal emitted at cycle: " + str(count))
`
  };

  // Custom Console logger
  function logConsole(message, type = "info") {
    const line = document.createElement("div");
    line.className = "console-line";
    if (type === "error") {
      line.innerHTML = `<span class="console-prefix" style="color:var(--accent-pink)">[ERROR]</span> <span class="console-error">${message}</span>`;
    } else if (type === "success") {
      line.innerHTML = `<span class="console-prefix" style="color:var(--accent-green)">[SYSTEM]</span> <span style="color:var(--accent-green)">${message}</span>`;
    } else {
      line.innerHTML = `<span class="console-prefix">></span> <span>${message}</span>`;
    }
    consoleFeed.appendChild(line);
    consoleFeed.scrollTop = consoleFeed.scrollHeight;
  }

  function clearConsole() {
    consoleFeed.innerHTML = "";
  }

  // Switch Active language views
  window.switchLanguage = function(lang) {
    currentLang = lang;
    
    // Clear tabs
    tabHTML.className = "sandbox-tab";
    tabJS.className = "sandbox-tab";
    tabPY.className = "sandbox-tab";

    // Clear stages
    stageHTML.style.display = "none";
    stageVars.style.display = "none";
    stageAI.style.display = "none";

    clearConsole();

    if (lang === "htmlcss") {
      tabHTML.className = "sandbox-tab active-pink";
      stageHTML.style.display = "flex";
      editor.value = TEMPLATES.htmlcss;
      logConsole("Switched to HTML/CSS mode. visual rendering sandbox active.");
      compileSandbox();
    } else if (lang === "javascript") {
      tabJS.className = "sandbox-tab active-cyan";
      stageVars.style.display = "flex";
      editor.value = TEMPLATES.javascript;
      logConsole("Switched to JavaScript mode. variables tracer grid active.");
      compileSandbox();
    } else if (lang === "python") {
      tabPY.className = "sandbox-tab active-green";
      stageVars.style.display = "flex";
      editor.value = TEMPLATES.python;
      logConsole("Switched to Python mode. logic console tracer active.");
      compileSandbox();
    }
  };

  // Extract variables dynamically from JS code
  function parseVariablesJS(code) {
    let variables = {};
    
    // Simple parsing matches let, const, var declarations and assignments
    const lines = code.split("\n");
    lines.forEach(line => {
      // match let/const/var x = val;
      const declMatch = /^\s*(let|const|var)\s+(\w+)\s*=\s*([^;]+)/.exec(line);
      if (declMatch) {
        const name = declMatch[2];
        const rawVal = declMatch[3].trim();
        
        try {
          // evaluate raw value safely
          const val = new Function(`return ${rawVal}`)();
          variables[name] = { val, type: typeof val };
        } catch(e) {
          variables[name] = { val: rawVal, type: "expression" };
        }
        return;
      }

      // match re-assignments: x = val;
      const assignMatch = /^\s*(\w+)\s*=\s*([^;]+)/.exec(line);
      if (assignMatch) {
        const name = assignMatch[1];
        const rawVal = assignMatch[2].trim();
        
        if (variables[name] || window[name] !== undefined) {
          try {
            const val = new Function(`return ${rawVal}`)();
            variables[name] = { val, type: typeof val };
          } catch(e) {
            variables[name] = { val: rawVal, type: "expression" };
          }
        }
      }
    });

    return variables;
  }

  // Extract variables from Python-like simulation
  function parseVariablesPython(code) {
    let variables = {};
    const lines = code.split("\n");
    
    lines.forEach(line => {
      // x = val
      const match = /^\s*(\w+)\s*=\s*([^#\n]+)/.exec(line);
      if (match) {
        const name = match[1];
        const rawVal = match[2].trim();
        
        if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
          // Mock parse list
          const items = rawVal.slice(1, -1).split(",").map(i => i.trim().replace(/['"]/g, ""));
          variables[name] = { val: `[${items.join(", ")}]`, type: "list" };
        } else if (!isNaN(rawVal)) {
          variables[name] = { val: Number(rawVal), type: "int" };
        } else {
          variables[name] = { val: rawVal, type: "str" };
        }
      }
    });

    return variables;
  }

  // Draw Variable Tracers inside Sandbox Pane
  function renderSandboxVars(variables) {
    memoryStage.innerHTML = "";
    
    const keys = Object.keys(variables);
    if (keys.length === 0) {
      memoryStage.innerHTML = `
        <div style="color:var(--text-muted); text-align:center;">
          ⚡<br>No active numerical variables detected in your script scope yet.
        </div>
      `;
      return;
    }

    const grid = document.createElement("div");
    grid.style.width = "100%";
    grid.style.maxWidth = "360px";

    keys.forEach(varName => {
      const item = variables[varName];
      const box = document.createElement("div");
      box.className = "sandbox-variable-box";
      box.innerHTML = `
        <div>
          <span class="sandbox-variable-name">${varName}</span>
          <span style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; margin-left:8px;">${item.type}</span>
        </div>
        <span class="sandbox-variable-val">${JSON.stringify(item.val)}</span>
      `;
      grid.appendChild(box);
    });

    memoryStage.appendChild(grid);
  }

  // Compile and Sandbox Execute Code
  function compileSandbox() {
    const code = editor.value;
    clearConsole();
    logConsole("Initializing sandboxed compiler...", "success");

    // Unlock sandbox voyager badge on first sandbox compilation
    if (State.data.badges && !State.data.badges.includes("sandbox_pro")) {
      State.unlockBadge("sandbox_pro");
    }

    if (currentLang === "htmlcss") {
      // Standard visual iframe compiler
      try {
        iframe.srcdoc = code;
        logConsole("Build successful! visual panels rendered inside browser engine.");
      } catch (err) {
        logConsole(err.message, "error");
      }
    } 
    
    else if (currentLang === "javascript") {
      // Safe execution container
      try {
        // Intercept standard browser console logs
        let outputs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          outputs.push(args.join(" "));
        };

        // Run
        const sandbox = new Function(code);
        sandbox();

        // Restore original
        console.log = originalLog;

        // Print to Sandbox Console
        outputs.forEach(msg => logConsole(msg));

        // Parse variables
        const variables = parseVariablesJS(code);
        renderSandboxVars(variables);
        
        logConsole("Build successful! script scope variables cataloged.", "success");
      } catch (err) {
        logConsole(err.message, "error");
      }
    } 
    
    else if (currentLang === "python") {
      // Simple custom visual simulation for Python
      try {
        const lines = code.split("\n");
        let listVal = ["alpha_nebula", "gamma_blackhole"];
        
        lines.forEach(line => {
          if (line.includes("print(")) {
            if (line.includes("sectors")) {
              if (line.includes("append")) {
                // mock list
              } else {
                logConsole(`['alpha_nebula', 'gamma_blackhole'${line.includes("append") || code.includes("append") ? ", 'neutron_pulse'" : ""}]`);
              }
            } else if (line.includes("Initiating")) {
              logConsole("Initiating sector scan sequence...");
            } else if (line.includes("Pulse")) {
              logConsole("Pulse signal emitted at cycle: 0");
              logConsole("Pulse signal emitted at cycle: 1");
              logConsole("Pulse signal emitted at cycle: 2");
            } else {
              // match printing variables
              const varMatch = /print\(\s*(\w+)\s*\)/.exec(line);
              if (varMatch && varMatch[1] !== "sectors") {
                const varName = varMatch[1];
                const variables = parseVariablesPython(code);
                if (variables[varName]) {
                  logConsole(variables[varName].val);
                }
              }
            }
          }
        });

        const variables = parseVariablesPython(code);
        renderSandboxVars(variables);
        
        logConsole("Python simulated successfully.", "success");
      } catch (err) {
        logConsole(err.message, "error");
      }
    }
  }

  // Load Preset Templates dynamically
  templateSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "html_shield") {
      switchLanguage("htmlcss");
    } else if (val === "js_physics") {
      switchLanguage("javascript");
    } else if (val === "py_fibonacci") {
      switchLanguage("python");
    }
  });

  btnRun.addEventListener("click", compileSandbox);

  btnAI.addEventListener("click", () => {
    // Hide standard previews, reveal AI feedback pane!
    stageHTML.style.display = "none";
    stageVars.style.display = "none";
    stageAI.style.display = "block";

    logConsole("Running static AI review compile analysis...", "success");

    // Generate feedback payload matching Prompt 1 & Prompt 2 complexity rules
    const code = editor.value;
    const feedback = AIFeedbackEngine.generateFeedback(code, "sandbox-lab", currentLang, true);
    const chart = AIFeedbackEngine.generateAsciiChart(feedback.complexity.currentTime);

    aiStage.innerHTML = AIFeedbackEngine.renderFeedbackHTML(feedback, chart);
    logConsole("AI Analysis review completed successfully.");
  });

  // Initialize
  switchLanguage("htmlcss");
});
