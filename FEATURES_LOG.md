# 📜 Project Features Log

This document tracks every new feature we add to ProTasker, explaining the **Code**, the **Logic**, and the **"Why"**.

---

## 📅 Entry 1: Task Priorities (High/Medium/Low)
**Added:** Feature 1

### 1. The Backend Change (`back/src/models/Task.js`)
**Goal**: We need the database to strictly understand that a task can only have 3 levels of priority.

**The Code We Added**:
```javascript
priority: {
    type: String,
    enum: ['low', 'medium', 'high'], // VALIDATION!
    default: 'low'
}
```

**Why `enum`?**
If you try to send `priority: "super-urgent"`, MongoDB will **reject** it. This keeps our data clean.

### 2. The Frontend Change (`client/src/pages/Dashboard.jsx`)
**Goal**: Allow users to select priority and see it visually.

*   **State**: Added `const [priority, setPriority] = useState('low');`
*   **Visuals**: Added a helper function `getPriorityColor` to change the border color of the task card based on priority.

### 3. Data Flow
1.  User selects "High" in UI.
2.  React sends `{ priority: "high" }` to Backend.
3.  Mongoose saves it.
4.  Dashboard re-renders with a **Red Border** for that task.

---

## 📅 Entry 2: Smart Filters
**Added:** Feature 2

### 1. The "Secret" (No Backend Changes Needed!)
This is the coolest part. We didn't touch the Backend code.
**Why?** Because in **Module 3**, we wrote this magic line in `taskController.js`:
```javascript
const tasks = await Task.find(req.query); // req.query catches ?status=pending
```
This means our backend was *already* smart enough to filter. It was just waiting for the Frontend to ask!

### 2. The Frontend Change (`client/src/pages/Dashboard.jsx`)
**Goal**: Create buttons that change the API URL.

**A. The Logic**
We built a dynamic query string:
```javascript
let query = '/api/tasks?';
if (filterStatus !== 'all') query += `status=${filterStatus}&`;
if (filterPriority !== 'all') query += `priority=${filterPriority}&`;

// Result: /api/tasks?status=pending&priority=high&
```

**B. The Wiring (`useEffect`)**
We told React: *"Whenever the filter state changes, re-run `fetchTasks` immediately."*
```javascript
useEffect(() => {
    fetchTasks();
}, [filterStatus, filterPriority]); // Dependency Array
```

### 3. Visual Diagram
```mermaid
graph TD
    User[User Selects 'High Priority'] -->|State Change| React
    React -->|useEffect Triggers| Fetch
    Fetch -->|GET /api/tasks?priority=high| API
    API -->|Mongoose: .find({priority: 'high'})| DB
    DB -->|Return Filtered List| React
```

---

## 📅 Entry 3: Dynamic Sorting
**Added:** Feature 3

### 1. The Logic (Backend Power Again!)
Just like Filtering, we relied on our robust Backend.
In `taskController.js`, we have this logic:
```javascript
if (req.query.sort) {
    query = query.sort(req.query.sort);
}
```
*   `sort='-createdAt'`: The minus means **Descending** (Newest first).
*   `sort='createdAt'`: Ascending (Oldest first).
*   `sort='title'`: Alphabetical (A-Z).

### 2. The Frontend Change
We added a new dropdown and wired it to state.

Query String now looks like:
`/api/tasks?sort=-createdAt&status=pending&`

### 3. Why this matters?
You are now "Mixing" features. You can **Filter** for "Pending" tasks AND **Sort** them by "Oldest First" to see what you've been neglecting!
This is the power of a standard REST API.

---

## 📅 Entry 4: Due Dates & Visual Urgency
**Added:** Feature 4

### 1. The Logic (Schema Check)
We first checked `Task.js`. It already had:
```javascript
dueDate: { type: Date }
```
So, no database changes were needed! This is why planning your Schema early is good.

### 2. The Frontend Change
**A. Input**: Added `<input type="date" />`.
**B. Visuals**:
We added a smart helper function:
```javascript
const isOverdue = (dateString, status) => {
    // If completed, it doesn't matter if it was late.
    if (status === 'completed') return false; 
    // Check if Due Date is BEFORE Today
    return new Date(dateString) < new Date(); 
};
```

### 3. The Result
If you create a task with a date in the past, it now gets a **RED "OVERDUE!" Badge**.
This teaches you **Conditional Rendering** based on derived state (calculating something on the fly).

---

## 📅 Entry 5: Edit Mode (Update Functionality)
**Added:** Feature 5

### 1. The Conflict
You said: *"I cannot edit my task!"*
Functionality-wise, we needed to use `PUT /api/tasks/:id`.

### 2. The Solution: "Form Recycling"
Instead of building a separate "Edit Page", we **reused** the "Add Task" form.

**A. New State Variables**
```javascript
const [isEditing, setIsEditing] = useState(false);
const [currentTaskId, setCurrentTaskId] = useState(null);
```

**B. The Logic (Toggle)**
When you click **Edit** on a task card:
1.  `isEditing` becomes `true`.
2.  The form fields (`title`, `status`, etc.) are filled with that task's data.
3.  The Form Button changes from "Add" (Black) to "Update" (Blue).

**C. The Submit Handler**
We upgraded the submit function to be smart:
```javascript
if (isEditing) {
    await axios.put(...); // Update
} else {
    await axios.post(...); // Create
}
```

### 3. Visuals
We added an `✏️ Edit` button to every card. When you are editing, the form turns **Light Blue** to show you are in a special mode.

---

## 📅 Entry 6: Data Analytics (Stats Dashboard)
**Added:** Feature 6

### 1. Connecting the Dots (Backend -> Frontend)
Remember **Module 9**? We built a powerful MongoDB pipeline:
```javascript
Task.aggregate([ { $group: { _id: '$status', numTasks: { $sum: 1 } } } ])
```
It was sitting unused. Today, we finally wired it up!

### 2. The Implementation
**A. Fetching Data**
We added a simple `fetchStats` function in the Dashboard.
It hits `/api/stats` and gets back an array like:
`[ { _id: 'completed', numTasks: 5 }, { _id: 'pending', numTasks: 2 } ]`

**B. "Live" Sync**
Usage Tip: We made sure to call `fetchStats()` **every time** you add, delete, or update a task.
*   **Result**: If you change a task from "Pending" to "Completed", the numbers at the top update *instantly*.

### 3. The Visuals
We added **Dark Mode Cards** at the very top.
*   They show the **Big Number** (Count) and the **Label** (Status).
*   This gives you a "Bird's Eye View" of your productivity before you dive into the list.

---

## 📅 Entry 7: Dark Mode (Theme Engine) 🌙
**Added:** Feature 7

### 1. The Challenge
You wanted the app to look "cool" and modern.
Hardcoding `background: 'black'` is easy, but switching between light and dark requires **Global State**.

### 2. The Solution: `ThemeContext`
We created a new Context provider (`ThemeContext.jsx`) that wraps the entire app.
*   **State**: It holds `theme` ('light' or 'dark').
*   **Persistence**: It saves your preference to `localStorage`, so if you refresh, it remembers!

### 3. Dynamic Styles
In `Dashboard.jsx`, we replaced hardcoded colors with a `colors` object provided by the context.
*   **Before**: `style={{ background: 'white' }}`
*   **After**: `style={{ background: colors.background }}`

### 4. The Result
A toggle button (`🌙 / ☀️`) in the header instantly flips the color palette of the **entire application**.
This is how professional apps handle theming.

---

## 📅 Entry 8: Real-Time Search Engine 🔍
**Added:** Feature 8

### 1. The Problem
You have filters and sorting, but what if you have 50 tasks and need to find "Login Bug Fix" quickly?

### 2. The Backend Solution: MongoDB Regex
We modified `taskController.js` to support a `search` query parameter:
```javascript
if (req.query.search) {
    filterObj.title = { $regex: req.query.search, $options: 'i' };
}
```
**What this does:**
*   `$regex`: MongoDB's pattern matching (like SQL's `LIKE %search%`).
*   `$options: 'i'`: Case-insensitive (matches "login", "Login", "LOGIN").

### 3. The Frontend Magic: Debouncing
**The Challenge**: If we fetched on every keystroke, typing "Login" would trigger 5 API calls!
**The Solution**: We wait 500ms after the user stops typing before searching.
```javascript
useEffect(() => {
    const debounceTimer = setTimeout(() => {
        fetchTasks(); // Only fetch after 500ms of no typing
    }, 500);
    return () => clearTimeout(debounceTimer); // Cancel if user keeps typing
}, [searchTerm]);
```

### 4. The Result
As you type in the search bar, the task list filters in real-time. It feels instant but is actually optimized to reduce unnecessary API calls.

This completes the "Data Power Trifecta": **Filter + Sort + Search**.

---

## 📅 Entry 9: Kanban Board (Trello-Style Drag & Drop) 📊
**Added:** Feature 9

### 1. The Vision
You wanted a **visual** way to manage tasks, moving them between columns like Trello.

### 2. The Technology: @dnd-kit
We installed `@dnd-kit`, a modern, lightweight drag-and-drop library.
**Why not react-beautiful-dnd?** It's deprecated. @dnd-kit is the new standard.

### 3. The Implementation
**A. Created `KanbanBoard.jsx` Component**
- Three columns: Pending ⏸️ | In Progress ▶️ | Completed ✅
- Each column uses `SortableContext` to make tasks draggable
- The `DndContext` wraps everything and handles the drag events

**B. Drag-and-Drop Logic**
When you drag a task to a different column:
```javascript
const handleDragEnd = (event) => {
    const taskId = active.id;
    const newStatus = over.id; // Column ID = Status name
    onStatusChange(taskId, newStatus); // PUT request to update
};
```

**C. View Toggle**
We added a toggle button: 📋 List | 📊 Kanban
- Preserves all existing features (search, filters, dark mode)
- You can switch views anytime

### 4. The Result
Click "Kanban" mode and drag tasks between columns. The backend updates instantly via PUT requests to `/api/tasks/:id`.

This is a **major UI evolution** - your app now rivals professional SaaS products!

### 5. Bug Fix: Droppable Zones
**Problem:** Dragging tasks between columns didn't work initially.
**Root Cause:** Columns weren't registered as droppable zones.
**Solution:** Added `useDroppable` hook to `KanbanColumn`:
```javascript
const { setNodeRef } = useDroppable({ id: status });
// Then connect: <div ref={setNodeRef}>
```
**Why it matters:** @dnd-kit requires explicit droppable registration for cross-container dragging.

### 6. Bug Fix: Error Handling
**Problem:** "Error updating stats" alert when dragging tasks.
**Root Cause:** Stats fetch was failing but blocking UI with aggressive error alerts.
**Solution:** 
1. Made `fetchStats` fail silently (logs to console instead of alert)
2. Added better error handling in `handleStatusChange` with specific messages
3. Force refresh on error to show current state

**Files Changed:**
- `Dashboard.jsx` line 40-48: Improved `fetchStats` error handling
- `Dashboard.jsx` line 133-143: Enhanced `handleStatusChange` with detailed errors

### 7. Bug Fix: Status Validation Error
**Problem:** Error: "status: `694c2ad6b09d81571ff70750` is not a valid enum value"
**Root Cause:** When dropping a task ON another task (not empty space), `over.id` was the target task's MongoDB ID, not the column status.
**Solution:** Smart detection in `handleDragEnd`:
```javascript
let newStatus = over.id;
// If over.id looks like a MongoDB ID (24 chars), it's a task
if (over.id.length === 24) {
    const targetTask = tasks.find(t => t._id === over.id);
    newStatus = targetTask.status; // Get the column it's in
}
```

**Files Changed:**
- `KanbanBoard.jsx` line 165-202: Intelligent column detection logic
- Added validation to ensure status is one of: 'pending', 'in-progress', 'completed'

---

## 📅 Entry 10: Lofi Music Player (Tokyo Inspired) 🎵🌸
**Added:** Feature 10

### 1. The Vision
Create an ambient work environment inspired by Tokyo/Japan anime aesthetic with curated lofi music streams.

### 2. The Design Philosophy
**Tokyo/Anime Aesthetic:**
- Pink gradient backgrounds (#ffeef8 → #ffe4f1 in light mode)
- Purple/dark gradients in dark mode (#2a1a2e → #1a1a2e)
- Sakura (cherry blossom) pink accents (#ffb3d9, #ff6b9d)
- Japanese emoji station indicators (🌸 🎌 🏮)
- Smooth animations and rounded corners

### 3. The Implementation
**A. Created `LofiPlayer.jsx` Component**
- Floating widget positioned bottom-right (fixed positioning)
- Two states: Minimized (compact) and Expanded (full player)
- YouTube iframe embedding for live lofi streams
- Three curated stations with Japanese themes

**B. Station Selection**
```javascript
const lofiStreams = [
    { name: '🌸 Tokyo Lofi', id: 'jfKfPfyJRdk', emoji: '🌸' },
    { name: '🎌 Anime Chill', id: '4xDzrJKXOOY', emoji: '🎌' },
    { name: '🏮 Sakura Beats', id: 'DWcJFNfaw9c', emoji: '🏮' }
];
```

**C. Minimized vs Expanded**
- **Minimized (180px)**: Shows emoji, station name, click to expand
- **Expanded (320px)**: Full YouTube player + station switcher buttons
- Click header bar to toggle states

**D. Theme Integration**
- Fully responsive to Dark Mode toggle
- Uses `ThemeContext` for color consistency
- Pink gradients in light, purple in dark

### 4. Technical Details
**Files Created:**
- `client/src/components/LofiPlayer.jsx` (150 lines)

**Files Modified:**
- `Dashboard.jsx` line 5: Added import `import { LofiPlayer } from '../components/LofiPlayer';`
- `Dashboard.jsx` line 369: Rendered `<LofiPlayer />` component

**YouTube Integration:**
- Uses iframe embed with `autoplay=0` (user must click play)
- `modestbranding=1` for cleaner look
- Full controls available in iframe

### 5. User Experience
**How to Use:**
1. Look for floating widget in bottom-right corner
2. Click header to expand full player
3. Choose from 3 lofi stations using emoji buttons
4. Click play on YouTube player to start music
5. Minimize when you want it out of the way
6. Works perfectly with all other features (Kanban, Dark Mode, etc.)

**Why It's Special:**
- Non-intrusive (always accessible but not blocking)
- Aesthetic matches Tokyo/anime vibes
- Curated high-quality streams (Lofi Girl official channels)
- Enhances focus during work sessions

---

## 📅 Entry 11: Pomodoro Focus Timer ⏱️💪
**Added:** Feature 11

### 1. The Technique
The **Pomodoro Technique** is a proven time management method:
- 🍅 Work for 25 minutes (focused, no distractions)
- ☕ Take a 5 minute break
- 🔁 Repeat
- 📊 Track how many "pomodoros" you complete

**Why it works:** Our brains focus best in short bursts. Breaks prevent burnout.

### 2. The Implementation

**A. Timer Logic (useState + useEffect + setInterval)**
```javascript
const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
const [isRunning, setIsRunning] = useState(false);

useEffect(() => {
    if (isRunning && timeLeft > 0) {
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1); // Decrement every second
        }, 1000);
    }
    return () => clearInterval(intervalRef.current); // Cleanup!
}, [isRunning, timeLeft]);
```

**Key Concepts:**
- `useRef` to store interval ID (survives re-renders)
- Cleanup function to prevent memory leaks
- Real-time countdown updates

**B. Session Management**
```javascript
const [isWorkSession, setIsWorkSession] = useState(true);
const [completedSessions, setCompletedSessions] = useState(0);

const handleSessionComplete = () => {
    if (isWorkSession) {
        setCompletedSessions(prev => prev + 1); // Track productivity
        setIsWorkSession(false); // Switch to break
        setTimeLeft(5 * 60);
    } else {
        setIsWorkSession(true); // Back to work
        setTimeLeft(25 * 60);
    }
};
```

**C. Browser Notifications**
When a session completes:
```javascript
if (Notification.permission === 'granted') {
    new Notification('🎉 Work Session Complete!', {
        body: 'Take a 5 minute break. You earned it!'
    });
}
```
**Permission requested** on first "Start" click.

**D. Sound Notification (Web Audio API)**
```javascript
const playNotificationSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = 800; // Pleasant beep
    oscillator.type = 'sine';
    // ... play for 0.5 seconds
};
```
**Why:** Even if browser tab isn't focused, you hear when time's up!

### 3. Design Choices

**Color Palette (Focus/Calm Theme):**
- **Light Mode:** Blue gradient (#e3f2fd → #bbdefb) - Calming, focus
- **Dark Mode:** Deep blue (#1a237e → #0d47a1) - Night-friendly
- **Work Sessions:** Orange badge (#ff6f00) - Alert, active
- **Break Sessions:** Green badge (#4caf50) - Relaxing, refresh

**Position:** Bottom-left (opposite of lofi player for balance)

**Minimized vs Expanded:**
- **Minimized (200px):** Shows time + session type
- **Expanded (280px):** Full controls, progress bar, session counter

### 4. Controls Explained

**▶️ Start:** 
- Begins countdown
- Requests notification permission (first time only)

**⏸️ Pause:** 
- Freezes timer (life happens!)

**🔄 Reset:** 
- Resets to start of current session (25min or 5min)

**⏭️ Skip:** 
- Jump to next session type
- Work → Break or Break → Work

**Progress Bar:**
- Visual representation of time elapsed
- Orange (work) or Green (break)

### 5. Technical Highlights

**Files Created:**
- `client/src/components/PomodoroTimer.jsx` (330 lines)

**Files Modified:**
- `Dashboard.jsx` line 6: Added import
- `Dashboard.jsx` line 380: Rendered component

**Browser APIs Used:**
1. **Notification API** - Desktop alerts
2. **Web Audio API** - Sound generation
3. **setInterval** - Timer mechanism

**React Patterns:**
- useRef for interval persistence
- useEffect cleanup to prevent leaks
- Conditional rendering for states
- Derived state (progress calculation)

### 6. User Flow

1. **First Use:** Click "▶️ Start" → Browser asks for notification permission
2. **Work:** Timer counts down from 25:00
3. **Session End:** Beep sound + notification "Work Complete!"
4. **Auto-Switch:** Changes to 5:00 break timer
5. **Track:** Session counter increments
6. **Repeat:** After break, new 25min work session

### 7. Perfect Pairing

**Pomodoro + Lofi Music = Ultimate Productivity Setup** 🎵⏱️
1. Play lofi music (bottom-right widget)
2. Start pomodoro timer (bottom-left widget)
3. Work in focused 25min bursts with ambient music
4. Take breaks to stretch, hydrate, reflect

---

## 📅 Entry 12: Sakura Celebration (Cherry Blossom Magic) 🌸✨
**Added:** Feature 12

### 1. The Tokyo Spirit
In Japanese culture, cherry blossoms (sakura) symbolize the **beauty of accomplishment** and **fleeting moments of success**. We celebrate every achievement, no matter how small!

### 2. What Happens
When you complete a task or finish a pomodoro work session:
1. 🌸 **30 cherry blossom petals** fall across the screen
2. 🎌 **Japanese motivational quote** appears in the center
3. 🔔 **Gentle wind chime sound** plays (C major chord - peaceful & uplifting)
4. ⏱️ **5 second celebration** then fades away

### 3. The Implementation

**A. Celebration Trigger**
Uses global custom event system:
```javascript
// Trigger from anywhere in the app
celebrateSakura();

// Internally dispatches:
window.dispatchEvent(new Event('sakuraCelebration'));
```

**B. Cherry Blossom Animation (CSS Keyframes)**
Each of the 30 petals has:
- Random horizontal position (0-100%)
- Random fall duration (3-5 seconds)
- Random size (15-25px)
- Swaying motion while falling
- Pink gradient coloring (#ffb3d9 → #ffc0e0 → #ff9ac9)

```css
@keyframes fall {
    to { top: 110%; opacity: 0; }
}

@keyframes sway {
    0%, 100% { transform: translateX(0) rotate(45deg); }
    50% { transform: translateX(30px) rotate(90deg); }
}
```

**C. Japanese Quotes**
8 curated motivational phrases:
- 素晴らしい仕事！(Subarashii shigoto!) - Excellent work!
- 頑張りました！(Ganbarimashita!) - You did your best!
- 完璧！(Kanpeki!) - Perfect!
- お疲れ様でした！(Otsukaresama deshita!) - Good job, you're done!
- And 4 more...

**Format:**
```
[Japanese] 素晴らしい仕事！
[Romaji]  Subarashii shigoto!
[English] Excellent work!
```

**D. Sound Effect (Web Audio API)**
Creates a C major chord (peaceful & uplifting):
- C5 (523.25 Hz)
- E5 (659.25 Hz)  
- G5 (783.99 Hz)

Staggered by 0.1s each for wind chime effect.

### 4. Integration Points

**When It Triggers:**
1. ✅ **Creating a new task** - `Dashboard.jsx` line 105
2. ✅ **Completing pomodoro work session** - `PomodoroTimer.jsx` line 42

**How to Add More Triggers:**
Just call `celebrateSakura()` anywhere! Examples:
- When marking task as "completed"
- When deleting a task
- When achieving a milestone (10 tasks, etc.)

### 5. Technical Details

**Files Created:**
- `client/src/components/SakuraCelebration.jsx` (250 lines)

**Files Modified:**
- `Dashboard.jsx` line 7: Import celebrateSakura
- `Dashboard.jsx` line 105: Trigger on task creation
- `Dashboard.jsx` line 391: Render component
- `PomodoroTimer.jsx` line 3: Import celebrateSakura
- `PomodoroTimer.jsx` line 42: Trigger on work session end

**CSS Animations:**
- `fadeIn` - Overlay appearance
- `fall` - Petals falling
- `sway` - Horizontal swaying
- `popIn` - Quote card entrance (bounce effect)

**React Patterns:**
- Custom event listeners
- Dynamic array generation for petals
- Conditional rendering (only visible during celebration)
- Timed auto-hide (5 second cleanup)

### 6. Design Philosophy

**Tokyo Aesthetic:**
- **Color:** Sakura pink (#ffb3d9, #ff9ac9) - quintessential Japan
- **Motion:** Gentle, flowing - like real petals in spring breeze
- **Sound:** Wind chimes - common in Japanese temples
- **Text:** Actual Japanese characters - authentic cultural touch

**Psychology:**
- **Positive reinforcement:** Celebrate every win
- **Dopamine trigger:** Visual + audio reward
- **Cultural enrichment:** Learn Japanese phrases
- **Mindfulness:** Pause to appreciate accomplishment

### 7. User Experience

**Perfect Balance:**
- 🚫 **Not annoying:** Only 5 seconds, then gone
- ✅ **Meaningful:** Marks genuine achievements
- ✅ **Beautiful:** Tokyo spring vibes
- ✅ **Educational:** Learn Japanese words

**The Magic Moment:**
Complete a task → Screen fills with falling sakura → Japanese quote appears → Wind chime sounds → You smile 😊

---

## 📅 Entry 13: Japanese Time-Based Greetings 🎌⏰
**Added:** Feature 13

### 1. The Cultural Touch
In Japan, greetings change throughout the day based on time. This teaches you authentic Japanese phrases naturally!

### 2. The Greetings

**🌅 Morning (5am-10am):**
- **Japanese:** おはようございます
- **Romaji:** Ohayō gozaimasu  
- **English:** Good morning

**☀️ Afternoon (10am-5pm):**
- **Japanese:** こんにちは
- **Romaji:** Konnichiwa
- **English:** Good afternoon

**🌆 Evening (5pm-7pm):**
- **Japanese:** こんばんは
- **Romaji:** Konbanwa
- **English:** Good evening

**🌙 Night (7pm-5am):**
- **Japanese:** お疲れ様です
- **Romaji:** Otsukaresama desu
- **English:** Thank you for your hard work

### 3. Implementation

**Time Detection:**
```javascript
const getJapaneseGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 10) return { jp: 'おはようございます', ... };
    else if (hour >= 10 && hour < 17) return { jp: 'こんにちは', ... };
    // ... etc
};
```

**Display Format:**
```
おはようございます (Ohayō gozaimasu)
Good morning, [Your Name]
```

### 4. Why It's Special
- **Cultural Learning:** Pick up Japanese phrases organically
- **Dynamic:** Changes automatically based on time
- **Respectful:** Uses polite Japanese forms
- **Personal:** Still includes your name

**Files Modified:**
- `Dashboard.jsx` line 43-60: Added greeting function
- `Dashboard.jsx` line 211-220: Updated header display

---

## 📅 Entry 14: Focus Mode (Zen Productivity) 🧘🎯
**Added:** Feature 14

### 1. The Concept
Japanese concept of **集中** (shūchū) - deep, undistracted focus.

### 2. What It Does
Click "🧘 Focus Mode" button:
- 🌑 **Darkens entire screen** (85% black overlay + blur)
- 🎯 **Shows Zen message:** 集中 (Focus) in large text
- ⌨️ **Keyboard shortcut:** Press Escape to exit
- 👆 **Click anywhere** to exit

### 3. The Experience
Everything fades away. Just you and the word "Focus" in Japanese.

**Visual:**
- Large meditation emoji 🧘
- Kanji: 集中 (72px, bold)
- Romaji: Shūchū
- Subtle pink glow border

### 4. Implementation

**State:**
```javascript
const [isFocusMode, setIsFocusMode] = useState(false);
```

**Overlay:**
```javascript
{isFocusMode && (
    <div style={{
        position: 'fixed',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)', // Gaussian blur
        zIndex: 9997
    }}>
        {/* Zen message */}
    </div>
)}
```

**Keyboard Support:**
```javascript
useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isFocusMode) {
            setIsFocusMode(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [isFocusMode]);
```

---

## 📅 Entry 15: Subtasks (Checkbox System) 📋
**Added:** Feature 15

### 1. The Backend Change (`back/src/models/Task.js`)
**Goal**: Allow tasks to store a list of smaller "to-do" items.

**The Code We Added**:
```javascript
subTasks: [
    {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }
]
```

### 2. The Frontend Architecture
We implemented a robust system to manage subtasks in both List and Kanban views.

**A. Form Logic (Dashboard.jsx)**
- Added `subTasks` array state to manage pending items.
- Built `handleAddSubTask` and `handleRemoveSubTask` for dynamic form interaction.

**B. Interactive Toggling**
- `handleToggleSubtask` allows clicking a individual subtask checkbox.
- **Persistence**: It immediately sends a `PUT` request to update the specific task's `subTasks` array in the database.

### 3. Cross-View Integration
- **List View**: Subtasks appear as a nested checklist with line-through animation when completed.
- **Kanban Board**: Subtasks are visible on cards, allowing users to track progress without leaving the board.

### 4. Why This Matters?
Complex projects (like "Build a Website") are overwhelming. **Subtasks** allow users to break them down into manageable pieces (Front-end, Backend, Deployment), which is the key to actual productivity.

### 5. Use Cases
- **Before deep work:** Enter focus mindset
- **Overwhelmed by UI:** Simplify everything
- **Mindful break:** Pause and center yourself
- **Ritual:** Mark transition into work mode

### 6. Technical Details

**Files Modified:**
- `Dashboard.jsx` line 45: Added `isFocusMode` state
- `Dashboard.jsx` line 116-125: Keyboard listener for Escape
- `Dashboard.jsx` line 222-233: Focus Mode toggle button
- `Dashboard.jsx` line 424-457: Focus Mode overlay component

**CSS Effects:**
- `backdropFilter: blur(10px)` - Blurs background
- `rgba(0, 0, 0, 0.85)` - 85% black tint
- `fadeIn` animation - Smooth entrance

**Accessibility:**
- Click anywhere to exit (forgiving UX)
- Escape key shortcut (expected behavior)
- Clear instructions shown

### 7. Philosophy
**Not a feature blocker** - It's a **mindset tool**. 

In Japanese work culture, there's a moment of preparation before focused work. Focus Mode honors that ritual.

---

## 📅 Entry 15: Quick Stats Widget 📊⚡
**Added:** Feature 15

### 1. The Productivity Dashboard
A glanceable floating widget showing real-time productivity metrics without leaving your focus.

### 2. What It Shows

**Today's Completed Tasks:**
- Large number display
- Updates in real-time as you complete tasks
- Motivates you to hit daily goals

**Current Streak:** 🔥
- Consecutive days you've completed at least 1 task
- Persists in localStorage
- Auto-increments daily
- Resets if you skip a day

**This Week Overview:**
- Completed vs Total tasks (e.g., 12/18)
- Last 7 days rolling window
- Progress visualization

### 3. Implementation

**A. Streak Logic (Lines 35-68):**
```javascript
const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActiveDate = localStorage.getItem('lastActiveDate');
    const currentStreak = parseInt(localStorage.getItem('taskStreak') || '0');
    
    if (lastActiveDate === yesterday) {
        // Continue streak
        newStreak = currentStreak + 1;
    } else {
        // Streak broken, start new
        newStreak = 1;
    }
};
```

**Key Concepts:**
- **localStorage persistence** - Survives page refresh
- **Date comparison** - Check yesterday vs today
- **Auto-update** - React to task changes via useEffect

**B. Today's Count (Lines 10-17):**
```javascript
const getTodayCompleted = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => {
        if (task.status !== 'completed') return false;
        const taskDate = new Date(task.updatedAt).toDateString();
        return taskDate === today;
    }).length;
};
```

**C. Weekly Stats (Lines 19-33):**
```javascript
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.updatedAt);
    return taskDate >= weekAgo;
});
```
**Math:** 7 days * 24 hours * 60 min * 60 sec * 1000 ms = 1 week in milliseconds

### 4. Design Choices

**Position:** Top-right corner
- Doesn't block main content
- Always visible
- Near lofi player (productivity zone)

**Colors:** Green gradient
- Light mode: #e8f5e9 → #c8e6c9 (fresh, growth)
- Dark mode: #1b5e20 → #2e7d32 (forest green)
- **Why green?** Progress, achievement, growth

**Minimizable:**
- Compact: 60px wide (just 📊 icon)
- Expanded: 200px wide (full stats)
- Click header to toggle

### 5. Technical Details

**Files Created:**
- `client/src/components/QuickStatsWidget.jsx` (180 lines)

**Files Modified:**
- `Dashboard.jsx` line 8: Added import
- `Dashboard.jsx` line 496: Rendered `<QuickStatsWidget tasks={tasks} />`

**Props:**
- `tasks` - Array of all tasks (auto-updates on changes)

**localStorage Keys:**
- `taskStreak` - Current streak number
- `lastActiveDate` - Last day you completed a task

**React Patterns:**
- Props down (tasks array)
- useEffect hook responds to task changes
- Derived state (calculations from tasks)

### 6. User Experience

**Motivational Loop:**
1. Complete a task → See today's count increase
2. First task of day → Streak increments 🔥
3. Week progresses → Watch weekly ratio improve
4. Gamification → Don't break the streak!

**Psychology:**
- **Immediate feedback** - See progress instantly
- **Streak mechanic** - Duolingo-style motivation
- **Non-intrusive** - Minimizable when focused

### 7. Streak Rules

**Streak continues if:**
- You complete at least 1 task today
- AND you completed at least 1 task yesterday

**Streak breaks if:**
- You skip a full day (no completions)

**Example:**
- Monday: Complete 3 tasks → Streak = 1
- Tuesday: Complete 1 task → Streak = 2
- Wednesday: Skip → Streak = 0 (reset)
- Thursday: Complete 2 tasks → Streak = 1 (new start)

---

## 📅 Entry 16: Traditional Japanese Color Themes 🎨🇯🇵
**Added:** Feature 16

### 1. The Cultural Palette
Move beyond standard light/dark. Experience authentic Edo-period Japanese color aesthetics.

### 2. The Five Themes

**🌸 Sakura (桜) - Cherry Blossom Spring**
- **Background:** Soft pink (#fff5f7)
- **Accent:** Rose pink (#ff6b9d)
- **Vibe:** Delicate, feminine, hopeful
- **Season:** Spring (March-May)
- **Cultural:** Cherry blossoms symbolize renewal and beauty

**🍵 Matcha (抹茶) - Tea Ceremony Green**
- **Background:** Pale green (#f4f7eb)
- **Accent:** Tea green (#7fa832)
- **Vibe:** Calm, focused, zen
- **Use Case:** Perfect for study/work sessions
- **Cultural:** Matcha tea ceremony represents mindfulness

**🎨 Indigo (藍) - Traditional Dye Blue**
- **Background:** Sky blue (#e8f2f7)
- **Accent:** Deep indigo (#2e5c8a)
- **Vibe:** Professional, trustworthy, cool
- **Historical:** Indigo dye was precious in medieval Japan
- **Cultural:** Used in samurai clothing

**🍁 Momiji (紅葉) - Autumn Maple Leaves**
- **Background:** Warm cream (#fff5e6)
- **Accent:** Burnt red (#d9543a)
- **Vibe:** Cozy, nostalgic, warm
- **Season:** Autumn (September-November)
- **Cultural:** Autumn leaf viewing (紅葉狩り) tradition

**🖤 Sumi (墨) - Ink Wash Black**
- **Background:** Light grey (#f5f5f5)
- **Accent:** Charcoal (#4a4a4a)
- **Vibe:** Minimalist, elegant, timeless
- **Art Form:** Sumi-e (ink wash painting)
- **Cultural:** Zen Buddhist art tradition

### 3. Implementation

**Theme Structure:**
```javascript
const themeDefinitions = {
    sakura: {
        name: '桜 Sakura',
        description: 'Cherry Blossom Spring',
        background: '#fff5f7',
        text: '#4a1e2c',
        cardBg: '#ffe4e8',
        cardBorder: '#ffb3c1',
        accent: '#ff6b9d',
        // ... + gradients
    },
    // ... 4 more themes
};
```

**Theme Selector:**
```javascript
<select value={theme} onChange={(e) => changeTheme(e.target.value)}>
    <option value="sakura">🌸 桜 Sakura</option>
    {/* ... other themes */}
</select>
```

**Persistence:**
- Saved to `localStorage.getItem('theme')`
- Default: Sakura (most popular)
- Loads on page refresh

### 4. Design Choices

**Gradients:**
Each theme has subtle background gradient for depth:
```css
background: linear-gradient(135deg, #lighter 0%, #darker 100%)
```

**Smooth Transitions:**
```css
transition: all 0.5s ease
```
All colors fade smoothly when switching (0.5 second duration)

**Emoji Icons:**
- 🌸 Sakura
- 🍵 Matcha
- 🎨 Indigo
- 🍁 Momiji
- 🖤 Sumi

Visual identification at a glance!

**Dropdown Separator:**
```
──────
```
Separates traditional themes from modern (light/dark)

### 5. Technical Details

**Files Modified:**
- `ThemeContext.jsx` - Complete rewrite (+115 lines)
- `Dashboard.jsx` line 13: Added `changeTheme, themeDefinitions` to context
- `Dashboard.jsx` lines 270-288: Theme selector dropdown

**New Context API:**
- `changeTheme(themeName)` - Switch to any theme
- `themeDefinitions` - All theme objects
- `colors` - Current theme's colors

**Backward Compatibility:**
- Kept `toggleTheme()` function (light ↔ dark)
- Kept `light` and `dark` themes
- Old code still works!

### 6. Color Psychology

**Work Sessions:**
- **Matcha** - Best for focus (green = concentration)
- **Indigo** - Professional work (corporate blue)
- **Sumi** - Minimalist focus (no distractions)

**Creative Sessions:**
- **Sakura** - Brainstorming, ideation (pink = creativity)
- **Momiji** - Warm, comfortable (autumn coziness)

**Mood Matching:**
- Happy/Energetic → Sakura
- Calm/Focused → Matcha or Indigo
- Cozy/Relaxed → Momiji
- Serious/Minimal → Sumi

### 7. Cultural Notes

**Edo Period (1603-1868):**
These colors were popular in Japan's golden age:
- **Sakura pink** - Spring festivals
- **Matcha green** - Tea ceremonies formalized
- **Indigo** - Common fabric dye (expensive!)
- **Maple red** - Poetry about autumn
- **Sumi black** - Zen art flourished

**四季 (Shiki) - Four Seasons:**
Japanese culture deeply values seasonal changes. These themes let you match your workspace to the season!

---


---

## 📅 Entry 17: Tokyo/Anime Theme Expansion 🏙️⛩️🌧️
**Added:** Feature 16

### 1. New Immersive Themes
We added three high-atmosphere themes that transform the entire app's character.

**🏙️ Akihabara Neon**
- **Vibe:** High-energy electric nights.
- **Colors:** Deep purple base with cyan text and magenta glowing borders.
- **Visuals:** Double-layered glow effects for a "neon sign" aesthetic.

**⛩️ Kyoto Sunset**
- **Vibe:** Tranquil evening at a shrine.
- **Colors:** Deep plum backgrounds with warm orange text and crimson highlights.
- **Visuals:** Soft warm glow that mimics sunset lighting.

**🌧️ Shinjuku Rain**
- **Vibe:** Moody, productive rainy day in the city.
- **Colors:** Cool charcoals and deep blues with soft lavender-blue text.
- **Visuals:** Dimmed glow effects for a subtle "rain-slicked" look.

### 2. Dynamic Glow System
- **Prop:** Added `glow` property to all themes in `ThemeContext.jsx`.
- **Implementation:** Task cards and stats widgets now use `boxShadow: colors.glow`.
- **Result:** The UI feels "alive" and reactive as you switch themes.

### 3. technical Details
- **Files Modified:** `ThemeContext.jsx`, `Dashboard.jsx`, `KanbanBoard.jsx`.
- **Transitions:** Added `transition: all 0.3s` to cards for smooth theme switching.

---

## 📅 Entry 20: Anime Legends Collection 🦊⚔️🏴‍☠️
**Added:** Feature 19
- **Naruto**: 🍥 Will of Fire orange.
- **One Piece**: 👒 Grand Line blue/gold.
- **Demon Slayer**: 👘 Charcoal/Wisteria.

## 📅 Entry 21: Calm Collection Vol 2 🪻🌲🌫️
**Added:** Feature 20
- **Lavender Field**: 🫧 Quiet Purple.
- **Midnight Forest**: 🌚 Deep Green.
- **Morning Mist**: ☁️ Pale Blue.

## 📅 Entry 22: Aesthetic Emoji Overhaul 💮🕯️🌙
**Added:** Feature 21
- Replaced all character/theme emojis with curated minimalist symbols.
- Unified theme naming convention (removed double-icons).

## 📅 Entry 23: Complete UI Symbol Triage ꩜✧☷▦𓏢
**Added:** Feature 21
- **Focus Mode**: ꩜ / ✧
- **List/Kanban**: ☷ / ▦
- **Lofi/Pomodoro**: 𓏢 / ꩜
- **Stats/Streak**: ✦ / ⚡
- **UI Actions**: ✎ (Edit), ✦ (Add), ˗ (Delete).
```
