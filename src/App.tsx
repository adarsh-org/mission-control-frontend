import { useEffect, useState, useRef } from 'react';
import { Terminal, Activity, Server, Database, Shield, Radio, Cpu, Clock, Zap, AlertCircle, CheckCircle, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

interface KanbanData {
  todo: Task[];
  doing: Task[];
  done: Task[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

const Header = ({ connected }: { connected: boolean }) => (
  <header className="p-4 border-b border-cyber-green/30 bg-cyber-black flex flex-col items-center gap-4">
    <div className="flex items-center gap-4">
      <Radio className="w-6 h-6 text-cyber-green" />
      <h1 className="text-2xl font-black italic tracking-widest text-cyber-green uppercase">WAR ROOM</h1>
    </div>
    <div className="flex items-center gap-2 px-4 py-2 bg-black border border-cyber-green/20 rounded-full">
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-cyber-green' : 'bg-red-500'}`}></div>
      <span className="font-mono text-xs uppercase text-cyber-green">
        {connected ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
      </span>
    </div>
  </header>
);

const TaskCard = ({ task }: { task: Task }) => (
  <div className="p-3 mb-3 bg-cyber-dark border-l-4 border-cyber-green border border-white/5">
    <div className="text-[10px] text-cyber-green/50 mb-1 font-mono">ID: {task.id}</div>
    <div className="text-sm font-bold text-white tracking-wide">{task.title}</div>
  </div>
);

const KanbanColumn = ({ title, tasks, color, icon: Icon }: { title: string, tasks: Task[], color: string, icon: any }) => {
  const textColor = color === 'red' ? 'text-cyber-red' : color === 'yellow' ? 'text-cyber-yellow' : 'text-cyber-green';
  const borderColor = color === 'red' ? 'border-cyber-red' : color === 'yellow' ? 'border-cyber-yellow' : 'border-cyber-green';

  return (
    <div className={`w-full bg-black/40 border ${borderColor}/20 rounded-lg p-3`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className={textColor} />
        <h3 className={`font-bold uppercase tracking-widest ${textColor}`}>{title}</h3>
        <span className="ml-auto text-xs opacity-50 font-mono">{tasks.length}</span>
      </div>
      <div>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const TerminalFeed = ({ logs }: { logs: LogEntry[] }) => (
  <div className="bg-black border border-cyber-blue/30 rounded-lg overflow-hidden flex flex-col h-[500px]">
    <div className="bg-cyber-blue/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-cyber-blue border-b border-cyber-blue/20">
      Live Telemetry Feed
    </div>
    <div className="flex-1 p-2 font-mono text-[10px] overflow-y-auto">
      {logs.map((log) => (
        <div key={log.id} className="py-1 border-b border-white/5 flex gap-2">
          <span className="opacity-30">[{log.timestamp}]</span>
          <span className="break-all">{log.message}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [kanban, setKanban] = useState<KanbanData>({ todo: [], doing: [], done: [] });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/stream');
    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.addEventListener('kanban', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.todo || data.doing || data.done) setKanban(prev => ({ ...prev, ...data }));
      } catch (err) {}
    });

    eventSource.addEventListener('log', (e: MessageEvent) => {
      const id = Math.random().toString(36).substr(2, 9);
      setLogs(prev => [...prev.slice(-99), {
        id,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        message: e.data,
        type: 'info'
      }]);
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Header connected={connected} />
      <main className="flex flex-col gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <KanbanColumn title="Pending" tasks={kanban.todo} color="red" icon={AlertCircle} />
          <KanbanColumn title="Active" tasks={kanban.doing} color="yellow" icon={Zap} />
          <KanbanColumn title="Secure" tasks={kanban.done} color="green" icon={CheckCircle} />
        </div>
        <TerminalFeed logs={logs} />
      </main>
    </div>
  );
}
