import api from './api';
import type { Session, Message, Source } from '../types';


const mockBotResponses: Record<string, { answer: string; sources: Source[] }> = {
  'hello': {
    answer: 'Hello! I am your AI video learning companion. I have indexed this video and its transcript completely. What part of the lecture can I simplify or explain further for you?',
    sources: []
  },
};

const getStoredSessions = (): Session[] => {
  const stored = localStorage.getItem('sim_sessions');
  return stored ? JSON.parse(stored) : [];
};

const saveStoredSessions = (sessions: Session[]) => {
  localStorage.setItem('sim_sessions', JSON.stringify(sessions));
};

const getStoredMessages = (): Record<string, Message[]> => {
  const stored = localStorage.getItem('sim_messages');
  return stored ? JSON.parse(stored) : {};
};

const saveStoredMessages = (messagesMap: Record<string, Message[]>) => {
  localStorage.setItem('sim_messages', JSON.stringify(messagesMap));
};

export const sessionService = {
  async getSessions(videoId: string): Promise<Session[]> {
    try {
      const response = await api.get<Session[]>(`/videos/${videoId}/sessions`);
      return response.data;
    } catch (error) {
      console.warn(`FastAPI sessions offline. Retrieving mock sessions for video ${videoId}...`);
      const allSessions = getStoredSessions();
      const filtered = allSessions.filter(s => s.video_id === videoId);
      
      if (filtered.length === 0) {
        const seedSession: Session = {
          id: `sess-${videoId}-1`,
          video_id: videoId,
          name: 'General Discussion',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const updated = [seedSession, ...allSessions];
        saveStoredSessions(updated);
        
        const msgs = getStoredMessages();
        msgs[seedSession.id] = [
          {
            id: `msg-seed-1`,
            session_id: seedSession.id,
            role: 'assistant',
            content: `Welcome! I am ready to help you analyze this lecture. Ask me to **summarize** the main ideas, explain the mechanics of **attention**, or ask questions about specific timestamps.`,
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        saveStoredMessages(msgs);
        
        return [seedSession];
      }
      return filtered;
    }
  },

  async createSession(videoId: string, name: string): Promise<Session> {
    try {
      const response = await api.post<Session>(`/videos/${videoId}/sessions`, { name });
      return response.data;
    } catch (error) {
      console.warn("FastAPI offline. Creating local session in simulated database...");
      const newSession: Session = {
        id: `sess-${Date.now()}`,
        video_id: videoId,
        name: name || `Study Session ${getStoredSessions().filter(s => s.video_id === videoId).length + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const sessions = getStoredSessions();
      sessions.unshift(newSession);
      saveStoredSessions(sessions);

      const msgs = getStoredMessages();
      msgs[newSession.id] = [
        {
          id: `msg-${Date.now()}-welcome`,
          session_id: newSession.id,
          role: 'assistant',
          content: `This is a brand new session focused on this lecture. Ask me any conceptual question, query definitions, or request timestamp breakdowns!`,
          created_at: new Date().toISOString()
        }
      ];
      saveStoredMessages(msgs);

      return newSession;
    }
  },

  async renameSession(sessionId: string, newName: string): Promise<Session> {
    try {
      const response = await api.put<Session>(`/sessions/${sessionId}`, { name: newName });
      return response.data;
    } catch (error) {
      console.warn(`FastAPI offline. Renaming session ${sessionId} locally...`);
      const sessions = getStoredSessions();
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        session.name = newName;
        session.updated_at = new Date().toISOString();
        saveStoredSessions(sessions);
        return session;
      }
      throw new Error("Session not found");
    }
  },

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await api.delete(`/sessions/${sessionId}`);
    } catch (error) {
      console.warn(`FastAPI offline. Deleting session ${sessionId} locally...`);
      const sessions = getStoredSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      saveStoredSessions(filtered);
      
      const msgs = getStoredMessages();
      delete msgs[sessionId];
      saveStoredMessages(msgs);
    }
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    try {
      const response = await api.get<Message[]>(`/sessions/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.warn(`FastAPI messages offline. Retrieving simulated messages for session ${sessionId}...`);
      const msgs = getStoredMessages();
      return msgs[sessionId] || [];
    }
  },

  async sendMessage(sessionId: string, content: string): Promise<Message> {
    try {
      const response = await api.post<Message>(`/sessions/${sessionId}/chat`, { content });
      return response.data;
    } catch (error) {
      console.warn("FastAPI message send failed. Simulating local bot response...");
      const msgs = getStoredMessages();
      const sessionMsgs = msgs[sessionId] || [];

      const userMsg: Message = {
        id: `msg-${Date.now()}-u`,
        session_id: sessionId,
        role: 'user',
        content,
        created_at: new Date().toISOString()
      };
      
      sessionMsgs.push(userMsg);
      msgs[sessionId] = sessionMsgs;
      saveStoredMessages(msgs);

      const cleanContent = content.toLowerCase();
      let matchedKey = 'default';
      if (cleanContent.includes('hello') || cleanContent.includes('hi')) {
        matchedKey = 'hello';
      } else if (cleanContent.includes('attention') || cleanContent.includes('transformer') || cleanContent.includes('formula')) {
        matchedKey = 'attention';
      } else if (cleanContent.includes('summar') || cleanContent.includes('brief') || cleanContent.includes('outline')) {
        matchedKey = 'summary';
      }

      const reply = mockBotResponses[matchedKey];
      
      const botMsg: Message = {
        id: `msg-${Date.now()}-b`,
        session_id: sessionId,
        role: 'assistant',
        content: reply.answer,
        sources: reply.sources,
        created_at: new Date(Date.now() + 100).toISOString()
      };

      sessionMsgs.push(botMsg);
      msgs[sessionId] = sessionMsgs;
      saveStoredMessages(msgs);

      return botMsg;
    }
  }
};
