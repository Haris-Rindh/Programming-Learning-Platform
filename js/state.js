// CosmicCode State Management Engine

const INITIAL_STATE = {
  xp: 0,
  level: 1,
  streak: 1,
  lastActive: null,
  badges: [],
  completedLessons: {
    javascript: {},
    python: {},
    htmlcss: {}
  }
};

const BADGES_CONFIG = {
  first_step: {
    id: "first_step",
    name: "First Step",
    desc: "Enrolled in your first coding flight",
    icon: "🚀",
    color: "cyan"
  },
  syntax_slayer: {
    id: "syntax_slayer",
    name: "Syntax Slayer",
    desc: "Completed all JavaScript logic modules",
    icon: "⚡",
    color: "cyan"
  },
  serpent_tamer: {
    id: "serpent_tamer",
    name: "Serpent Tamer",
    desc: "Mastered Python loop flows",
    icon: "🐍",
    color: "green"
  },
  visual_reactor: {
    id: "visual_reactor",
    name: "Visual Sculptor",
    desc: "Created high-fidelity CSS layout cores",
    icon: "🎨",
    color: "pink"
  },
  sandbox_pro: {
    id: "sandbox_pro",
    name: "Sandbox Voyager",
    desc: "Executed a script in the custom sandbox editor",
    icon: "🧪",
    color: "gold"
  },
  grandmaster: {
    id: "grandmaster",
    name: "Grand Cosmic Scholar",
    desc: "Earned more than 1000 XP in the Academy",
    icon: "👑",
    color: "gold"
  }
};

class StateManager {
  constructor() {
    this.key = "cosmic_code_progress";
    this.data = this.load();
    this.checkStreak();
  }

  load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return { ...INITIAL_STATE };
    try {
      const parsed = JSON.parse(raw);
      // Merge with initial state to ensure any missing fields are present
      return {
        ...INITIAL_STATE,
        ...parsed,
        completedLessons: {
          ...INITIAL_STATE.completedLessons,
          ...(parsed.completedLessons || {})
        }
      };
    } catch (e) {
      console.error("Failed to load progress state", e);
      return { ...INITIAL_STATE };
    }
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.data));
    // Trigger custom event for reactivity across tabs or component refreshes
    window.dispatchEvent(new CustomEvent("cosmicStateUpdate", { detail: this.data }));
  }

  addXP(amount) {
    this.data.xp += amount;
    
    // Check level up (each level requires Level * 250 XP)
    let leveledUp = false;
    while (this.data.xp >= this.getXPNeededForLevel(this.data.level)) {
      this.data.xp -= this.getXPNeededForLevel(this.data.level);
      this.data.level++;
      leveledUp = true;
    }

    if (this.data.xp > 1000 && !this.data.badges.includes("grandmaster")) {
      this.unlockBadge("grandmaster");
    }

    this.save();
    return { leveledUp, level: this.data.level, xp: this.data.xp };
  }

  getXPNeededForLevel(level) {
    return level * 250;
  }

  completeLesson(trackId, lessonId) {
    if (!this.data.completedLessons[trackId]) {
      this.data.completedLessons[trackId] = {};
    }
    
    if (this.data.completedLessons[trackId][lessonId]) {
      // Already completed, don't award double XP
      return { alreadyDone: true };
    }

    this.data.completedLessons[trackId][lessonId] = true;
    
    // Unlock first badge
    if (this.data.badges.length === 0) {
      this.unlockBadge("first_step");
    }

    // Check course completion achievements
    this.checkCourseAchievements();

    const xpResult = this.addXP(100); // 100 XP per completed lesson
    this.save();
    
    return { alreadyDone: false, ...xpResult };
  }

  unlockBadge(badgeId) {
    if (this.data.badges.includes(badgeId)) return false;
    this.data.badges.push(badgeId);
    this.save();
    
    // Show visual toast notification if UI allows
    this.showBadgeNotification(badgeId);
    return true;
  }

  checkCourseAchievements() {
    // Check JavaScript Course
    const jsDone = ["js_variables", "js_functions", "js_dom"].every(
      id => this.data.completedLessons.javascript[id]
    );
    if (jsDone) this.unlockBadge("syntax_slayer");

    // Check Python Course
    const pyDone = ["py_variables", "py_loops", "py_lists"].every(
      id => this.data.completedLessons.python[id]
    );
    if (pyDone) this.unlockBadge("serpent_tamer");

    // Check HTML/CSS Course
    const webDone = ["html_structure", "css_visual", "css_reactor"].every(
      id => this.data.completedLessons.htmlcss[id]
    );
    if (webDone) this.unlockBadge("visual_reactor");
  }

  checkStreak() {
    const today = new Date().toDateString();
    const lastActiveDate = this.data.lastActive;

    if (!lastActiveDate) {
      this.data.lastActive = today;
      this.data.streak = 1;
      this.save();
      return;
    }

    if (lastActiveDate === today) return; // Already updated today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastActiveDate === yesterdayStr) {
      this.data.streak++;
    } else {
      // Streak broken, reset
      this.data.streak = 1;
    }

    this.data.lastActive = today;
    this.save();
  }

  showBadgeNotification(badgeId) {
    const badge = BADGES_CONFIG[badgeId];
    if (!badge) return;

    // Create dynamic high-tech floating toast
    const container = document.getElementById("toast-container") || (() => {
      const el = document.createElement("div");
      el.id = "toast-container";
      el.style.cssText = "position: fixed; bottom: 24px; right: 24px; z-index: 10000; display: flex; flex-direction: column; gap: 10px;";
      document.body.appendChild(el);
      return el;
    })();

    const toast = document.createElement("div");
    toast.className = `panel animate-fade-in`;
    toast.style.cssText = `
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(13, 15, 34, 0.95);
      border: 1px solid var(--accent-${badge.color});
      box-shadow: 0 0 20px rgba(var(--accent-${badge.color}-rgb), 0.2);
      max-width: 320px;
    `;

    toast.innerHTML = `
      <div style="font-size: 2.2rem;">${badge.icon}</div>
      <div>
        <h4 style="color: var(--accent-${badge.color}); font-size: 0.95rem; margin-bottom: 2px;">Badge Unlocked!</h4>
        <p style="font-size: 0.85rem; font-weight: 600; color: #fff; margin-bottom: 2px;">${badge.name}</p>
        <p style="font-size: 0.75rem; color: var(--text-secondary);">${badge.desc}</p>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "all 0.5s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-20px)";
      setTimeout(() => toast.remove(), 500);
    }, 6000);
  }

  resetProgress() {
    this.data = { ...INITIAL_STATE };
    this.save();
  }
}

// Global instance
const State = new StateManager();
window.State = State;
window.BADGES_CONFIG = BADGES_CONFIG;
