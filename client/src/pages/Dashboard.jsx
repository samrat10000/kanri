import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { LofiPlayer } from '../components/LofiPlayer';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { SakuraCelebration, celebrateSakura } from '../components/SakuraCelebration';
import { QuickStatsWidget } from '../components/QuickStatsWidget';
import { ZenHabitTracker } from '../components/ZenHabitTracker';
import { BrainDumpNotepad } from '../components/BrainDumpNotepad';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const { theme, toggleTheme, changeTheme, colors, themeDefinitions } = useContext(ThemeContext); // Use ThemeContext
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('pending');
    const [priority, setPriority] = useState('low');

    // const [priority, setPriority] = useState('low');

    // NEW: Due Date State
    const [dueDate, setDueDate] = useState('');

    // NEW: Filter State
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // NEW: Sort State
    const [sort, setSort] = useState('-createdAt'); // Default: Newest first

    // NEW: Search State
    const [searchTerm, setSearchTerm] = useState('');

    // NEW: Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);

    // NEW: Stats State
    const [stats, setStats] = useState([]);

    // NEW: View Mode State (List vs Kanban)
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'

    // NEW: Focus Mode State
    const [isFocusMode, setIsFocusMode] = useState(false);

    // NEW: Subtasks State
    const [subTasks, setSubTasks] = useState([]);
    const [subTaskInput, setSubTaskInput] = useState('');

    // NEW: Zen Popover States (Option A)
    const [showLofi, setShowLofi] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showHabits, setShowHabits] = useState(false);
    const [showNotepad, setShowNotepad] = useState(false);

    // NEW: Japanese Greeting (time-based)
    const getJapaneseGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 10) {
            return { jp: 'おはようございます', romaji: 'Ohayō gozaimasu', en: 'Good morning' };
        } else if (hour >= 10 && hour < 17) {
            return { jp: 'こんにちは', romaji: 'Konnichiwa', en: 'Good afternoon' };
        } else if (hour >= 17 && hour < 19) {
            return { jp: 'こんばんは', romaji: 'Konbanwa', en: 'Good evening' };
        } else {
            return { jp: 'お疲れ様です', romaji: 'Otsukaresama desu', en: 'Thank you for your hard work' };
        }
    };

    const greeting = getJapaneseGreeting();

    // Fetch Stats
    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/stats');
            setStats(res.data.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
            // Don't alert, just log - stats are non-critical
            // Set empty array so UI doesn't break
            setStats([]);
        }
    };

    // Fetch Tasks (Now with Filters, Sort & Search!)
    const fetchTasks = async () => {
        try {
            // Build Query String
            let query = '/api/tasks?';
            if (filterStatus !== 'all') query += `status=${filterStatus}&`;
            if (filterPriority !== 'all') query += `priority=${filterPriority}&`;
            if (searchTerm) query += `search=${searchTerm}&`;

            // Add Sort Param
            query += `sort=${sort}&`;

            const res = await axios.get(query);
            setTasks(res.data.data);

            // Refresh stats whenever we fetch tasks (to keep counts in sync)
            fetchStats();
        } catch (err) {
            console.error(err);
        }
    };

    // Refetch when filters, sort, or search change
    useEffect(() => {
        // Debouncing: Wait 500ms after user stops typing before searching
        const debounceTimer = setTimeout(() => {
            fetchTasks();
            // Initial stats load
            fetchStats();
        }, 500);

        // Cleanup: Cancel previous timer if user keeps typing
        return () => clearTimeout(debounceTimer);
    }, [filterStatus, filterPriority, sort, searchTerm]);

    // Keyboard shortcut for Focus Mode (Escape)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFocusMode) {
                setIsFocusMode(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocusMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskData = { title, status, priority, dueDate };

        try {
            if (isEditing) {
                // UPDATE
                await axios.put(`/api/tasks/${currentTaskId}`, { ...taskData, subTasks });
                setIsEditing(false);
                setCurrentTaskId(null);
            } else {
                // CREATE
                await axios.post('/api/tasks', { ...taskData, subTasks });

                // Celebrate with sakura animation!
                celebrateSakura();
            }

            // Reset form
            setTitle('');
            setStatus('pending');
            setPriority('low');
            setDueDate('');
            setSubTasks([]);
            setSubTaskInput('');

            fetchTasks(); // Refresh list
        } catch (err) {
            alert('Error saving task');
        }
    };

    // Populate Form for Editing
    const handleEditClick = (task) => {
        setIsEditing(true);
        setCurrentTaskId(task._id);
        setTitle(task.title);
        setStatus(task.status);
        setPriority(task.priority);
        setSubTasks(task.subTasks || []);
        // Format date for input (YYYY-MM-DD)
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');

        // Scroll to top
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            alert('Error deleting');
        }
    };

    // NEW: Handle Status Change (for Kanban drag-and-drop)
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            // Update task status
            await axios.put(`/api/tasks/${taskId}`, { status: newStatus });

            // Refresh tasks (which also refreshes stats)
            await fetchTasks();
        } catch (err) {
            console.error('Error updating task:', err);
            // More specific error message
            if (err.response) {
                alert(`Error: ${err.response.data.error || 'Failed to update task'}`);
            } else {
                alert('Network error - could not update task');
            }
            // Force refresh even on error to show current state
            fetchTasks();
        }
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    // Helper to check if overdue
    const isOverdue = (dateString, taskStatus) => {
        if (!dateString || taskStatus === 'completed') return false;
        return new Date(dateString) < new Date(); // True if date is in the past
    };

    const getPriorityColor = (p) => {
        if (p === 'high') return '#ffcccc'; // Red-ish
        if (p === 'medium') return '#fff4cc'; // Yellow-ish
        return '#f0f0f0'; // Gray (Low)
    };

    // NEW: Subtask Helpers
    const handleAddSubTask = () => {
        if (!subTaskInput.trim()) return;
        setSubTasks([...subTasks, { title: subTaskInput, completed: false }]);
        setSubTaskInput('');
    };

    const handleRemoveSubTask = (index) => {
        const newSubTasks = subTasks.filter((_, i) => i !== index);
        setSubTasks(newSubTasks);
    };

    const handleToggleSubTask = async (taskId, subTaskIndex) => {
        try {
            const task = tasks.find(t => t._id === taskId);
            const newSubTasks = [...task.subTasks];
            newSubTasks[subTaskIndex].completed = !newSubTasks[subTaskIndex].completed;

            await axios.put(`/api/tasks/${taskId}`, { subTasks: newSubTasks });
            fetchTasks(); // Refresh to show new state
        } catch (err) {
            console.error("Error toggling subtask:", err);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', background: colors.background, color: colors.text, minHeight: '100vh', transition: 'all 0.3s' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '10px',
                position: 'sticky',
                top: '0',
                background: colors.background,
                zIndex: 1000,
                paddingBottom: '15px',
                borderBottom: `1px solid ${colors.cardBorder}44`,
                backdropFilter: 'blur(10px)'
            }}>
                <div>
                    <h1 style={{ margin: 0, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '48px' }}>🎋</span>
                        <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '2px' }}>KANRI</span>
                    </h1>
                    {/* Japanese Time-Based Greeting */}
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        <span style={{ fontWeight: 'bold', color: colors.text }}>{greeting.jp}</span>
                        {' '}
                        <span style={{ fontSize: '12px', fontStyle: 'italic', opacity: 0.7 }}>({greeting.romaji})</span>
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>{greeting.en}, {user && user.name}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Focus Mode Toggle */}
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        style={{
                            padding: '8px 15px',
                            cursor: 'pointer',
                            background: isFocusMode ? '#ff6b9d' : 'transparent',
                            border: `2px solid ${isFocusMode ? '#ff6b9d' : colors.text}`,
                            color: isFocusMode ? 'white' : colors.text,
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isFocusMode ? '꩜ Exit Focus' : '✧ Focus Mode'}
                    </button>

                    {/* Zen Trigger Icons */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
                        <button
                            onClick={() => { setShowStats(!showStats); setShowLofi(false); setShowTimer(false); }}
                            style={{ background: showStats ? colors.accent : 'transparent', border: `1px solid ${colors.cardBorder}`, color: showStats ? colors.background : colors.text, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            title="Stats"
                        >
                            𓍯
                        </button>
                        <button
                            onClick={() => { setShowLofi(!showLofi); setShowTimer(false); setShowStats(false); }}
                            style={{ background: showLofi ? colors.accent : 'transparent', border: `1px solid ${colors.cardBorder}`, color: showLofi ? colors.background : colors.text, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            title="Lofi Radio"
                        >
                            𓏢
                        </button>
                        <button
                            onClick={() => { setShowTimer(!showTimer); setShowLofi(false); setShowStats(false); setShowHabits(false); setShowNotepad(false); }}
                            style={{ background: showTimer ? colors.accent : 'transparent', border: `1px solid ${colors.cardBorder}`, color: showTimer ? colors.background : colors.text, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            title="Pomodoro Timer"
                        >
                            ꩜
                        </button>
                        <button
                            onClick={() => { setShowHabits(!showHabits); setShowLofi(false); setShowTimer(false); setShowStats(false); setShowNotepad(false); }}
                            style={{ background: showHabits ? colors.accent : 'transparent', border: `1px solid ${colors.cardBorder}`, color: showHabits ? colors.background : colors.text, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            title="Zen Habits"
                        >
                            🌿
                        </button>
                        <button
                            onClick={() => { setShowNotepad(!showNotepad); setShowLofi(false); setShowTimer(false); setShowStats(false); setShowHabits(false); }}
                            style={{ background: showNotepad ? colors.accent : 'transparent', border: `1px solid ${colors.cardBorder}`, color: showNotepad ? colors.background : colors.text, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            title="Brain Dump"
                        >
                            📝
                        </button>

                        {/* Dropdown Container for Stats */}
                        {showStats && (
                            <div style={{ position: 'absolute', top: '45px', right: '0', zIndex: 1001, animation: 'fadeIn 0.2s ease' }}>
                                <QuickStatsWidget tasks={tasks} isPopover={true} onClose={() => setShowStats(false)} />
                            </div>
                        )}

                        {/* Persistent Lofi Player Container */}
                        <div style={{ position: 'absolute', top: '45px', right: '0', zIndex: 1001, animation: 'fadeIn 0.2s ease', display: showLofi ? 'block' : 'none' }}>
                            <LofiPlayer isPopover={true} onClose={() => setShowLofi(false)} />
                        </div>

                        {/* Persistent Dropdown Container for Pomodoro */}
                        <div style={{ position: 'absolute', top: '45px', right: '0', zIndex: 1001, animation: 'fadeIn 0.2s ease', display: showTimer ? 'block' : 'none' }}>
                            <PomodoroTimer isPopover={true} onClose={() => setShowTimer(false)} />
                        </div>

                        {/* Persistent Zen Habit Tracker */}
                        <div style={{ position: 'absolute', top: '45px', right: '0', zIndex: 1001, animation: 'fadeIn 0.2s ease', display: showHabits ? 'block' : 'none' }}>
                            <ZenHabitTracker isPopover={true} onClose={() => setShowHabits(false)} />
                        </div>

                        {/* Persistent Brain Dump Notepad */}
                        <div style={{ position: 'absolute', top: '45px', right: '0', zIndex: 1001, animation: 'fadeIn 0.2s ease', display: showNotepad ? 'block' : 'none' }}>
                            <BrainDumpNotepad isPopover={true} onClose={() => setShowNotepad(false)} />
                        </div>
                    </div>

                    {/* Japanese Theme Selector */}
                    <select
                        value={theme}
                        onChange={(e) => changeTheme(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            background: colors.cardBg,
                            border: `2px solid ${colors.cardBorder}`,
                            color: colors.text,
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            transition: 'all 0.3s'
                        }}
                    >
                        {/* Traditional */}
                        <option value="sakura">{themeDefinitions.sakura.name}</option>
                        <option value="matcha">{themeDefinitions.matcha.name}</option>
                        <option value="indigo">{themeDefinitions.indigo.name}</option>
                        <option value="momiji">{themeDefinitions.momiji.name}</option>
                        <option value="sumi">{themeDefinitions.sumi.name}</option>
                        <option disabled>──────</option>

                        {/* City & Retro */}
                        <option value="akihabara">{themeDefinitions.akihabara.name}</option>
                        <option value="kyoto">{themeDefinitions.kyoto.name}</option>
                        <option value="shinjuku">{themeDefinitions.shinjuku.name}</option>
                        <option value="pixel">{themeDefinitions.pixel.name}</option>
                        <option value="matrix">{themeDefinitions.matrix.name}</option>
                        <option disabled>──────</option>

                        {/* Vibe & Aesthetic */}
                        <option value="coffee">{themeDefinitions.coffee.name}</option>
                        <option value="sky">{themeDefinitions.sky.name}</option>
                        <option value="starry">{themeDefinitions.starry.name}</option>
                        <option value="sunset">{themeDefinitions.sunset.name}</option>
                        <option value="dracula">{themeDefinitions.dracula.name}</option>
                        <option value="yourname">{themeDefinitions.yourname.name}</option>
                        <option disabled>──────</option>

                        {/* Retro/Synth */}
                        <option value="synthwave">{themeDefinitions.synthwave.name}</option>
                        <option value="cyberpunk">{themeDefinitions.cyberpunk.name}</option>
                        <option value="vaporwave">{themeDefinitions.vaporwave.name}</option>
                        <option disabled>──────</option>

                        {/* Anime */}
                        <option value="ghibli">{themeDefinitions.ghibli.name}</option>
                        <option value="onepiece">{themeDefinitions.onepiece.name}</option>
                        <option value="naruto">{themeDefinitions.naruto.name}</option>
                        <option value="demonslayer">{themeDefinitions.demonslayer.name}</option>
                        <option disabled>──────</option>

                        {/* Nature & Zen */}
                        <option value="zen">{themeDefinitions.zen.name}</option>
                        <option value="sage">{themeDefinitions.sage.name}</option>
                        <option value="cream">{themeDefinitions.cream.name}</option>
                        <option value="nord">{themeDefinitions.nord.name}</option>
                        <option value="lavender">{themeDefinitions.lavender.name}</option>
                        <option value="midnight">{themeDefinitions.midnight.name}</option>
                        <option value="mist">{themeDefinitions.mist.name}</option>
                        <option disabled>──────</option>

                        {/* System */}
                        <option value="light">☀️ Light</option>
                        <option value="dark">🌙 Dark</option>
                    </select>

                    {/* View Toggle */}
                    <div style={{ display: 'flex', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '5px', overflow: 'hidden' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '5px 12px',
                                background: viewMode === 'list' ? colors.accent : 'transparent',
                                color: viewMode === 'list' ? (theme === 'light' ? 'white' : 'black') : colors.text,
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: viewMode === 'list' ? 'bold' : 'normal'
                            }}
                        >
                            ☷ List
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            style={{
                                padding: '5px 12px',
                                background: viewMode === 'kanban' ? colors.accent : 'transparent',
                                color: viewMode === 'kanban' ? (theme === 'light' ? 'white' : 'black') : colors.text,
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: viewMode === 'kanban' ? 'bold' : 'normal'
                            }}
                        >
                            ▦ Kanban
                        </button>
                    </div>
                    <button onClick={toggleTheme} style={{ padding: '5px 10px', cursor: 'pointer', background: 'transparent', border: `1px solid ${colors.text}`, color: colors.text, borderRadius: '5px' }}>
                        {theme === 'light' ? '☾' : '☼'}
                    </button>
                    <span>Welcome, {user && user.name}</span>
                    <button onClick={logoutUser} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Logout</button>
                </div>
            </div>

            {/* Stats Section */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {stats.length > 0 ? stats.map(stat => (
                    <div key={stat._id} style={{
                        background: colors.cardBg, color: colors.text, padding: '15px', border: `1px solid ${colors.cardBorder}`,
                        minWidth: '120px', textAlign: 'center', borderRadius: '8px',
                        boxShadow: colors.glow, transition: 'all 0.3s'
                    }}>
                        <h2 style={{ margin: 0, fontSize: '2rem' }}>{stat.numTasks}</h2>
                        <small style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>𓍯 {stat._id}</small>
                    </div>
                )) : (
                    <div style={{ padding: '10px', border: '1px solid #ccc' }}>No stats available yet.</div>
                )}
            </div>

            {/* NEW: Search Bar */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="✧ Search tasks by title..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        background: colors.inputBg,
                        color: colors.text,
                        border: `2px solid ${colors.inputBorder}`,
                        borderRadius: '5px',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Filter & Sort Bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '10px', border: `1px dashed ${colors.text}`, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span>✧ Filter:</span>
                    <select onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}>
                        <option value="all">All Statuses</option>
                        <option value="pending">◎ Pending</option>
                        <option value="in-progress">◐ In Progress</option>
                        <option value="completed">● Completed</option>
                    </select>
                    <select onChange={e => setFilterPriority(e.target.value)} style={{ padding: '8px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}>
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: 'auto' }}>
                    <span>⇅ Sort By:</span>
                    <select onChange={e => setSort(e.target.value)} style={{ padding: '8px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}>
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="title">A-Z (Title)</option>
                        <option value="-title">Z-A (Title)</option>
                    </select>
                </div>
            </div>

            {/* Add/Edit Task Form */}
            <div style={{
                background: isEditing ? (theme === 'light' ? '#e6f7ff' : '#003a5c') : colors.cardBg,
                padding: '15px', marginBottom: '20px',
                border: isEditing ? '2px solid #1890ff' : 'none'
            }}>
                <h3>{isEditing ? '✎ Edit Task' : '✦ New Task'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Task Title..."
                        required
                        style={{ padding: '8px', flexGrow: 1, minWidth: '200px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        style={{ padding: '8px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}
                    />
                    <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '8px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}>
                        <option value="pending">◎ Pending</option>
                        <option value="in-progress">◐ In Progress</option>
                        <option value="completed">● Completed</option>
                    </select>
                    <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '8px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}>
                        <option value="low">◎ Low Priority</option>
                        <option value="medium">○ Medium Priority</option>
                        <option value="high">● High Priority</option>
                    </select>
                    <button type="submit" style={{ padding: '8px 20px', background: isEditing ? '#1890ff' : (theme === 'light' ? 'black' : 'white'), color: isEditing ? 'white' : (theme === 'light' ? 'white' : 'black'), border: 'none' }}>
                        {isEditing ? 'Update' : 'Add'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(false); setTitle(''); setDueDate(''); }} style={{ padding: '8px 15px', background: 'gray', color: 'white', border: 'none' }}>
                            Cancel
                        </button>
                    )}
                    <div style={{ width: '100%', marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Subtasks:</span>
                        {subTasks.map((st, index) => (
                            <div key={index} style={{ background: colors.inputBg, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px', border: `1px solid ${colors.inputBorder}` }}>
                                {st.title}
                                <span onClick={() => handleRemoveSubTask(index)} style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}>×</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                value={subTaskInput}
                                onChange={e => setSubTaskInput(e.target.value)}
                                placeholder="Add subtask..."
                                style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', background: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubTask())}
                            />
                            <button type="button" onClick={handleAddSubTask} style={{ padding: '4px 10px', fontSize: '12px', background: colors.accent, color: colors.background, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✦</button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tasks Display - Conditional based on View Mode */}
            {viewMode === 'kanban' ? (
                <KanbanBoard
                    tasks={tasks}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    onToggleSubtask={handleToggleSubTask}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                    isOverdue={isOverdue}
                />
            ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {Array.isArray(tasks) && tasks.map(task => {
                        const overdue = isOverdue(task.dueDate, task.status);
                        return (
                            <div key={task._id} style={{
                                border: `1px solid ${colors.cardBorder}`,
                                padding: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderLeft: `10px solid ${getPriorityColor(task.priority)}`,
                                background: colors.cardBg,
                                color: colors.text,
                                position: 'relative',
                                boxShadow: colors.glow,
                                transition: 'all 0.3s'
                            }}>
                                {overdue && (
                                    <span style={{
                                        position: 'absolute', top: '-10px', right: '-5px',
                                        background: 'red', color: 'white', padding: '2px 8px', fontSize: '10px'
                                    }}>
                                        OVERDUE!
                                    </span>
                                )}
                                <div>
                                    <strong>{task.title}</strong>
                                    <br />
                                    <small style={{ color: theme === 'light' ? 'gray' : '#aaa' }}>
                                        {task.status} • {task.priority.toUpperCase()}
                                        {task.dueDate && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>✦ Due: {formatDate(task.dueDate)}</span>}
                                    </small>
                                    {task.subTasks && task.subTasks.length > 0 && (
                                        <div style={{ marginTop: '10px', paddingLeft: '20px', borderLeft: `2px solid ${colors.accent}44` }}>
                                            {task.subTasks.map((st, index) => (
                                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', fontSize: '12px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={st.completed}
                                                        onChange={() => handleToggleSubTask(task._id, index)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    <span style={{ textDecoration: st.completed ? 'line-through' : 'none', opacity: st.completed ? 0.6 : 1 }}>
                                                        {st.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleEditClick(task)} style={{ cursor: 'pointer', background: 'none', border: `1px solid ${colors.text}`, color: colors.text, padding: '2px 8px', borderRadius: '4px' }}>✎ Edit</button>
                                    <button onClick={() => handleDelete(task._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0 5px' }}>˗</button>
                                </div>
                            </div>
                        );
                    })}
                    {tasks.length === 0 && <p>No tasks found. Create one above!</p>}
                </div>
            )}

            {/* Sakura Celebration Animation */}
            <SakuraCelebration />

            {/* Focus Mode Overlay */}
            {isFocusMode && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.85)',
                        zIndex: 9997,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease-in',
                        backdropFilter: 'blur(10px)'
                    }}
                    onClick={() => setIsFocusMode(false)}
                >
                    <div style={{
                        textAlign: 'center',
                        color: 'white',
                        padding: '40px',
                        background: 'rgba(255, 107, 157, 0.1)',
                        borderRadius: '20px',
                        border: '2px solid rgba(255, 107, 157, 0.3)'
                    }}>
                        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🪷</div>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '15px' }}>
                            集中
                        </div>
                        <div style={{ fontSize: '20px', opacity: 0.9, marginBottom: '10px' }}>
                            Shūchū - Focus
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.7 }}>
                            Press Escape or click anywhere to exit
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
