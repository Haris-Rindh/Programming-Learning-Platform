// CosmicCode Interactive Robot Mascot Engine ("Byte")

const MASCOT_MOODS = {
  idle: `
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="screen-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#00f0ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111428"/>
          <stop offset="100%" stop-color="#1e2242"/>
        </linearGradient>
      </defs>
      <style>
        .hover-body { animation: bodyFloat 3s ease-in-out infinite; }
        .blink-eyes { animation: eyeBlink 4s infinite; transform-origin: 100px 95px; }
        .hover-hand-l { animation: handFloatL 3s ease-in-out infinite; }
        .hover-hand-r { animation: handFloatR 3s ease-in-out infinite; }
        @keyframes bodyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes handFloatL {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(-2px, -8px); }
        }
        @keyframes handFloatR {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(2px, -8px); }
        }
        @keyframes eyeBlink {
          0%, 95%, 100% { transform: scaleY(1); }
          97% { transform: scaleY(0.1); }
        }
      </style>
      <g class="hover-body">
        <!-- Floating Ring shadow -->
        <ellipse cx="100" cy="180" rx="35" ry="6" fill="#000" opacity="0.3"/>
        
        <!-- Antenna -->
        <line x1="100" y1="50" x2="100" y2="30" stroke="#00f0ff" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="24" r="8" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)"/>
        
        <!-- Ears / Connectors -->
        <rect x="42" y="75" width="8" height="20" rx="4" fill="#3b4276"/>
        <rect x="150" y="75" width="8" height="20" rx="4" fill="#3b4276"/>
        
        <!-- Head -->
        <rect x="46" y="50" width="108" height="76" rx="24" fill="url(#body-grad)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="#05070f"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="url(#screen-glow)"/>
        
        <!-- Glowing Face Plate Details -->
        <circle class="blink-eyes" cx="80" cy="85" r="8" fill="#00f0ff" filter="drop-shadow(0 0 5px #00f0ff)"/>
        <circle class="blink-eyes" cx="120" cy="85" r="8" fill="#00f0ff" filter="drop-shadow(0 0 5px #00f0ff)"/>
        
        <!-- Mouth Line -->
        <path d="M 90 102 Q 100 108 110 102" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>

        <!-- Neck -->
        <rect x="88" y="125" width="24" height="12" rx="4" fill="#1e2242"/>

        <!-- Upper Torso -->
        <path d="M 60 137 L 140 137 C 150 137, 150 170, 140 170 L 60 170 C 50 170, 50 137, 60 137 Z" fill="url(#body-grad)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <circle cx="100" cy="153" r="6" fill="#00f0ff" filter="drop-shadow(0 0 4px #00f0ff)"/>
      </g>
      
      <!-- Hands floating independently -->
      <g class="hover-hand-l">
        <circle cx="34" cy="130" r="10" fill="url(#body-grad)" stroke="rgba(255,255,255,0.1)"/>
        <circle cx="34" cy="130" r="4" fill="#00f0ff"/>
      </g>
      <g class="hover-hand-r">
        <circle cx="166" cy="130" r="10" fill="url(#body-grad)" stroke="rgba(255,255,255,0.1)"/>
        <circle cx="166" cy="130" r="4" fill="#00f0ff"/>
      </g>
    </svg>
  `,

  explaining: `
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="screen-glow-exp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#00f0ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="body-grad-exp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111428"/>
          <stop offset="100%" stop-color="#1e2242"/>
        </linearGradient>
      </defs>
      <style>
        .hover-body { animation: bodyFloat 3s ease-in-out infinite; }
        .talk-mouth { animation: mouthTalk 0.5s ease-in-out infinite alternate; }
        .type-hand-l { animation: typeLeft 0.15s ease infinite alternate; }
        .type-hand-r { animation: typeRight 0.15s ease infinite alternate-reverse; }
        @keyframes bodyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes mouthTalk {
          from { d: path("M 92 102 H 108"); stroke-width: 3; }
          to { d: path("M 92 102 Q 100 110 108 102"); stroke-width: 4; }
        }
        @keyframes typeLeft {
          from { transform: translate(0px, 0px); }
          to { transform: translate(-2px, -8px); }
        }
        @keyframes typeRight {
          from { transform: translate(0px, 0px); }
          to { transform: translate(2px, -8px); }
        }
      </style>
      <g class="hover-body">
        <!-- Floating Ring shadow -->
        <ellipse cx="100" cy="180" rx="35" ry="6" fill="#000" opacity="0.3"/>
        
        <!-- Antenna -->
        <line x1="100" y1="50" x2="100" y2="30" stroke="#00f0ff" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="24" r="8" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)"/>
        
        <!-- Head -->
        <rect x="46" y="50" width="108" height="76" rx="24" fill="url(#body-grad-exp)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="#05070f"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="url(#screen-glow-exp)"/>
        
        <!-- Face Details -->
        <circle cx="78" cy="85" r="8" fill="#00f0ff" filter="drop-shadow(0 0 5px #00f0ff)"/>
        <circle cx="122" cy="85" r="8" fill="#00f0ff" filter="drop-shadow(0 0 5px #00f0ff)"/>
        <path class="talk-mouth" d="M 90 102 Q 100 106 110 102" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>

        <!-- Neck -->
        <rect x="88" y="125" width="24" height="12" rx="4" fill="#1e2242"/>

        <!-- Torso -->
        <path d="M 60 137 L 140 137 C 150 137, 150 170, 140 170 L 60 170 C 50 170, 50 137, 60 137 Z" fill="url(#body-grad-exp)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <circle cx="100" cy="153" r="6" fill="#00f0ff"/>
      </g>
      
      <!-- Hologram Keyboard in front -->
      <path d="M 50 155 L 150 155 L 170 175 L 30 175 Z" fill="rgba(0, 240, 255, 0.1)" stroke="#00f0ff" stroke-width="1" filter="drop-shadow(0 0 8px rgba(0,240,255,0.3))"/>
      <line x1="60" y1="162" x2="140" y2="162" stroke="rgba(0,240,255,0.3)" stroke-width="2"/>
      <line x1="50" y1="168" x2="150" y2="168" stroke="rgba(0,240,255,0.3)" stroke-width="2"/>

      <!-- Rapid typing hands -->
      <g class="type-hand-l" style="transform-origin: 55px 158px;">
        <circle cx="55" cy="158" r="8" fill="url(#body-grad-exp)" stroke="#00f0ff" stroke-width="1.5"/>
      </g>
      <g class="type-hand-r" style="transform-origin: 145px 158px;">
        <circle cx="145" cy="158" r="8" fill="url(#body-grad-exp)" stroke="#00f0ff" stroke-width="1.5"/>
      </g>
    </svg>
  `,

  thinking: `
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="screen-glow-think" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffd700" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#ffd700" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="body-grad-think" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111428"/>
          <stop offset="100%" stop-color="#1e2242"/>
        </linearGradient>
      </defs>
      <style>
        .hover-body { animation: bodyFloat 3s ease-in-out infinite; }
        .spin-gear { animation: gearSpin 4s linear infinite; transform-origin: 100px 85px; }
        .hand-chin { transform: translate(-8px, -15px); }
        @keyframes bodyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes gearSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
      <g class="hover-body">
        <ellipse cx="100" cy="180" rx="35" ry="6" fill="#000" opacity="0.3"/>
        
        <!-- Antenna -->
        <line x1="100" y1="50" x2="100" y2="30" stroke="#ffd700" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="24" r="8" fill="#ffd700" filter="drop-shadow(0 0 6px #ffd700)"/>
        
        <!-- Head -->
        <rect x="46" y="50" width="108" height="76" rx="24" fill="url(#body-grad-think)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="#05070f"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="url(#screen-glow-think)"/>
        
        <!-- Gears instead of standard eyes to signify thinking -->
        <g class="spin-gear">
          <circle cx="85" cy="88" r="10" stroke="#ffd700" stroke-width="2" stroke-dasharray="4 2"/>
          <circle cx="115" cy="88" r="10" stroke="#ffd700" stroke-width="2" stroke-dasharray="4 2"/>
        </g>
        <path d="M 94 106 Q 100 102 106 106" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>

        <!-- Neck -->
        <rect x="88" y="125" width="24" height="12" rx="4" fill="#1e2242"/>

        <!-- Torso -->
        <path d="M 60 137 L 140 137 C 150 137, 150 170, 140 170 L 60 170 C 50 170, 50 137, 60 137 Z" fill="url(#body-grad-think)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <circle cx="100" cy="153" r="6" fill="#ffd700"/>
      </g>

      <!-- Left hand thinking position (on chin) -->
      <g class="hand-chin" style="transform-origin: 88px 125px;">
        <circle cx="85" cy="132" r="10" fill="url(#body-grad-think)" stroke="#ffd700" stroke-width="1.5"/>
        <path d="M 85 122 L 85 110" stroke="#ffd700" stroke-width="2" stroke-linecap="round"/>
      </g>
      
      <!-- Right hand floating -->
      <g class="hover-body">
        <circle cx="166" cy="130" r="10" fill="url(#body-grad-think)" stroke="rgba(255,255,255,0.1)"/>
        <circle cx="166" cy="130" r="4" fill="#ffd700"/>
      </g>
    </svg>
  `,

  happy: `
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="screen-glow-happy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#39ff14" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#39ff14" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="body-grad-happy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111428"/>
          <stop offset="100%" stop-color="#1e2242"/>
        </linearGradient>
      </defs>
      <style>
        .bounce-body { animation: bodyBounce 1.5s ease-in-out infinite; }
        .hands-wave { animation: handsWave 0.75s ease-in-out infinite alternate; }
        @keyframes bodyBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes handsWave {
          from { transform: translateY(0px); }
          to { transform: translateY(-15px); }
        }
      </style>
      <g class="bounce-body">
        <ellipse cx="100" cy="180" rx="35" ry="6" fill="#000" opacity="0.3"/>
        
        <!-- Antenna -->
        <line x1="100" y1="50" x2="100" y2="30" stroke="#39ff14" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="24" r="8" fill="#39ff14" filter="drop-shadow(0 0 6px #39ff14)"/>
        
        <!-- Head -->
        <rect x="46" y="50" width="108" height="76" rx="24" fill="url(#body-grad-happy)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="#05070f"/>
        <rect x="54" y="58" width="92" height="60" rx="16" fill="url(#screen-glow-happy)"/>
        
        <!-- Heart eyes or curved happy lines -->
        <path d="M 68 85 Q 78 75 88 85" stroke="#39ff14" stroke-width="4" stroke-linecap="round" filter="drop-shadow(0 0 4px #39ff14)"/>
        <path d="M 112 85 Q 122 75 132 85" stroke="#39ff14" stroke-width="4" stroke-linecap="round" filter="drop-shadow(0 0 4px #39ff14)"/>
        
        <!-- Mega Happy smile -->
        <path d="M 85 98 Q 100 114 115 98 Z" fill="#39ff14" filter="drop-shadow(0 0 4px #39ff14)"/>

        <!-- Neck -->
        <rect x="88" y="125" width="24" height="12" rx="4" fill="#1e2242"/>

        <!-- Torso -->
        <path d="M 60 137 L 140 137 C 150 137, 150 170, 140 170 L 60 170 C 50 170, 50 137, 60 137 Z" fill="url(#body-grad-happy)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <circle cx="100" cy="153" r="6" fill="#39ff14"/>
      </g>

      <!-- Excited hands waving in the air -->
      <g class="hands-wave">
        <!-- Left Hand -->
        <circle cx="30" cy="98" r="10" fill="url(#body-grad-happy)" stroke="#39ff14" stroke-width="1.5"/>
        <line x1="42" x2="30" y1="120" y2="108" stroke="#1e2242" stroke-width="4"/>
        <!-- Right Hand -->
        <circle cx="170" cy="98" r="10" fill="url(#body-grad-happy)" stroke="#39ff14" stroke-width="1.5"/>
        <line x1="158" x2="170" y1="120" y2="108" stroke="#1e2242" stroke-width="4"/>
      </g>
    </svg>
  `
};

const Mascot = {
  render(containerId, mood = "idle") {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = MASCOT_MOODS[mood] || MASCOT_MOODS["idle"];
  },
  
  setMood(containerId, mood) {
    this.render(containerId, mood);
  }
};

window.Mascot = Mascot;
