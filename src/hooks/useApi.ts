import { useEffect, useState, useCallback, useRef } from 'react';
import type { Agent, Task, Message, KanbanData, TaskStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/agents`);
      if (!res.ok) throw new Error('Failed to fetch agents');
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : data.agents || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, setAgents, loading, error, refetch: fetchAgents };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const kanban: KanbanData = {
    backlog: tasks.filter(t => t.status === 'backlog'),
    todo: tasks.filter(t => t.status === 'todo'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
    
    try {
      await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      // Revert on error
      fetchTasks();
    }
  }, [fetchTasks]);

  return { tasks, setTasks, kanban, loading, error, refetch: fetchTasks, moveTask };
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : data.messages || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev.slice(-199), msg]);
  }, []);

  return { messages, setMessages, loading, error, refetch: fetchMessages, addMessage };
}

export function useSSE(
  onAgent?: (agent: Agent) => void,
  onTask?: (task: Task) => void,
  onMessage?: (message: Message) => void,
  onKanban?: (data: Partial<KanbanData>) => void
) {
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/api/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.addEventListener('agent', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onAgent?.(data);
      } catch {}
    });

    eventSource.addEventListener('task', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onTask?.(data);
      } catch {}
    });

    eventSource.addEventListener('message', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onMessage?.(data);
      } catch {}
    });

    eventSource.addEventListener('kanban', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onKanban?.(data);
      } catch {}
    });

    // Legacy log event - convert to message
    eventSource.addEventListener('log', (e: MessageEvent) => {
      const msg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        agentId: 'system',
        agentName: 'System',
        content: e.data,
        timestamp: new Date().toISOString(),
        type: 'info',
      };
      onMessage?.(msg);
    });

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onAgent, onTask, onMessage, onKanban]);

  return { connected };
}
