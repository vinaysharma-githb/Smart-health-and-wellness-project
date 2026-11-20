const USERS_DB_KEY = 'shwms_users_db_v2';
const SESSION_USER_KEY = 'shwms_active_session_v2';
const THEME_STORAGE_KEY = 'shwms_theme_pref_v2';

const DEMO_EMAIL = 'aarav.student@campus.edu';

function createDefaultUserData(isDemo = false) {
  return {
    goals: { water: 8, sleep: 8, exercise: 45 },
    profile: { heightCm: 174, weightKg: 68 },
    nutrition: { proteinGoal: 'active', creatinePhase: 'none' },
    mood: { label: 'Calm & Focused', emoji: '😌' },
    today: {
      water: isDemo ? 6 : 2,
      sleepHours: isDemo ? 7.5 : 7.0,
      sleepQuality: 'Good',
      workouts: isDemo
        ? [
            { id: 'w-1', type: 'Brisk Walking', duration: 25, intensity: 'Moderate', time: '08:00 AM' },
            { id: 'w-2', type: 'Yoga / Stretching', duration: 10, intensity: 'Low', time: '01:30 PM' },
          ]
        : [],
    },
    pastSixDays: isDemo
      ? [
          { day: 'Mon', water: 7, sleep: 7.0, exercise: 30 },
          { day: 'Tue', water: 8, sleep: 7.5, exercise: 45 },
          { day: 'Wed', water: 6, sleep: 6.0, exercise: 20 },
          { day: 'Thu', water: 8, sleep: 8.0, exercise: 50 },
          { day: 'Fri', water: 7, sleep: 7.5, exercise: 40 },
          { day: 'Sat', water: 8, sleep: 8.5, exercise: 55 },
        ]
      : [
          { day: 'Mon', water: 5, sleep: 6.5, exercise: 20 },
          { day: 'Tue', water: 6, sleep: 7.0, exercise: 30 },
          { day: 'Wed', water: 5, sleep: 6.5, exercise: 15 },
          { day: 'Thu', water: 7, sleep: 7.5, exercise: 35 },
          { day: 'Fri', water: 6, sleep: 7.0, exercise: 25 },
          { day: 'Sat', water: 7, sleep: 8.0, exercise: 40 },
        ],
    reminders: [
      { id: 'r-1', title: 'Drink 250ml Water', time: '10:30 AM', active: true },
      { id: 'r-2', title: 'Midday Stretch Break', time: '01:45 PM', active: true },
      { id: 'r-3', title: 'Evening Workout', time: '05:30 PM', active: true },
      { id: 'r-4', title: 'Wind Down for Sleep', time: '10:30 PM', active: true },
    ],
  };
}

const MOOD_OPTIONS = [
  { emoji: '🤩', label: 'Energized & Great' },
  { emoji: '😌', label: 'Calm & Focused' },
  { emoji: '😐', label: 'Neutral / Steady' },
  { emoji: '😓', label: 'Academic Stress' },
  { emoji: '😴', label: 'Fatigued / Low Sleep' },
];

const PREVENTIVE_TIPS = [
  {
    category: 'Hydration',
    title: 'Morning 500ml Rehydration Habit',
    body: 'Drinking two glasses of water right after waking replenishes overnight fluid loss and sharpens morning lecture concentration.',
    tag: 'Daily Focus',
  },
  {
    category: 'Sleep Hygiene',
    title: 'Fixed Wake-Up Anchor',
    body: 'Waking up at the same hour every morning stabilizes your circadian clock and improves deep slow-wave sleep quality.',
    tag: 'Restorative Sleep',
  },
  {
    category: 'Stress Management',
    title: '4-7-8 Exam Calm Technique',
    body: 'Inhale quietly for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. Four cycles rapidly lower exam-induced heart rate.',
    tag: 'Mental Well-Being',
  },
  {
    category: 'Physical Activity',
    title: '50/10 Desk Study Movement Rule',
    body: 'After 50 minutes of sitting at a laptop, take a 10-minute brisk walk or stretch to prevent posture strain and mental fatigue.',
    tag: 'Campus Fitness',
  },
  {
    category: 'Hydration',
    title: 'Visual Water Bottle Cue',
    body: 'Keeping a marked 1-liter bottle on your study desk acts as an effortless visual nudge to sip water steadily between classes.',
    tag: 'Behavioral Nudge',
  },
  {
    category: 'Sleep Hygiene',
    title: '30-Minute Pre-Sleep Screen Dimming',
    body: 'Reducing bright blue-light exposure 30 minutes before bedtime supports natural melatonin release for faster sleep onset.',
    tag: 'Evening Routine',
  },
];


  const htmlEl = document.documentElement;
  if (theme === 'dark') {
    htmlEl.classList.add('dark');
    document.querySelectorAll('.theme-icon-sun').forEach((el) => el.classList.remove('hidden'));
    document.querySelectorAll('.theme-icon-moon').forEach((el) => el.classList.add('hidden'));
  } else {
    htmlEl.classList.remove('dark');
    document.querySelectorAll('.theme-icon-sun').forEach((el) => el.classList.add('hidden'));
    document.querySelectorAll('.theme-icon-moon').forEach((el) => el.classList.remove('hidden'));
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {}
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const nextTheme = isDark ? 'light' : 'dark';
  applyTheme(nextTheme);
  showToast(
    `${nextTheme === 'dark' ? 'Dark' : 'Light'} Theme Enabled`,
    `Switched workspace appearance to ${nextTheme} mode.`
  );
}
applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || 'light');

function getUsersDB() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const initialDB = {
    [DEMO_EMAIL]: {
      name: 'Aarav Sharma',
      role: 'B.Tech Student • Campus Wellness',
      email: DEMO_EMAIL,
      password: 'wellness123',
      data: createDefaultUserData(true),
    },
  };
  saveUsersDB(initialDB);
  return initialDB;
}

function saveUsersDB(db) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  } catch (e) {}
}

let currentUserEmail = localStorage.getItem(SESSION_USER_KEY) || null;
let appState = null;
let currentTipCategory = 'All';

function switchAuthMode(mode) {
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const signinBtn = document.getElementById('tab-signin-btn');
  const signupBtn = document.getElementById('tab-signup-btn');

  if (mode === 'signin') {
    signinForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    signinBtn.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#0F2C2A] text-white shadow-xs transition';
    signupBtn.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-theme-muted hover:text-theme-primary transition';
  } else {
    signupForm.classList.remove('hidden');
    signinForm.classList.add('hidden');
    signupBtn.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#0F2C2A] text-white shadow-xs transition';
    signinBtn.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-theme-muted hover:text-theme-primary transition';
  }
}

function activateSession(email) {
  const db = getUsersDB();
  const user = db[email];
  if (!user) return;

  currentUserEmail = email;
  appState = user.data;
  try {
    localStorage.setItem(SESSION_USER_KEY, email);
  } catch (e) {}

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  document.getElementById('sidebar-avatar').textContent = initials || 'ST';
  document.getElementById('sidebar-user-name').textContent = user.name;
  document.getElementById('sidebar-user-role').textContent = user.role || 'Student Profile';
  document.getElementById('dashboard-welcome-title').textContent =
    `Welcome back, ${user.name.split(' ')[0]}! Stay consistent with your daily hydration, rest, and movement goals.`;

  document.getElementById('auth-screen').classList.add('hidden');
  const appShell = document.getElementById('app-shell');
  appShell.classList.remove('hidden');
  appShell.classList.add('flex');

  switchTab('dashboard');
  renderAll();
}

function loginWithDemoAccount() {
  getUsersDB();
  activateSession(DEMO_EMAIL);
  showToast('Demo Session Active', 'Signed in as Aarav Sharma with sample weekly wellness logs.', 'mint');
}

function signOutUser() {
  currentUserEmail = null;
  appState = null;
  try {
    localStorage.removeItem(SESSION_USER_KEY);
  } catch (e) {}

  const appShell = document.getElementById('app-shell');
  appShell.classList.add('hidden');
  appShell.classList.remove('flex');
  document.getElementById('auth-screen').classList.remove('hidden');
  showToast('Signed Out', 'Your wellness session has been securely closed.');
}


document.getElementById('signin-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim().toLowerCase();
  const password = document.getElementById('signin-password').value;
  const errEl = document.getElementById('signin-error');

  const db = getUsersDB();
  const user = db[email];
  if (!user || user.password !== password) {
    errEl.textContent = 'Invalid email or password. Try the Demo Account button or register a new profile.';
    errEl.classList.remove('hidden');
    return;
  }

  errEl.classList.add('hidden');
  activateSession(email);
  showToast('Signed In', `Welcome back, ${user.name}!`, 'mint');
});

// Sign Up Handler
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const role = document.getElementById('signup-role').value.trim() || 'Student Profile';
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');

  const db = getUsersDB();
  if (db[email]) {
    errEl.textContent = 'An account with this email already exists. Please Sign In instead.';
    errEl.classList.remove('hidden');
    return;
  }

  db[email] = {
    name,
    role,
    email,
    password,
    data: createDefaultUserData(false),
  };
  saveUsersDB(db);
  errEl.classList.add('hidden');
  activateSession(email);
  showToast('Account Created!', `Welcome ${name}! Your personal UN SDG 3 wellness workspace is ready.`, 'mint');
});

function saveCurrentUserState() {
  if (!currentUserEmail || !appState) return;
  const db = getUsersDB();
  if (db[currentUserEmail]) {
    db[currentUserEmail].data = appState;
    saveUsersDB(db);
  }
}


function showToast(title, message, variant = 'teal') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');

  const palette =
    variant === 'coral'
      ? 'bg-[#0F2C2A] text-white border-[#E85D75]'
      : variant === 'mint'
      ? 'bg-[#0F2C2A] text-white border-[#22A699]'
      : 'surface-card text-theme-primary border-[#1B6B63]';

  const badgeColor =
    variant === 'coral'
      ? 'bg-[#E85D75] text-white'
      : variant === 'mint'
      ? 'bg-[#22A699] text-[#0F2C2A]'
      : 'bg-[#1B6B63] text-white';

  toast.className = `toast-item pointer-events-auto rounded-2xl p-4 shadow-xl border-l-4 ${palette} flex items-start gap-3`;
  toast.innerHTML = `
    <span class="px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${badgeColor} shrink-0 mt-0.5">
      ${variant === 'coral' ? 'Alert' : 'Update'}
    </span>
    <div class="flex-1 min-w-0">
      <p class="font-extrabold text-sm leading-snug">${title}</p>
      <p class="text-xs opacity-85 mt-0.5 leading-relaxed">${message}</p>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 3800);
}


const TAB_TITLES = {
  dashboard: 'Dashboard',
  loggers: 'Daily Habit Loggers',
  goals: 'Goals & Smart Reminders',
  reports: 'Weekly Progress Report',
  profile: 'BMI, Protein & Hydration Calculator',
  tips: 'Preventive Wellness Tips',
};

function switchTab(tabId) {
  document.querySelectorAll('.view-panel').forEach((panel) => panel.classList.remove('active'));
  const targetPanel = document.getElementById(`view-${tabId}`);
  if (targetPanel) targetPanel.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    const isMatch = btn.dataset.tab === tabId;
    btn.className = isMatch
      ? 'nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all bg-[#1B6B63] text-white shadow-md'
      : 'nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-teal-100/80 hover:bg-white/5 hover:text-white';
  });

  document.getElementById('page-heading').textContent = TAB_TITLES[tabId] || 'Dashboard';
  closeMobileMenu();
}

const sidebarEl = document.getElementById('sidebar');
const backdropEl = document.getElementById('mobile-backdrop');

function closeMobileMenu() {
  sidebarEl.classList.add('-translate-x-full');
  backdropEl.classList.add('hidden');
}

document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  if (sidebarEl.classList.contains('-translate-x-full')) {
    sidebarEl.classList.remove('-translate-x-full');
    backdropEl.classList.remove('hidden');
  } else {
    closeMobileMenu();
  }
});
backdropEl.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

function adjustWater(delta) {
  if (!appState) return;
  const next = Math.max(0, Math.min(20, appState.today.water + delta));
  appState.today.water = next;
  saveCurrentUserState();
  renderAll();

  if (delta > 0) {
    if (next === appState.goals.water) {
      showToast('Hydration Goal Reached!', `You hit your daily target of ${appState.goals.water} glasses.`, 'mint');
    } else {
      showToast('Hydration Logged', `Logged ${next} of ${appState.goals.water} glasses (${(next * 0.25).toFixed(2)}L).`);
    }
  }
}

function setWaterExact(count) {
  if (!appState) return;
  appState.today.water = count;
  saveCurrentUserState();
  renderAll();
  showToast('Hydration Updated', `Daily intake set to ${count} glasses (${(count * 0.25).toFixed(2)}L).`);
}

function quickLogWalk() {
  if (!appState) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  appState.today.workouts.unshift({
    id: 'w-' + Date.now(),
    type: 'Brisk Walking',
    duration: 15,
    intensity: 'Moderate',
    time: timeStr,
  });
  saveCurrentUserState();
  renderAll();
  showToast('Quick Walk Logged!', 'Added +15 mins of Brisk Walking to today’s activity.', 'mint');
}

function deleteWorkout(id) {
  if (!appState) return;
  appState.today.workouts = appState.today.workouts.filter((w) => w.id !== id);
  saveCurrentUserState();
  renderAll();
  showToast('Workout Removed', 'Session deleted from today’s exercise log.');
}

function selectMood(emoji, label) {
  if (!appState) return;
  appState.mood = { emoji, label };
  saveCurrentUserState();
  renderMoodSelector();
  showToast('Mood Check-In Saved', `Logged today’s mental state: ${emoji} ${label}`);
}

function toggleReminder(id) {
  if (!appState) return;
  appState.reminders = appState.reminders.map((r) => {
    if (r.id === id) {
      const updated = { ...r, active: !r.active };
      showToast(
        updated.active ? 'Reminder Activated' : 'Reminder Paused',
        `"${updated.title}" (${updated.time}) is now ${updated.active ? 'enabled' : 'disabled'}.`
      );
      return updated;
    }
    return r;
  });
  saveCurrentUserState();
  renderAll();
}

function testReminderAlert(title, time) {
  showToast(`🔔 Reminder: ${title}`, `Scheduled habit nudge (${time}) — Stay consistent with your UN SDG 3 goals!`, 'coral');
}

function deleteReminder(id) {
  if (!appState) return;
  appState.reminders = appState.reminders.filter((r) => r.id !== id);
  saveCurrentUserState();
  renderAll();
  showToast('Reminder Deleted', 'Custom reminder removed.');
}

function applyRecommendedHydration() {
  if (!appState) return;
  const weight = appState.profile?.weightKg || 68;
  const recGlasses = Math.max(6, Math.min(16, Math.round((weight * 0.033) / 0.25)));
  appState.goals.water = recGlasses;
  saveCurrentUserState();
  renderAll();
  showToast('Base Hydration Goal Applied', `Updated daily water target to ${recGlasses} glasses (${(recGlasses * 0.25).toFixed(2)}L).`, 'mint');
}

function getNutritionCalculation() {
  const weight = appState?.profile?.weightKg || 68;
  const nutrition = appState?.nutrition || { proteinGoal: 'active', creatinePhase: 'none' };

  const proteinMultipliers = {
    sedentary: { min: 0.8, max: 1.0, label: 'Sedentary / General Wellness' },
    active: { min: 1.2, max: 1.4, label: 'Active Student / Light Exercise' },
    strength: { min: 1.6, max: 2.0, label: 'Strength Training / Muscle Gain' },
    fatloss: { min: 1.8, max: 2.2, label: 'Fat Loss / High-Protein Deficit' },
  };

  const mult = proteinMultipliers[nutrition.proteinGoal] || proteinMultipliers.active;
  const minProtein = Math.round(weight * mult.min);
  const maxProtein = Math.round(weight * mult.max);
  const avgPerMeal = Math.round(((minProtein + maxProtein) / 2) / 4);

  const baseWaterMl = Math.round(weight * 33);
  let creatineExtraMl = 0;
  let creatineDoseLabel = '0g / day';
  let creatineCaption = 'Standard baseline hydration';

  if (nutrition.creatinePhase === 'maintenance') {
    creatineExtraMl = 600;
    creatineDoseLabel = '3–5g / day';
    creatineCaption = 'Maintenance cellular hydration (+2.5 glasses)';
  } else if (nutrition.creatinePhase === 'loading') {
    creatineExtraMl = 1000;
    creatineDoseLabel = '15–20g / day';
    creatineCaption = 'Loading phase cellular saturation (+4 glasses)';
  }

  const combinedWaterMl = baseWaterMl + creatineExtraMl;
  const combinedGlasses = Math.max(6, Math.min(20, Math.round(combinedWaterMl / 250)));
  const combinedLiters = (combinedGlasses * 0.25).toFixed(2);

  return {
    weight,
    minProtein,
    maxProtein,
    avgPerMeal,
    baseWaterMl,
    creatineExtraMl,
    creatineDoseLabel,
    creatineCaption,
    combinedGlasses,
    combinedLiters,
  };
}

function syncCombinedWaterTarget() {
  if (!appState) return;
  const calc = getNutritionCalculation();
  appState.goals.water = calc.combinedGlasses;
  saveCurrentUserState();
  renderAll();
  showToast(
    'Combined Water Goal Synced!',
    `Daily water target set to ${calc.combinedGlasses} glasses (${calc.combinedLiters}L) including creatine hydration adjustment.`,
    'mint'
  );
}

function exportWeeklyCSV() {
  if (!appState) return;
  const { totalExercise } = getMetrics();
  const rows = [
    ['Day', 'Water_Glasses', 'Water_Goal', 'Sleep_Hours', 'Sleep_Goal', 'Exercise_Mins', 'Exercise_Goal'],
    ...appState.pastSixDays.map((d) => [
      d.day,
      d.water,
      appState.goals.water,
      d.sleep,
      appState.goals.sleep,
      d.exercise,
      appState.goals.exercise,
    ]),
    [
      'Sunday (Today)',
      appState.today.water,
      appState.goals.water,
      appState.today.sleepHours,
      appState.goals.sleep,
      totalExercise,
      appState.goals.exercise,
    ],
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Smart_Wellness_Weekly_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CSV Report Downloaded', 'Exported 7-day student wellness metrics for evaluation.', 'mint');
}

// Form Listeners
document.getElementById('header-add-water-btn').addEventListener('click', () => adjustWater(1));

document.getElementById('header-reset-btn').addEventListener('click', () => {
  if (!appState) return;
  appState = createDefaultUserData(currentUserEmail === DEMO_EMAIL);
  saveCurrentUserState();
  renderAll();
  showToast('Data Reset', 'Your wellness metrics have been reset to baseline defaults.', 'mint');
});

const sleepSlider = document.getElementById('sleep-hours-slider');
const sleepSliderDisplay = document.getElementById('sleep-slider-display');
sleepSlider.addEventListener('input', (e) => {
  sleepSliderDisplay.textContent = `${parseFloat(e.target.value).toFixed(1)} hrs`;
});

document.getElementById('sleep-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!appState) return;
  appState.today.sleepHours = parseFloat(sleepSlider.value);
  appState.today.sleepQuality = document.getElementById('sleep-quality-select').value;
  saveCurrentUserState();
  renderAll();
  showToast('Sleep Record Saved', `Logged ${appState.today.sleepHours} hrs (${appState.today.sleepQuality}).`, 'mint');
});

document.getElementById('exercise-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!appState) return;
  const type = document.getElementById('exercise-type').value;
  const duration = parseInt(document.getElementById('exercise-duration').value, 10);
  const intensity = document.getElementById('exercise-intensity').value;
  if (isNaN(duration) || duration <= 0) return;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  appState.today.workouts.unshift({
    id: 'w-' + Date.now(),
    type,
    duration,
    intensity,
    time: timeStr,
  });
  saveCurrentUserState();
  renderAll();
  showToast('Exercise Logged', `Added ${duration} mins of ${type} (${intensity}).`, 'mint');
});

document.getElementById('goals-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!appState) return;
  const w = parseInt(document.getElementById('goal-water-input').value, 10);
  const s = parseFloat(document.getElementById('goal-sleep-input').value);
  const ex = parseInt(document.getElementById('goal-exercise-input').value, 10);

  appState.goals = {
    water: Math.max(1, Math.min(20, w || 8)),
    sleep: Math.max(4, Math.min(14, s || 8)),
    exercise: Math.max(10, Math.min(240, ex || 45)),
  };
  saveCurrentUserState();
  renderAll();
  showToast('Goals Updated', 'All dashboard progress bars and weekly reports recalculated.', 'mint');
});

document.getElementById('add-reminder-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!appState) return;
  const titleInput = document.getElementById('reminder-title-input');
  const timeInput = document.getElementById('reminder-time-input');
  const title = titleInput.value.trim();
  const time = timeInput.value.trim() || '06:00 PM';
  if (!title) return;

  appState.reminders.push({
    id: 'r-' + Date.now(),
    title,
    time,
    active: true,
  });
  titleInput.value = '';
  saveCurrentUserState();
  renderAll();
  showToast('Reminder Added', `Scheduled "${title}" at ${time}.`, 'mint');
});

document.getElementById('bmi-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!appState) return;
  const h = parseFloat(document.getElementById('profile-height').value);
  const w = parseFloat(document.getElementById('profile-weight').value);
  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return;

  appState.profile = { heightCm: h, weightKg: w };
  saveCurrentUserState();
  renderProfileMetrics();
  showToast('BMI & Body Metrics Updated', 'Recalculated BMI, protein targets, and hydration requirements.', 'mint');
});

document.getElementById('protein-goal-select').addEventListener('change', (e) => {
  if (!appState) return;
  if (!appState.nutrition) appState.nutrition = { proteinGoal: 'active', creatinePhase: 'none' };
  appState.nutrition.proteinGoal = e.target.value;
  saveCurrentUserState();
  renderProfileMetrics();
});

document.getElementById('creatine-phase-select').addEventListener('change', (e) => {
  if (!appState) return;
  if (!appState.nutrition) appState.nutrition = { proteinGoal: 'active', creatinePhase: 'none' };
  appState.nutrition.creatinePhase = e.target.value;
  saveCurrentUserState();
  renderProfileMetrics();
});

document.querySelectorAll('.tip-filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentTipCategory = btn.dataset.category;
    document.querySelectorAll('.tip-filter-btn').forEach((b) => {
      b.className =
        b.dataset.category === currentTipCategory
          ? 'tip-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0F2C2A] text-white transition'
          : 'tip-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold surface-subtle text-theme-primary transition';
    });
    renderTips();
  });
});

function getMetrics() {
  const totalExercise = appState.today.workouts.reduce((sum, w) => sum + Number(w.duration || 0), 0);
  const waterPct = Math.min(100, Math.round((appState.today.water / appState.goals.water) * 100));
  const sleepPct = Math.min(100, Math.round((appState.today.sleepHours / appState.goals.sleep) * 100));
  const exercisePct = Math.min(100, Math.round((totalExercise / appState.goals.exercise) * 100));
  const overallPct = Math.round((waterPct + sleepPct + exercisePct) / 3);
  return { totalExercise, waterPct, sleepPct, exercisePct, overallPct };
}

function renderMoodSelector() {
  const currentMood = appState.mood || { emoji: '😌', label: 'Calm & Focused' };
  document.getElementById('mood-status-caption').textContent = `Current state: ${currentMood.emoji} ${currentMood.label}`;

  document.getElementById('mood-selector-group').innerHTML = MOOD_OPTIONS.map((m) => {
    const selected = m.label === currentMood.label;
    return `
      <button type="button" onclick="selectMood('${m.emoji}', '${m.label}')" class="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
        selected
          ? 'bg-[#1B6B63] text-white shadow-xs'
          : 'surface-subtle text-theme-primary hover:opacity-80'
      }">
        <span>${m.emoji}</span>
        <span>${m.label}</span>
      </button>
    `;
  }).join('');
}

function renderDashboardAndKPIs() {
  const { totalExercise, waterPct, sleepPct, exercisePct, overallPct } = getMetrics();

  document.getElementById('sidebar-score-text').textContent = `${overallPct}%`;
  document.getElementById('sidebar-score-bar').style.width = `${overallPct}%`;

  document.getElementById('kpi-overall-score').textContent = `${overallPct}%`;
  document.getElementById('kpi-overall-bar').style.width = `${overallPct}%`;

  document.getElementById('kpi-water-pct').textContent = `${waterPct}%`;
  document.getElementById('kpi-water-val').textContent = appState.today.water;
  document.getElementById('kpi-water-target').textContent = `/ ${appState.goals.water} glasses`;
  document.getElementById('kpi-water-liters').textContent = `${(appState.today.water * 0.25).toFixed(2)} L consumed`;
  document.getElementById('kpi-water-bar').style.width = `${waterPct}%`;

  document.getElementById('kpi-sleep-pct').textContent = `${sleepPct}%`;
  document.getElementById('kpi-sleep-val').textContent = `${appState.today.sleepHours}h`;
  document.getElementById('kpi-sleep-target').textContent = `/ ${appState.goals.sleep}h target`;
  document.getElementById('kpi-sleep-quality').textContent = appState.today.sleepQuality;
  document.getElementById('kpi-sleep-bar').style.width = `${sleepPct}%`;

  document.getElementById('kpi-exercise-pct').textContent = `${exercisePct}%`;
  document.getElementById('kpi-exercise-val').textContent = `${totalExercise}m`;
  document.getElementById('kpi-exercise-target').textContent = `/ ${appState.goals.exercise}m target`;
  document.getElementById('kpi-exercise-count').textContent = `${appState.today.workouts.length} session(s) today`;
  document.getElementById('kpi-exercise-bar').style.width = `${exercisePct}%`;

  renderMoodSelector();

  const dashWorkouts = document.getElementById('dashboard-workout-list');
  if (appState.today.workouts.length === 0) {
    dashWorkouts.innerHTML = `<p class="text-xs text-theme-muted py-6 text-center surface-subtle rounded-xl">No workouts logged yet today.</p>`;
  } else {
    dashWorkouts.innerHTML = appState.today.workouts
      .map(
        (w) => `
        <div class="p-3.5 rounded-xl surface-subtle flex items-center justify-between">
          <div>
            <p class="font-bold text-sm text-theme-primary">${w.type}</p>
            <p class="text-xs text-theme-muted">${w.intensity} Intensity • ${w.time}</p>
          </div>
          <span class="px-3 py-1 rounded-lg surface-card text-[#22A699] font-extrabold text-xs">
            ${w.duration} mins
          </span>
        </div>
      `
      )
      .join('');
  }

  const dashReminders = document.getElementById('dashboard-reminders-list');
  dashReminders.innerHTML = appState.reminders
    .slice(0, 4)
    .map(
      (r) => `
      <div class="p-3.5 rounded-xl surface-subtle flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="w-2.5 h-2.5 rounded-full ${r.active ? 'bg-[#22A699]' : 'bg-slate-400'} shrink-0"></span>
          <div class="min-w-0">
            <p class="font-bold text-sm text-theme-primary truncate">${r.title}</p>
            <p class="text-xs text-theme-muted">${r.time} • ${r.active ? 'Active' : 'Paused'}</p>
          </div>
        </div>
        <button type="button" onclick="testReminderAlert('${r.title.replace(/'/g, "\\'")}', '${r.time}')" class="px-2.5 py-1.5 rounded-lg bg-[#0F2C2A] hover:bg-[#1B6B63] text-white text-[11px] font-bold shrink-0 transition">
          Test Alert
        </button>
      </div>
    `
    )
    .join('');
}

function renderLoggers() {
  const { totalExercise } = getMetrics();
  document.getElementById('logger-water-badge').textContent = `${appState.today.water} / ${appState.goals.water} Glasses`;

  const grid = document.getElementById('water-glasses-grid');
  const totalSlots = Math.max(appState.goals.water, appState.today.water, 8);
  let gridHTML = '';
  for (let i = 1; i <= totalSlots; i++) {
    const filled = i <= appState.today.water;
    const targetVal = filled && i === appState.today.water ? i - 1 : i;
    gridHTML += `
      <button type="button" onclick="setWaterExact(${targetVal})" class="water-glass-btn h-14 rounded-xl border flex flex-col items-center justify-center ${
        filled
          ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
          : 'surface-card text-sky-500 hover:border-sky-400'
      }">
        <svg class="w-4 h-4" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
        <span class="text-[10px] font-extrabold mt-0.5">${i * 250}ml</span>
      </button>
    `;
  }
  grid.innerHTML = gridHTML;

  sleepSlider.value = appState.today.sleepHours;
  sleepSliderDisplay.textContent = `${appState.today.sleepHours} hrs`;
  document.getElementById('sleep-quality-select').value = appState.today.sleepQuality;

  const feedbackBox = document.getElementById('sleep-feedback-box');
  if (appState.today.sleepHours < 6.5) {
    feedbackBox.textContent =
      'Alert: Sleep duration is below 6.5 hours. Prioritize an earlier wind-down tonight to restore focus and immunity.';
  } else {
    feedbackBox.textContent =
      'Great recovery! Consistent 7–8.5 hour sleep cycles boost academic memory retention and emotional resilience.';
  }

  document.getElementById('logger-exercise-total').textContent = `${totalExercise} mins total`;
  const loggerWorkouts = document.getElementById('logger-workout-list');
  if (appState.today.workouts.length === 0) {
    loggerWorkouts.innerHTML = `<p class="text-xs text-theme-muted py-4 text-center">No sessions recorded yet.</p>`;
  } else {
    loggerWorkouts.innerHTML = appState.today.workouts
      .map(
        (w) => `
        <div class="p-2.5 rounded-xl surface-subtle flex items-center justify-between text-xs">
          <div>
            <p class="font-bold text-theme-primary">${w.type}</p>
            <p class="text-theme-muted">${w.duration} mins • ${w.intensity} • ${w.time}</p>
          </div>
          <button type="button" onclick="deleteWorkout('${w.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-[#E85D75] font-bold transition">
            Delete
          </button>
        </div>
      `
      )
      .join('');
  }
}

function renderGoalsAndReminders() {
  document.getElementById('goal-water-input').value = appState.goals.water;
  document.getElementById('goal-sleep-input').value = appState.goals.sleep;
  document.getElementById('goal-exercise-input').value = appState.goals.exercise;

  const listEl = document.getElementById('reminders-manager-list');
  listEl.innerHTML = appState.reminders
    .map(
      (r) => `
      <div class="p-4 rounded-2xl surface-subtle ${r.active ? '' : 'opacity-65'} flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button type="button" onclick="toggleReminder('${r.id}')" class="w-11 h-6 rounded-full p-0.5 transition-colors ${
            r.active ? 'bg-[#1B6B63]' : 'bg-slate-400/50'
          }" aria-label="Toggle reminder">
            <div class="w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
              r.active ? 'translate-x-5' : 'translate-x-0'
            }"></div>
          </button>
          <div>
            <p class="font-bold text-sm text-theme-primary">${r.title}</p>
            <p class="text-xs text-theme-muted">Scheduled at <strong class="text-[#22A699]">${r.time}</strong></p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-center">
          <button type="button" onclick="testReminderAlert('${r.title.replace(/'/g, "\\'")}', '${r.time}')" class="px-3 py-1.5 rounded-xl bg-[#E85D75] hover:bg-rose-600 text-white text-xs font-bold transition">
            Test Reminder Alert
          </button>
          <button type="button" onclick="deleteReminder('${r.id}')" class="p-1.5 rounded-lg text-theme-muted hover:text-[#E85D75] transition" title="Delete reminder">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

function renderWeeklyReport() {
  const { totalExercise } = getMetrics();
  const sevenDays = [
    ...appState.pastSixDays,
    {
      day: 'Sun (Today)',
      water: appState.today.water,
      sleep: appState.today.sleepHours,
      exercise: totalExercise,
      isToday: true,
    },
  ];

  document.getElementById('weekly-bar-chart').innerHTML = sevenDays
    .map((d) => {
      const wPct = Math.min(100, Math.round((d.water / appState.goals.water) * 100));
      const sPct = Math.min(100, Math.round((d.sleep / appState.goals.sleep) * 100));
      const ePct = Math.min(100, Math.round((d.exercise / appState.goals.exercise) * 100));

      return `
        <div class="flex flex-col items-center gap-2.5">
          <div class="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-44">
            <div title="Water: ${d.water} glasses (${wPct}%)" class="w-2.5 sm:w-4 bg-sky-500 rounded-t-md progress-fill" style="height: ${Math.max(8, wPct)}%"></div>
            <div title="Sleep: ${d.sleep} hrs (${sPct}%)" class="w-2.5 sm:w-4 bg-indigo-500 rounded-t-md progress-fill" style="height: ${Math.max(8, sPct)}%"></div>
            <div title="Exercise: ${d.exercise} mins (${ePct}%)" class="w-2.5 sm:w-4 bg-[#22A699] rounded-t-md progress-fill" style="height: ${Math.max(8, ePct)}%"></div>
          </div>
          <span class="text-[11px] sm:text-xs font-extrabold text-center px-2 py-0.5 rounded-md ${
            d.isToday ? 'bg-[#0F2C2A] text-[#22A699]' : 'text-theme-muted'
          }">
            ${d.isToday ? 'Sun' : d.day}
          </span>
        </div>
      `;
    })
    .join('');

  document.getElementById('weekly-breakdown-tbody').innerHTML = sevenDays
    .map((d) => {
      const wPct = Math.min(100, Math.round((d.water / appState.goals.water) * 100));
      const sPct = Math.min(100, Math.round((d.sleep / appState.goals.sleep) * 100));
      const ePct = Math.min(100, Math.round((d.exercise / appState.goals.exercise) * 100));
      const avg = Math.round((wPct + sPct + ePct) / 3);

      const badgeClass =
        avg >= 85
          ? 'bg-emerald-500/15 text-emerald-500'
          : avg >= 65
          ? 'bg-teal-500/15 text-[#22A699]'
          : 'bg-amber-500/15 text-amber-500';
      const statusLabel = avg >= 85 ? 'Optimal' : avg >= 65 ? 'On Track' : 'Needs Focus';

      return `
        <tr class="${d.isToday ? 'bg-teal-500/10 font-semibold' : ''}">
          <td class="py-3 px-4 font-bold text-theme-primary">${d.day}</td>
          <td class="py-3 px-4 text-sky-500 font-medium">${d.water} / ${appState.goals.water} glasses</td>
          <td class="py-3 px-4 text-indigo-400 font-medium">${d.sleep} / ${appState.goals.sleep} hrs</td>
          <td class="py-3 px-4 text-[#22A699] font-medium">${d.exercise} / ${appState.goals.exercise} mins</td>
          <td class="py-3 px-4 font-extrabold text-theme-primary">${avg}%</td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass}">${statusLabel}</span>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderProfileMetrics() {
  const h = appState.profile?.heightCm || 174;
  const w = appState.profile?.weightKg || 68;
  document.getElementById('profile-height').value = h;
  document.getElementById('profile-weight').value = w;

  const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
  document.getElementById('bmi-value-display').textContent = bmi;

  const badge = document.getElementById('bmi-category-badge');
  if (bmi < 18.5) {
    badge.textContent = 'Underweight';
    badge.className = 'inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500';
  } else if (bmi < 25) {
    badge.textContent = 'Healthy / Normal Weight';
    badge.className = 'inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500';
  } else if (bmi < 30) {
    badge.textContent = 'Overweight';
    badge.className = 'inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500';
  } else {
    badge.textContent = 'Obese Range';
    badge.className = 'inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-[#E85D75]';
  }

  const recGlasses = Math.max(6, Math.min(16, Math.round((w * 0.033) / 0.25)));
  document.getElementById('recommended-water-display').textContent = `${recGlasses} Glasses`;
  document.getElementById('recommended-liters-display').textContent = `~${(recGlasses * 0.25).toFixed(2)} Liters / day`;

  const nutrition = appState.nutrition || { proteinGoal: 'active', creatinePhase: 'none' };
  document.getElementById('protein-goal-select').value = nutrition.proteinGoal;
  document.getElementById('creatine-phase-select').value = nutrition.creatinePhase;
  document.getElementById('nutrition-weight-pill').textContent = `Synced Body Weight: ${w} kg`;

  const calc = getNutritionCalculation();
  document.getElementById('protein-range-display').textContent = `${calc.minProtein}g – ${calc.maxProtein}g`;
  document.getElementById('protein-meal-split').textContent = `~${calc.avgPerMeal}g protein across 4 meals`;

  document.getElementById('creatine-dose-display').textContent = calc.creatineDoseLabel;
  document.getElementById('creatine-extra-water-display').textContent = `+${calc.creatineExtraMl} ml extra water`;
  document.getElementById('creatine-phase-caption').textContent = calc.creatineCaption;

  document.getElementById('combined-water-glasses-display').textContent = `${calc.combinedGlasses} Glasses`;
  document.getElementById('combined-water-liters-display').textContent = `${calc.combinedLiters} L (${calc.combinedGlasses * 250} ml)`;
  document.getElementById('combined-water-formula').textContent = `Base ${calc.baseWaterMl}ml + ${calc.creatineExtraMl}ml creatine`;
  document.getElementById('sync-btn-target-preview').textContent = `${calc.combinedGlasses} glasses / ${calc.combinedLiters}L`;
}

function renderTips() {
  const grid = document.getElementById('tips-cards-grid');
  const filtered =
    currentTipCategory === 'All'
      ? PREVENTIVE_TIPS
      : PREVENTIVE_TIPS.filter((t) => t.category === currentTipCategory);

  grid.innerHTML = filtered
    .map(
      (tip) => `
      <div class="surface-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-lg surface-subtle text-[#22A699] font-bold text-[11px]">
              ${tip.category}
            </span>
            <span class="text-[11px] font-semibold text-theme-muted">${tip.tag}</span>
          </div>
          <h4 class="text-lg font-extrabold text-theme-primary">${tip.title}</h4>
          <p class="text-xs sm:text-sm text-theme-muted mt-2 leading-relaxed">${tip.body}</p>
        </div>
        <div class="mt-5 pt-3 border-t border-theme flex items-center justify-between">
          <span class="text-[11px] font-bold text-[#22A699]">UN SDG 3 Preventive Tip</span>
          <button type="button" onclick="showToast('Habit Tip Saved', 'Added &quot;${tip.title.replace(/'/g, "\\'")}&quot; to today’s focus.', 'mint')" class="text-xs font-bold text-theme-primary hover:text-[#E85D75] transition">
            Apply Today →
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

function renderAll() {
  if (!appState) return;
  renderDashboardAndKPIs();
  renderLoggers();
  renderGoalsAndReminders();
  renderWeeklyReport();
  renderProfileMetrics();
  renderTips();
}


document.getElementById('header-date').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

getUsersDB();
if (currentUserEmail && getUsersDB()[currentUserEmail]) {
  activateSession(currentUserEmail);
}
