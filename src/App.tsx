import { useCallback } from 'react';
import { Radio, Wifi, WifiOff } from 'lucide-react';
import { AgentsList } from './components/AgentsList';
import { KanbanBoard } from './components/KanbanBoard';
import { AgentChat } from './components/AgentChat';
import { useAgents, useTasks, useMessages, useSSE } from './hooks/useApi';
import type { Agent, Task, Message, TaskStatus } from './types';

function Header({ connected }: { connected: boolean }) {
  return (
    <header className="h-14 px-4 border-b border-cyber-green/30 bg-black/50 flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Radio className="w-5 h-5 text-cyber-green" />
        <h1 className="text-lg font-black italic tracking-widest text-cyber-green uppercase font-display">
          Mission Control
        </h1>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-cyber-green/20 rounded-full">
        {connected ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-cyber-green" />
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-cyber-red" />
            <div className="w-2 h-2 rounded-full bg-cyber-red" />
          </>
        )}
        <span className="text-[10px] font-mono uppercase tracking-wider text-cyber-green/80">
          {connected ? 'Online' : 'Offline'}
        </span>
      </div>
    </header>
  );
}

export default function App() {
  const { agents, setAgents, loading: agentsLoading } = useAgents();
  const { kanban, loading: tasksLoading, moveTask, setTasks } = useTasks();
  const { messages, loading: messagesLoading, addMessage } = useMessages();

  // SSE handlers
  const handleAgentUpdate = useCallback((agent: Agent, _action?: 'created' | 'updated') => {
    setAgents(prev => {
      const idx = prev.findIndex(a => a.id === agent.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...agent };
        return next;
      }
      // New agent - add to list
      return [...prev, agent];
    });
  }, [setAgents]);

  const handleTaskUpdate = useCallback((task: Task | { id: number }, action?: 'created' | 'updated' | 'deleted') => {
    if (action === 'deleted') {
      setTasks(prev => prev.filter(t => t.id !== task.id));
      return;
    }
    
    setTasks(prev => {
      const fullTask = task as Task;
      const idx = prev.findIndex(t => t.id === fullTask.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...fullTask };
        return next;
      }
      // New task - add to list
      return [...prev, fullTask];
    });
  }, [setTasks]);

  const handleMessageUpdate = useCallback((message: Message) => {
    addMessage(message);
  }, [addMessage]);

  const handleInit = useCallback((data: { tasks: Task[]; agents: Agent[] }) => {
    if (data.agents) setAgents(data.agents);
    if (data.tasks) setTasks(data.tasks);
  }, [setAgents, setTasks]);

  const { connected } = useSSE(
    handleAgentUpdate,
    handleTaskUpdate,
    handleMessageUpdate,
    handleInit
  );

  const handleMoveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
  }, [moveTask]);

  return (
    <div className="h-screen flex flex-col bg-cyber-black text-white overflow-hidden crt-overlay">
      <Header connected={connected} />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Agents List */}
        <aside className="w-64 border-r border-cyber-green/20 bg-black/30 flex-shrink-0 overflow-hidden">
          <AgentsList agents={agents} loading={agentsLoading} />
        </aside>

        {/* Main Area - Kanban Board */}
        <section className="flex-1 overflow-hidden">
          <KanbanBoard 
            kanban={kanban} 
            agents={agents}
            loading={tasksLoading}
            onMoveTask={handleMoveTask}
          />
        </section>

        {/* Right Panel - Agent Chat */}
        <aside className="w-80 border-l border-cyber-blue/20 bg-black/30 flex-shrink-0 overflow-hidden">
          <AgentChat messages={messages} loading={messagesLoading} />
        </aside>
      </main>
    </div>
  );
}
