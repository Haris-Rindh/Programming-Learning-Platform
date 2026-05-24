// CosmicCode Lecture Content Database

const LECTURES_DATA = {
  javascript: {
    title: "JavaScript Warp Core",
    icon: "⚡",
    color: "cyan",
    lessons: {
      js_variables: {
        title: "Mission 1: Cosmic Variables",
        difficulty: "Beginner",
        xp: 100,
        steps: [
          {
            text: "Welcome, cadet! I am Byte, your system navigation companion. Today, we are activating the JS Warp Core. To start, we need a container to store our speed limit. In JavaScript, we use 'let' to declare a variable. Let me write one for you!",
            typing: "let warpSpeed = 100;\n",
            trace: { action: "create", name: "warpSpeed", value: 100, type: "number" }
          },
          {
            text: "See that? A memory slot named 'warpSpeed' has been reserved in our warp core visualizer! We can update this variable whenever we want. Let's add 50 more units to the warp speed.",
            typing: "warpSpeed = warpSpeed + 50;\n",
            trace: { action: "update", name: "warpSpeed", value: 150 }
          },
          {
            text: "Excellent! The memory cell updated to 150 instantly. Now, it's your turn. I need you to create a variable called 'hyperDrive' and assign it a number value of 5. Edit the code in the panel and click Run!",
            input: true,
            checkpoint: {
              type: "js_eval",
              validate: "typeof hyperDrive !== 'undefined' && hyperDrive === 5",
              hint: "Write: let hyperDrive = 5;"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "Phenomenal coding! The hyperDrive cell is locked in. Our ship is ready for speed modifications. Let's wrap up this lesson and proceed to the dashboard!",
            complete: true
          }
        ]
      },
      js_functions: {
        title: "Mission 2: Thruster Functions",
        difficulty: "Intermediate",
        xp: 100,
        steps: [
          {
            text: "Great to have you back! We need to modularize our ship thruster activations. Instead of writing code repeatedly, we create a function. Let's build a function called 'boost' that doubles our power.",
            typing: "function boost(power) {\n  return power * 2;\n}\n",
            trace: { action: "create_func", name: "boost", params: ["power"] }
          },
          {
            text: "A new utility block named 'boost' is defined! Now, let's execute (or call) the function and store the result in a variable named 'finalThrust'.",
            typing: "let finalThrust = boost(40);\n",
            trace: { action: "call_func", name: "boost", arg: 40, returns: 80, varName: "finalThrust" }
          },
          {
            text: "Wow! Look at the call stack: the function received 40, multiplied it, and returned 80! Now, write your own function named 'superCharge' that takes one parameter and returns it multiplied by 3. Make sure to call it as well! E.g. let result = superCharge(10);",
            input: true,
            checkpoint: {
              type: "js_eval",
              validate: "typeof superCharge === 'function' && superCharge(10) === 30",
              hint: "Write: function superCharge(x) { return x * 3; }"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "Incredible! You just designed a high-tech energy booster using reusable functional blocks!",
            complete: true
          }
        ]
      },
      js_dom: {
        title: "Mission 3: DOM Deflector Shield",
        difficulty: "Advanced",
        xp: 100,
        steps: [
          {
            text: "We are under incoming asteroid fire! We need to activate the deflector shield using JavaScript DOM selectors. First, let's select our deflector node and save it in a variable.",
            typing: "let shield = document.getElementById('shield');\n",
            trace: { action: "dom_select", selector: "shield" }
          },
          {
            text: "Perfect, we've linked JavaScript directly to the HTML container. Now, let's change the background color of the shield to glowing cyan using the 'style' property.",
            typing: "shield.style.backgroundColor = '#00f0ff';\n",
            trace: { action: "dom_style", selector: "shield", bg: "#00f0ff", shadow: "0 0 25px #00f0ff" }
          },
          {
            text: "Wow, shields are glowing neon cyan! Now, modify the shield style so that its height is set to '80px' so we are completely covered. Edit the code and set: shield.style.height = '80px';",
            input: true,
            checkpoint: {
              type: "dom_check",
              validate: "document.getElementById('shield').style.height === '80px'",
              hint: "Write: shield.style.height = '80px';"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "Asteroid deflected successfully! Deflector shield operates at maximum efficiency. You have fully completed the JavaScript path! Badge unlocked!",
            complete: true
          }
        ]
      }
    }
  },

  python: {
    title: "Python Logic Serpent",
    icon: "🐍",
    color: "green",
    lessons: {
      py_variables: {
        title: "Mission 1: Serpent Variables",
        difficulty: "Beginner",
        xp: 100,
        steps: [
          {
            text: "Welcome to the Python module, explorer! Python is incredibly readable. No semicolons or complex headers. Let's create a energy level variable. I will write it for you.",
            typing: "energy = 85\n",
            trace: { action: "create", name: "energy", value: 85, type: "int" }
          },
          {
            text: "In Python, displaying content to the cockpit screen is as simple as using the 'print' statement. Let's print out our energy variable.",
            typing: "print(energy)\n",
            trace: { action: "print", name: "energy", output: "85" }
          },
          {
            text: "Perfect! Now it's your turn. Create a Python variable named 'laser_charge' and set it to 100. Then use 'print(laser_charge)' on the second line.",
            input: true,
            checkpoint: {
              type: "py_eval",
              validate: "var:laser_charge == 100 && print:100",
              hint: "Write:\nlaser_charge = 100\nprint(laser_charge)"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "You are a natural! The terminal output confirms 100. Let's level up to loop flow!",
            complete: true
          }
        ]
      },
      py_loops: {
        title: "Mission 2: Orbit Loops",
        difficulty: "Intermediate",
        xp: 100,
        steps: [
          {
            text: "Sometimes, we need a task to loop multiple times, like pulsing the scanner. In Python, we use the 'for' loop combined with 'range()'. Let's write a loop that counts to 3.",
            typing: "for i in range(3):\n    print('Orbit ' + str(i))\n",
            trace: { action: "loop", count: 3, outputs: ["Orbit 0", "Orbit 1", "Orbit 2"] }
          },
          {
            text: "Watch the execution line jumps! In Python, indentation (4 spaces) defines what code runs inside the loop. Now, write a Python loop that runs 4 times (range of 4) and prints out 'Scanner pulse'. Make sure to indent correctly!",
            input: true,
            checkpoint: {
              type: "py_eval",
              validate: "loop:4 && print:Scanner pulse",
              hint: "Write:\nfor i in range(4):\n    print('Scanner pulse')"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "Magnificent! The console printed out the pulse four times under perfect indentation blocks!",
            complete: true
          }
        ]
      },
      py_lists: {
        title: "Mission 3: Cargo Arrays",
        difficulty: "Advanced",
        xp: 100,
        steps: [
          {
            text: "We have multiple cargo boxes to register. Instead of single variables, we store them in a Python list inside brackets! Let's declare our cargo list.",
            typing: "cargo = ['shields', 'fuel']\n",
            trace: { action: "create_list", name: "cargo", items: ["shields", "fuel"] }
          },
          {
            text: "Brilliant. Let's add a new item, 'blasters', to our list dynamically using Python's list append helper.",
            typing: "cargo.append('blasters')\n",
            trace: { action: "append_list", name: "cargo", item: "blasters" }
          },
          {
            text: "Now, I need you to append the item 'rations' to the cargo list, then print out the entire list on the next line. Click Run when you are ready!",
            input: true,
            checkpoint: {
              type: "py_eval",
              validate: "list_has:cargo:rations && print:rations",
              hint: "Write:\ncargo.append('rations')\nprint(cargo)"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "System cargo registered perfectly! Python module successfully completed. Badge unlocked!",
            complete: true
          }
        ]
      }
    }
  },

  htmlcss: {
    title: "HTML & CSS Visual Reactor",
    icon: "🎨",
    color: "pink",
    lessons: {
      html_structure: {
        title: "Mission 1: Fusion Architecture",
        difficulty: "Beginner",
        xp: 100,
        steps: [
          {
            text: "Welcome to HTML and CSS! HTML forms the skeletal design of our dashboard. Let's build a glowing core reactor shell using a div element with a class.",
            typing: "<div class=\"reactor\">\n  <div class=\"core\"></div>\n</div>\n",
            trace: { action: "dom_render", html: "<div class='reactor' id='shield'><div class='core' id='reactor-core'></div></div>" }
          },
          {
            text: "Notice that standard HTML is empty by default because we have no styles. Let's add an active element indicating ship thrust: an h3 header saying 'REACTOR ACTIVE'.",
            typing: "<h3>REACTOR ACTIVE</h3>\n",
            trace: { action: "dom_add", element: "h3", text: "REACTOR ACTIVE" }
          },
          {
            text: "Now, add an HTML span element inside the reactor core with a class 'glow-dot'. Write: <span class=\"glow-dot\"></span> inside the core div.",
            input: true,
            checkpoint: {
              type: "html_check",
              validate: "has_selector:div.core span.glow-dot",
              hint: "Write inside the core div:\n<span class=\"glow-dot\"></span>"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "Aesthetic foundation set! Our markup skeleton is locked in. Let's style it next!",
            complete: true
          }
        ]
      },
      css_visual: {
        title: "Mission 2: Glowing Shell CSS",
        difficulty: "Intermediate",
        xp: 100,
        steps: [
          {
            text: "Now, let's paint our structure with CSS. We will select the reactor-core class and give it sizing and a neon pink background color.",
            typing: ".core {\n  width: 60px;\n  height: 60px;\n  border-radius: 50%;\n  background-color: #ff007f;\n}\n",
            trace: { action: "css_style", selector: "core", props: { width: "60px", height: "60px", "border-radius": "50%", "background-color": "#ff007f" } }
          },
          {
            text: "Splendid! The circular core is alive. Let's add our cosmic glow using CSS box-shadow.",
            typing: ".core {\n  box-shadow: 0 0 25px #ff007f;\n}\n",
            trace: { action: "css_glow", selector: "core", glow: "0 0 25px #ff007f" }
          },
          {
            text: "Amazing, the reactor core is glowing beautifully! Now, let's style the wrapper '.reactor' to have a border of '2px solid #00f0ff' (neon cyan) to create a visual containment ring. Add it in the editor!",
            input: true,
            checkpoint: {
              type: "css_check",
              validate: "css_has:.reactor:border",
              hint: "Write in the editor:\n.reactor {\n  border: 2px solid #00f0ff;\n}"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "Containment ring activated! The cosmic energy is fully secured in glowing style!",
            complete: true
          }
        ]
      },
      css_reactor: {
        title: "Mission 3: Core Convergence Alignment",
        difficulty: "Advanced",
        xp: 100,
        steps: [
          {
            text: "Our core is floating to the corner! We must center it inside the reactor shell. In modern CSS, we do this using the mighty Flexbox layout. Let's enable flex on the reactor wrapper.",
            typing: ".reactor {\n  display: flex;\n}\n",
            trace: { action: "css_flex", display: "flex" }
          },
          {
            text: "Perfect. Next, let's align our items along both axes using justify-content and align-items.",
            typing: "  justify-content: center;\n  align-items: center;\n",
            trace: { action: "css_center", justify: "center", align: "center" }
          },
          {
            text: "The core has snapped directly to the center! Now, let's give the reactor container a height of '120px' so the alignment handles vertical centering beautifully as well. Set: height: 120px; inside the .reactor class.",
            input: true,
            checkpoint: {
              type: "css_check",
              validate: "css_has:.reactor:height:120px",
              hint: "Write inside .reactor:\nheight: 120px;"
            },
            trace: { action: "checkpoint" }
          },
          {
            text: "Fusion Convergence Complete! HTML & CSS track finished. You have mastered layout sculpting. Badge unlocked!",
            complete: true
          }
        ]
      }
    }
  }
};

window.LECTURES_DATA = LECTURES_DATA;
