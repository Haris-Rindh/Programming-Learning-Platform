// CosmicCode Lecture Player Controller Engine

document.addEventListener("DOMContentLoaded", () => {
  // Extract URL parameters
  const params = new URLSearchParams(window.location.search);
  const trackId = params.get("track");
  const lessonId = params.get("lesson");

  if (!trackId || !lessonId || !LECTURES_DATA[trackId] || !LECTURES_DATA[trackId].lessons[lessonId]) {
    console.error("Invalid path coordinates. Returning to hub.");
    window.location.href = "dashboard.html";
    return;
  }

  // Bind Curriculum coordinates
  const trackData = LECTURES_DATA[trackId];
  const lessonData = trackData.lessons[lessonId];
  const steps = lessonData.steps;
  
  let currentStepIndex = 0;
  let typingTimer = null;
  let codeTypingTimer = null;
  
  // UI Bindings
  const trackCrumbs = document.getElementById("track-crumbs");
  const lessonHeaderTitle = document.getElementById("lesson-header-title");
  const stepTracker = document.getElementById("step-tracker");
  const speechBubble = document.getElementById("speech-bubble");
  const checkpointOverlay = document.getElementById("checkpoint-overlay");
  const checkpointDesc = document.getElementById("checkpoint-desc");
  const checkpointHint = document.getElementById("checkpoint-hint");
  const editor = document.getElementById("editor");
  const consoleFeed = document.getElementById("console-feed");
  const visualizerStage = document.getElementById("visualizer-stage");
  const visualizerHeader = document.getElementById("visualizer-header");
  const visualizerPlaceholder = document.getElementById("visualizer-placeholder");

  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");
  const btnVerify = document.getElementById("btn-verify");
  const btnRunManual = document.getElementById("btn-run-manual");

  // Initial State Setup
  trackCrumbs.textContent = `${trackData.title.toUpperCase()} / ${lessonData.title.toUpperCase()}`;
  lessonHeaderTitle.textContent = lessonData.title;

  // Initialize Mascot
  Mascot.render("lecture-mascot", "idle");

  // Keep track of accumulated memory variables
  let memoryStore = {};

  // Custom Console Logger Helper
  function logConsole(message, type = "info") {
    const line = document.createElement("div");
    line.className = "console-line";
    
    if (type === "error") {
      line.innerHTML = `<span class="console-prefix" style="color: var(--accent-pink)">[ERROR]</span> <span class="console-error">${message}</span>`;
    } else if (type === "success") {
      line.innerHTML = `<span class="console-prefix" style="color: var(--accent-green)">[SYSTEM]</span> <span style="color: var(--accent-green)">${message}</span>`;
    } else {
      line.innerHTML = `<span class="console-prefix">></span> <span>${message}</span>`;
    }
    
    consoleFeed.appendChild(line);
    consoleFeed.scrollTop = consoleFeed.scrollHeight;
  }

  function clearConsole() {
    consoleFeed.innerHTML = "";
  }

  // Typewriter effect for Mascot dialogue
  function typeSpeech(text, callback) {
    if (typingTimer) clearInterval(typingTimer);
    speechBubble.textContent = "";
    let i = 0;
    
    typingTimer = setInterval(() => {
      if (i < text.length) {
        speechBubble.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typingTimer);
        typingTimer = null;
        if (callback) callback();
      }
    }, 15);
  }

  // Animate Code Typing into Editor (Lectures Playback)
  function animateCodeTyping(codeToType, callback) {
    editor.value = "";
    editor.readOnly = true;
    let i = 0;

    if (codeTypingTimer) clearInterval(codeTypingTimer);

    codeTypingTimer = setInterval(() => {
      if (i < codeToType.length) {
        editor.value += codeToType.charAt(i);
        i++;
      } else {
        clearInterval(codeTypingTimer);
        codeTypingTimer = null;
        if (callback) callback();
      }
    }, 20);
  }

  // Render Step Content & Directives
  function renderStep() {
    // Reset timers
    if (typingTimer) clearInterval(typingTimer);
    if (codeTypingTimer) clearInterval(codeTypingTimer);

    // Get step configurations
    const step = steps[currentStepIndex];
    
    // Adjust Step counter
    stepTracker.textContent = `Step ${currentStepIndex + 1} / ${steps.length}`;

    // Adjust Mascot Mood
    let mood = "idle";
    if (step.complete) mood = "happy";
    else if (step.input) mood = "thinking";
    else if (step.typing) mood = "explaining";
    Mascot.setMood("lecture-mascot", mood);

    // Setup Navigation Controls
    btnBack.disabled = (currentStepIndex === 0);
    
    if (step.input) {
      btnNext.style.display = "none";
      btnVerify.style.display = "inline-flex";
      btnRunManual.style.display = "inline-flex";
      checkpointOverlay.style.display = "block";
      checkpointDesc.textContent = step.checkpoint.hint || "Complete the coding objective.";
      checkpointHint.textContent = `Hint: ${step.checkpoint.hint}`;
      
      editor.readOnly = false;
      editor.placeholder = "// Enter your code solution here...";
      editor.focus();
    } else {
      btnNext.style.display = "inline-flex";
      btnVerify.style.display = "none";
      btnRunManual.style.display = "none";
      checkpointOverlay.style.display = "none";
      
      editor.readOnly = true;
    }

    // Trigger Speech dialogue typewriter
    typeSpeech(step.text, () => {
      // Trigger automatic typing if configured
      if (step.typing) {
        animateCodeTyping(step.typing, () => {
          logConsole("Autoplay typed successfully.", "success");
          triggerTraceAction(step.trace);
        });
      }
    });

    // Handle trace action of step if NOT typing (typing triggers it after completion)
    if (!step.typing && step.trace) {
      triggerTraceAction(step.trace);
    }
  }

  // Execute Trace Visualizer Actions
  function triggerTraceAction(trace) {
    if (!trace) return;
    
    // JS/Python Memory variable visualizer
    if (trackId === "javascript" || trackId === "python") {
      visualizerHeader.textContent = "Visual Memory Tracer";

      if (trace.action === "create" || trace.action === "update") {
        if (trace.action === "create") {
          memoryStore[trace.name] = { val: trace.value, type: trace.type };
        } else {
          if (memoryStore[trace.name]) {
            memoryStore[trace.name].val = trace.value;
          }
        }
        
        renderMemoryGrid();
        logConsole(`Variable [${trace.name}] stored in Memory slot with value: ${trace.value}`);
      }

      else if (trace.action === "create_func") {
        visualizerStage.innerHTML = `
          <div class="memory-box active" style="width: 220px; border-style: solid; border-color: var(--accent-cyan);">
            <div class="memory-type">Function Definition</div>
            <div class="memory-label" style="font-size: 1.1rem; color: #fff;">${trace.name}()</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">Parameters: ${trace.params.join(", ")}</div>
          </div>
        `;
        logConsole(`Function block [${trace.name}] declared and cached.`);
      }

      else if (trace.action === "call_func") {
        visualizerStage.innerHTML = `
          <div class="stack-list">
            <div class="stack-frame">Global Context Frame</div>
            <div class="stack-frame active" style="border-color: var(--accent-green); color: var(--accent-green); background: rgba(57,255,20,0.05);">
              ${trace.name}(power: ${trace.arg}) &rarr; returns ${trace.returns}
            </div>
          </div>
          <div class="memory-grid" style="margin-top: 20px;">
            <div class="memory-box active-green">
              <div class="memory-type">${typeof trace.returns}</div>
              <div class="memory-label">${trace.varName}</div>
              <div class="memory-value">${trace.returns}</div>
            </div>
          </div>
        `;
        logConsole(`Call Stack generated frame for boost(). Returned: ${trace.returns}`);
      }

      else if (trace.action === "create_list") {
        memoryStore[trace.name] = { val: trace.items, type: "list" };
        renderMemoryList(trace.name, trace.items);
      }

      else if (trace.action === "append_list") {
        if (memoryStore[trace.name]) {
          memoryStore[trace.name].val.push(trace.item);
        } else {
          memoryStore[trace.name] = { val: [trace.item], type: "list" };
        }
        renderMemoryList(trace.name, memoryStore[trace.name].val, trace.item);
      }

      else if (trace.action === "dom_select") {
        renderDOMSimulator();
        logConsole("document.getElementById('shield') linked to compiler.");
      }

      else if (trace.action === "dom_style") {
        renderDOMSimulator(trace.bg, "40px");
        logConsole("DOM Shield properties modified: backgroundColor = cyan.");
      }

      else if (trace.action === "loop") {
        let loopOutputs = trace.outputs;
        let count = 0;
        
        visualizerStage.innerHTML = `
          <div style="text-align: center; font-family: var(--font-mono); font-size: 0.9rem;">
            <div style="color: var(--accent-green); margin-bottom: 8px;">Scanner Loop Active</div>
            <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; width: 180px;">
              for i in range(${trace.count}):
            </div>
            <div id="loop-pointer" style="font-size: 1.5rem; margin: 10px 0; color: var(--accent-cyan);">⤿ index: 0</div>
          </div>
        `;

        const loopInterval = setInterval(() => {
          if (count < trace.count) {
            document.getElementById("loop-pointer").textContent = `⤿ index: ${count}`;
            logConsole(loopOutputs[count]);
            count++;
          } else {
            clearInterval(loopInterval);
          }
        }, 800);
      }
    }

    // HTML/CSS visualizer rendering
    if (trackId === "htmlcss") {
      visualizerHeader.textContent = "Live DOM Render Preview";
      
      if (trace.action === "dom_render") {
        visualizerStage.innerHTML = `
          <div class="dom-preview-container">
            <div class="reactor-visual-panel" id="sim-reactor" style="width: 140px; height: 100px;">
              <div class="core-visual-panel" id="sim-core" style="width: 10px; height: 10px; border-radius: 4px; margin: 8px;"></div>
            </div>
          </div>
        `;
        logConsole("HTML structure container loaded into sandbox iframe.");
      }

      else if (trace.action === "dom_add") {
        const textLabel = document.createElement("div");
        textLabel.id = "sim-header";
        textLabel.style.cssText = "font-family: var(--font-display); font-size: 0.75rem; margin-top: 10px; font-weight: bold; color: var(--text-muted);";
        textLabel.textContent = trace.text;
        visualizerStage.querySelector(".dom-preview-container").appendChild(textLabel);
        logConsole("Header element &lt;h3&gt; appended inside structure.");
      }

      else if (trace.action === "css_style") {
        const core = document.getElementById("sim-core");
        if (core) {
          core.style.width = "40px";
          core.style.height = "40px";
          core.style.borderRadius = "50%";
          core.style.backgroundColor = "#ff007f";
        }
        logConsole("Applied stylesheet rules for .core selection.");
      }

      else if (trace.action === "css_glow") {
        const core = document.getElementById("sim-core");
        if (core) {
          core.style.boxShadow = "0 0 20px #ff007f";
        }
        logConsole("Added box-shadow filtering to visual elements.");
      }

      else if (trace.action === "css_flex") {
        const reactor = document.getElementById("sim-reactor");
        if (reactor) {
          reactor.style.display = "flex";
        }
        logConsole(".reactor flexbox display set.");
      }

      else if (trace.action === "css_center") {
        const reactor = document.getElementById("sim-reactor");
        if (reactor) {
          reactor.style.justifyContent = "center";
          reactor.style.alignItems = "center";
        }
        logConsole(".reactor elements center-aligned along axes.");
      }
    }
  }

  // Draw standard numerical variable boxes
  function renderMemoryGrid() {
    visualizerStage.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "memory-grid";
    
    Object.keys(memoryStore).forEach(varName => {
      const variable = memoryStore[varName];
      const box = document.createElement("div");
      box.className = "memory-box active";
      box.innerHTML = `
        <div class="memory-type">${variable.type}</div>
        <div class="memory-label">${varName}</div>
        <div class="memory-value">${variable.val}</div>
      `;
      grid.appendChild(box);
    });

    visualizerStage.appendChild(grid);
  }

  // Draw list index boxes
  function renderMemoryList(listName, items, highlightedItem = null) {
    visualizerStage.innerHTML = "";
    
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;";
    
    const title = document.createElement("div");
    title.style.cssText = "font-family: var(--font-display); font-size: 0.85rem; font-weight:bold; color: var(--text-secondary);";
    title.textContent = `List: ${listName}`;
    wrapper.appendChild(title);
    
    const container = document.createElement("div");
    container.style.cssText = "display: flex; gap: 8px; flex-wrap: wrap;";
    
    items.forEach((item, index) => {
      const box = document.createElement("div");
      box.className = `memory-box active-green`;
      if (item === highlightedItem) {
        box.style.borderStyle = "solid";
        box.style.borderColor = "var(--accent-green)";
        box.style.boxShadow = "0 0 15px var(--accent-green)";
      }
      box.style.padding = "8px 12px";
      box.innerHTML = `
        <div class="memory-type">idx: ${index}</div>
        <div class="memory-value" style="font-size:1.05rem;">"${item}"</div>
      `;
      container.appendChild(box);
    });

    wrapper.appendChild(container);
    visualizerStage.appendChild(wrapper);
  }

  // Draw spaceship deflector visual
  function renderDOMSimulator(shieldBg = "transparent", shieldHeight = "30px") {
    visualizerStage.innerHTML = `
      <div class="dom-preview-container">
        <div class="rocket-ship">🚀</div>
        <div class="deflector-shield" id="shield" style="background: ${shieldBg}; height: ${shieldHeight}; border-color: ${shieldBg !== 'transparent' ? '#00f0ff' : 'rgba(255,255,255,0.2)'}; box-shadow: ${shieldBg !== 'transparent' ? '0 0 25px #00f0ff' : 'none'};"></div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 10px; font-family: var(--font-mono);">&lt;div id="shield"&gt;&lt;/div&gt;</div>
      </div>
    `;
  }

  // Answer Checkpoint Verification Engine
  function verifyCheckpoint() {
    const userCode = editor.value;
    const step = steps[currentStepIndex];
    const checkpoint = step.checkpoint;

    clearConsole();
    logConsole("Initializing validator compiler...", "success");

    try {
      if (checkpoint.type === "js_eval") {
        // Execute inside sandboxed dynamic function to check variables
        const sandboxFunc = new Function(`
          try {
            ${userCode}
            return (${checkpoint.validate});
          } catch(e) {
            return { error: e.message };
          }
        `);
        
        const result = sandboxFunc();
        
        if (result === true) {
          passedCheckpoint();
        } else {
          failedCheckpoint(result.error || "Checkpoint conditions not met. Verify variables naming and values.");
        }
      }

      else if (checkpoint.type === "dom_check") {
        // Render element to check style heights
        renderDOMSimulator();
        const testArea = document.createElement("div");
        testArea.style.display = "none";
        document.body.appendChild(testArea);
        
        try {
          // Temporarily mock DOM selection
          const oldGet = document.getElementById;
          const shieldMock = document.createElement("div");
          shieldMock.id = "shield";
          testArea.appendChild(shieldMock);
          
          document.getElementById = (id) => {
            if (id === "shield") return shieldMock;
            return oldGet.call(document, id);
          };

          // Run user JS
          const sandbox = new Function(userCode);
          sandbox();

          // Restore normal DOM selection
          document.getElementById = oldGet;
          
          // Verify
          const success = shieldMock.style.height === "80px";
          testArea.remove();

          if (success) {
            renderDOMSimulator("#00f0ff", "80px");
            passedCheckpoint();
          } else {
            failedCheckpoint("Deflector shield height is not 80px! Adjust style height.");
          }
        } catch (err) {
          testArea.remove();
          failedCheckpoint(err.message);
        }
      }

      else if (checkpoint.type === "py_eval") {
        // Perform regex and mock execution checks on code
        let valid = false;
        
        if (lessonId === "py_variables") {
          const hasVar = /laser_charge\s*=\s*100/.test(userCode);
          const hasPrint = /print\(\s*laser_charge\s*\)/.test(userCode);
          if (hasVar && hasPrint) {
            valid = true;
            logConsole("laser_charge = 100", "success");
            logConsole("100");
          }
        } 
        
        else if (lessonId === "py_loops") {
          const hasLoop = /for\s+\w+\s+in\s+range\(\s*4\s*\)\s*:/.test(userCode);
          const hasPrint = /print\(\s*['"]Scanner pulse['"]\s*\)/.test(userCode);
          if (hasLoop && hasPrint) {
            valid = true;
            logConsole("Scanner pulse");
            logConsole("Scanner pulse");
            logConsole("Scanner pulse");
            logConsole("Scanner pulse");
          }
        } 
        
        else if (lessonId === "py_lists") {
          const hasAppend = /cargo\.append\(\s*['"]rations['"]\s*\)/.test(userCode);
          const hasPrint = /print\(\s*cargo\s*\)/.test(userCode);
          if (hasAppend && hasPrint) {
            valid = true;
            logConsole("['shields', 'fuel', 'blasters', 'rations']");
          }
        }

        if (valid) {
          passedCheckpoint();
        } else {
          failedCheckpoint("Code syntax validation failed. Review spelling, parentheses, or spacing structures.");
        }
      }

      else if (checkpoint.type === "html_check") {
        // Parse input structure as HTML nodes
        const parser = new DOMParser();
        const doc = parser.parseFromString(userCode, "text/html");
        const hasGlow = doc.querySelector("div.core span.glow-dot") !== null;
        
        if (hasGlow) {
          visualizerStage.innerHTML = `
            <div class="dom-preview-container">
              <div class="reactor-visual-panel" id="sim-reactor" style="width: 140px; height: 100px;">
                <div class="core-visual-panel" id="sim-core" style="width: 10px; height: 10px; border-radius: 4px; margin: 8px; display:flex; justify-content:center; align-items:center;">
                  <span style="display:block; width:4px; height:4px; border-radius:50%; background:#fff; box-shadow:0 0 10px #fff;"></span>
                </div>
              </div>
              <div style="font-family:var(--font-display); font-size:0.75rem; font-weight:bold; margin-top:10px;">REACTOR ACTIVE</div>
            </div>
          `;
          passedCheckpoint();
        } else {
          failedCheckpoint("HTML structure missing a &lt;span class='glow-dot'&gt; inside the core div block.");
        }
      }

      else if (checkpoint.type === "css_check") {
        // Clean and test class structures
        let success = false;
        
        if (lessonId === "css_visual") {
          // Check for .reactor border styled rule
          success = /\.reactor\s*\{\s*[^}]*border\s*:\s*2px\s+solid\s+#00f0ff/.test(userCode.replace(/\s+/g, " "));
          if (success) {
            visualizerStage.innerHTML = `
              <div class="dom-preview-container">
                <div class="reactor-visual-panel" id="sim-reactor" style="width: 140px; height: 100px; border: 2px solid #00f0ff; box-shadow: 0 0 15px rgba(0,240,255,0.4);">
                  <div class="core-visual-panel" id="sim-core" style="width: 40px; height: 40px; border-radius: 50%; background-color:#ff007f; box-shadow:0 0 20px #ff007f; margin:8px;"></div>
                </div>
              </div>
            `;
          }
        } 
        
        else if (lessonId === "css_reactor") {
          success = /\.reactor\s*\{\s*[^}]*height\s*:\s*120px/.test(userCode.replace(/\s+/g, " "));
          if (success) {
            visualizerStage.innerHTML = `
              <div class="dom-preview-container">
                <div class="reactor-visual-panel" id="sim-reactor" style="width: 140px; height: 120px; border: 2px solid #00f0ff; display:flex; justify-content:center; align-items:center; box-shadow: 0 0 15px rgba(0,240,255,0.3);">
                  <div class="core-visual-panel" id="sim-core" style="width: 40px; height: 40px; border-radius: 50%; background-color:#ff007f; box-shadow:0 0 20px #ff007f;"></div>
                </div>
              </div>
            `;
          }
        }

        if (success) {
          passedCheckpoint();
        } else {
          failedCheckpoint("Target CSS rules not registered correctly. Inspect element name selections and brackets.");
        }
      }

    } catch (err) {
      failedCheckpoint(err.message);
    }
  }

  function passedCheckpoint() {
    logConsole("✓ Verification successful! Checkpoint cleared.", "success");
    Mascot.setMood("lecture-mascot", "happy");
    
    // Hide verify button, show normal Next flow button
    btnVerify.style.display = "none";
    btnRunManual.style.display = "none";
    btnNext.style.display = "inline-flex";
    btnNext.disabled = false;
  }

  function failedCheckpoint(errMsg) {
    logConsole(errMsg, "error");
    Mascot.setMood("lecture-mascot", "thinking");
  }

  // Handle Lesson Finished Transition
  function completeLesson() {
    Mascot.setMood("lecture-mascot", "happy");
    
    logConsole("ALL STEPS COMPLETED! Saving records...", "success");

    // Add state record
    const result = State.completeLesson(trackId, lessonId);

    speechBubble.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-green); margin-bottom: 8px;">🚀 Mission Accomplished!</div>
      You have successfully cleared all operational modules in this segment! Earned 100 XP points!
    `;

    setTimeout(() => {
      // Transition flight deck back to dashboard
      window.location.href = "dashboard.html";
    }, 4500);
  }

  // BUTTON INTERACTIVE LISTENERS
  btnBack.addEventListener("click", () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      renderStep();
    }
  });

  btnNext.addEventListener("click", () => {
    // Check if it was final step
    if (steps[currentStepIndex].complete) {
      completeLesson();
    } else {
      currentStepIndex++;
      renderStep();
    }
  });

  btnVerify.addEventListener("click", verifyCheckpoint);

  btnRunManual.addEventListener("click", () => {
    // Run simple console print outputs for debugging
    logConsole("Running scripts...");
    const code = editor.value;
    try {
      const sandbox = new Function(code);
      sandbox();
      logConsole("Done.");
    } catch (e) {
      logConsole(e.message, "error");
    }
  });

  // Launch initial step
  renderStep();
});
