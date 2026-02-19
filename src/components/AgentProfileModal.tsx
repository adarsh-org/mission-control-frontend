import { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Zap, MessageCircle, BookOpen, Shield } from 'lucide-react';
import type { Agent } from '../types';
import { fetchAgentById } from '../hooks/useApi';
import { AgentAvatar } from './AgentAvatar';

interface AgentProfileModalProps {
  agentId: string;
  agentBasic: Agent;
  onClose: () => void;
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-accent-primary">
        <Icon className="w-4 h-4" />
        <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function TagList({ items, color = 'accent-primary' }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className={`text-sm text-white/80 flex items-start gap-2`}>
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${color} flex-shrink-0`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AgentProfileModal({ agentId, agentBasic, onClose }: AgentProfileModalProps) {
  const [agent, setAgent] = useState<Agent>(agentBasic);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentById(agentId)
      .then(a => { setAgent(a); setLoading(false); })
      .catch(() => setLoading(false));
  }, [agentId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-claw-card to-claw-surface shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 p-6 pb-4 border-b border-white/5 bg-claw-card/90 backdrop-blur-md rounded-t-2xl">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/10 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {agent.avatar ? (
              <img src={agent.avatar} alt={agent.name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              <AgentAvatar name={agent.name} size={48} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{agent.name}</h2>
            {agent.role && <p className="text-xs text-accent-muted">{agent.role}</p>}
            <div className="mt-1 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${agent.status === 'working' ? 'bg-accent-primary animate-pulse' : agent.status === 'idle' ? 'bg-accent-warning' : 'bg-accent-muted'}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-muted">{agent.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-accent-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <>
              {agent.bio && (
                <p className="text-sm text-white/70 leading-relaxed italic border-l-2 border-accent-primary/40 pl-4">
                  {agent.bio}
                </p>
              )}

              {agent.does && agent.does.length > 0 && (
                <Section icon={CheckCircle} title="What I Do">
                  <TagList items={agent.does} color="green-400" />
                </Section>
              )}

              {agent.does_not && agent.does_not.length > 0 && (
                <Section icon={XCircle} title="What I Don't Do">
                  <TagList items={agent.does_not} color="red-400" />
                </Section>
              )}

              {agent.principles && agent.principles.length > 0 && (
                <Section icon={BookOpen} title="Principles">
                  <TagList items={agent.principles} color="blue-400" />
                </Section>
              )}

              {agent.critical_actions && agent.critical_actions.length > 0 && (
                <Section icon={Shield} title="Critical Actions / Rules">
                  <TagList items={agent.critical_actions} color="amber-400" />
                </Section>
              )}

              {agent.communication_style && (
                <Section icon={MessageCircle} title="Communication Style">
                  <p className="text-sm text-white/70">{agent.communication_style}</p>
                </Section>
              )}

              {agent.bmad_source && (
                <Section icon={Zap} title="BMAD Source">
                  <p className="text-sm text-accent-muted font-mono">{agent.bmad_source}</p>
                </Section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
