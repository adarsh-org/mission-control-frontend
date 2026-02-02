import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Inbox, ListTodo, Eye, CheckCircle2, GripVertical, User } from 'lucide-react';
import type { Task, KanbanData, TaskStatus, Agent } from '../types';

interface KanbanBoardProps {
  kanban: KanbanData;
  agents: Agent[];
  loading?: boolean;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
}

const columnConfig: Record<TaskStatus, { title: string; icon: typeof Inbox; color: string }> = {
  backlog: { title: 'Backlog', icon: Inbox, color: 'cyber-purple' },
  todo: { title: 'Todo', icon: ListTodo, color: 'cyber-red' },
  review: { title: 'Review', icon: Eye, color: 'cyber-yellow' },
  completed: { title: 'Completed', icon: CheckCircle2, color: 'cyber-green' },
};

interface TaskCardProps {
  task: Task;
  agents: Agent[];
  isDragging?: boolean;
}

function TaskCard({ task, agents, isDragging }: TaskCardProps) {
  const agent = agents.find(a => a.id === task.agentId);
  
  return (
    <div 
      className={`p-3 bg-cyber-dark border border-white/10 rounded-lg transition-all ${
        isDragging ? 'shadow-neon-green opacity-80 scale-105' : 'hover:border-cyber-green/30'
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 cursor-grab" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
          )}
          {agent && (
            <div className="flex items-center gap-1.5 mt-2">
              <User className="w-3 h-3 text-cyber-blue" />
              <span className="text-[10px] text-cyber-blue">{agent.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SortableTaskProps {
  task: Task;
  agents: Agent[];
}

function SortableTask({ task, agents }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} agents={agents} />
    </div>
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  agents: Agent[];
}

function KanbanColumn({ status, tasks, agents }: KanbanColumnProps) {
  const config = columnConfig[status];
  const Icon = config.icon;
  
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: 'column' },
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex flex-col h-full bg-black/30 border border-white/5 rounded-xl overflow-hidden"
    >
      <div className={`p-3 border-b border-${config.color}/20 bg-${config.color}/5`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${config.color}`} />
          <h3 className={`text-sm font-bold uppercase tracking-wider text-${config.color}`}>
            {config.title}
          </h3>
          <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-${config.color}/20 text-${config.color}`}>
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto space-y-2 min-h-[200px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTask key={task.id} task={task} agents={agents} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-600 text-xs">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ kanban, agents, loading, onMoveTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: TaskStatus[] = ['backlog', 'todo', 'review', 'completed'];
  const allTasks = [...kanban.backlog, ...kanban.todo, ...kanban.review, ...kanban.completed];

  const handleDragStart = (event: DragStartEvent) => {
    const task = allTasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    // Check if dropped on a column
    let newStatus: TaskStatus | null = null;
    
    if (columns.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus;
    } else {
      // Dropped on another task - find which column it's in
      const overTask = allTasks.find(t => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && newStatus !== task.status) {
      onMoveTask(taskId, newStatus);
    }
  };

  if (loading) {
    return (
      <div className="h-full p-4">
        <div className="grid grid-cols-4 gap-4 h-full">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-black/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-4 h-full">
          {columns.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={kanban[status]}
              agents={agents}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} agents={agents} isDragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
