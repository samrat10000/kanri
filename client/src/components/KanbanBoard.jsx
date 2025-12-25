import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Draggable Task Card Component
const TaskCard = ({ task, onEdit, onDelete, onToggleSubtask, getPriorityColor, formatDate, isOverdue, theme }) => {
    const { colors } = useContext(ThemeContext);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    const overdue = isOverdue(task.dueDate, task.status);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div style={{
                border: `1px solid ${colors.cardBorder}`,
                padding: '12px',
                marginBottom: '10px',
                borderLeft: `5px solid ${getPriorityColor(task.priority)}`,
                background: colors.cardBg,
                color: colors.text,
                position: 'relative',
                borderRadius: '5px',
                boxShadow: colors.glow,
                transition: 'all 0.3s'
            }}>
                {overdue && (
                    <span style={{
                        position: 'absolute', top: '-8px', right: '-5px',
                        background: 'red', color: 'white', padding: '2px 6px', fontSize: '9px', borderRadius: '3px'
                    }}>
                        OVERDUE!
                    </span>
                )}
                <div>
                    <strong style={{ fontSize: '14px' }}>{task.title}</strong>
                    <br />
                    <small style={{ color: theme === 'light' ? 'gray' : '#aaa', fontSize: '11px' }}>
                        {task.priority.toUpperCase()}
                        {task.dueDate && <span style={{ marginLeft: '8px' }}>✦ {formatDate(task.dueDate)}</span>}
                    </small>
                </div>

                {/* NEW: Subtasks in Kanban */}
                {task.subTasks && task.subTasks.length > 0 && (
                    <div
                        style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: `2px solid ${colors.accent}44` }}
                        onClick={(e) => e.stopPropagation()} // Prevent drag start when clicking subtasks
                    >
                        {task.subTasks.map((st, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px', fontSize: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={st.completed}
                                    onChange={() => onToggleSubtask(task._id, index)}
                                    style={{ cursor: 'pointer', transform: 'scale(0.8)' }}
                                />
                                <span style={{ textDecoration: st.completed ? 'line-through' : 'none', opacity: st.completed ? 0.6 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {st.title}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                        style={{ cursor: 'pointer', background: 'none', border: `1px solid ${colors.text}`, color: colors.text, padding: '2px 6px', fontSize: '11px', borderRadius: '3px' }}
                    >
                        ✎
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div >
    );
};

// FIXED: Droppable Column Component with useDroppable hook
const KanbanColumn = ({ status, tasks, onEdit, onDelete, onToggleSubtask, getPriorityColor, formatDate, isOverdue, theme, colors }) => {
    // THIS IS THE FIX: useDroppable makes the column accept drops
    const { setNodeRef } = useDroppable({
        id: status, // This column accepts drops for this status
    });

    const statusConfig = {
        pending: { label: 'Pending', emoji: '◎', color: '#ffebcc' },
        'in-progress': { label: 'In Progress', emoji: '◐', color: '#cce5ff' },
        completed: { label: 'Completed', emoji: '●', color: '#d4edda' }
    };

    const config = statusConfig[status] || { label: status, emoji: '❓', color: '#eeeeee' };

    return (
        <div
            ref={setNodeRef} // Connect the droppable ref
            style={{
                flex: 1,
                minWidth: '300px',
                background: theme === 'light' ? config.color : colors.cardBg,
                padding: '15px',
                borderRadius: '8px',
                border: `2px solid ${colors.cardBorder}`
            }}
        >
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: colors.text }}>
                {config.emoji} {config.label} <span style={{ fontSize: '14px', opacity: 0.7 }}>({tasks.length})</span>
            </h3>
            <SortableContext items={Array.isArray(tasks) ? tasks.map(t => t._id) : []} strategy={verticalListSortingStrategy}>
                <div style={{ minHeight: '200px' }}>
                    {Array.isArray(tasks) && tasks.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleSubtask={onToggleSubtask}
                            getPriorityColor={getPriorityColor}
                            formatDate={formatDate}
                            isOverdue={isOverdue}
                            theme={theme}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', color: colors.text, opacity: 0.5 }}>
                            Drop tasks here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

// Main Kanban Board Component
export const KanbanBoard = ({ tasks, onEdit, onDelete, onStatusChange, onToggleSubtask, getPriorityColor, formatDate, isOverdue }) => {
    const { theme, colors } = useContext(ThemeContext);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // FIXED: Better drag end handler that finds the column status
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id;

        // CRITICAL FIX: 'over.id' might be a task ID (if dropped on a task)
        // or a column status (if dropped in empty space)
        // We need to figure out which column the drop happened in

        let newStatus = over.id;

        // If over.id is a task ID (24 character MongoDB ObjectId), 
        // find which status that task belongs to
        if (over.id.length === 24) {
            // This is a task ID, find its status
            const targetTask = tasks.find(t => t._id === over.id);
            if (targetTask) {
                newStatus = targetTask.status;
            } else {
                return; // Invalid drop target
            }
        }

        // Validate status is one of the allowed values
        if (!['pending', 'in-progress', 'completed'].includes(newStatus)) {
            console.error('Invalid status:', newStatus);
            return;
        }

        // Find the task being dragged
        const task = tasks.find(t => t._id === taskId);

        // Only update if status actually changed
        if (task && task.status !== newStatus) {
            onStatusChange(taskId, newStatus);
        }
    };

    // Group tasks by status
    const pendingTasks = Array.isArray(tasks) ? tasks.filter(t => t.status === 'pending') : [];
    const inProgressTasks = Array.isArray(tasks) ? tasks.filter(t => t.status === 'in-progress') : [];
    const completedTasks = Array.isArray(tasks) ? tasks.filter(t => t.status === 'completed') : [];

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                <KanbanColumn
                    status="pending"
                    tasks={pendingTasks}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleSubtask={onToggleSubtask}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                    isOverdue={isOverdue}
                    theme={theme}
                    colors={colors}
                />
                <KanbanColumn
                    status="in-progress"
                    tasks={inProgressTasks}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleSubtask={onToggleSubtask}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                    isOverdue={isOverdue}
                    theme={theme}
                    colors={colors}
                />
                <KanbanColumn
                    status="completed"
                    tasks={completedTasks}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleSubtask={onToggleSubtask}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                    isOverdue={isOverdue}
                    theme={theme}
                    colors={colors}
                />
            </div>
        </DndContext>
    );
};
