import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  Clock, 
  Send, 
  AlertCircle, 
  BookOpen, 
  ArrowLeft,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { videoService } from '../services/video';
import { chatService } from '../services/chat';
import type { Video, Message, Source } from '../types';
import Header from '../components/Header';

export default function VideoDetail() {
  const { id: videoId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Core domain state
  const [video, setVideo] = useState<Video | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [videoLoading, setVideoLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [inputText, setInputText] = useState("");

  const [activeSources, setActiveSources] = useState<Source[]>([]);
  const [highlightedSourceId, setHighlightedSourceId] =
    useState<string | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const activeSourcesContainerRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { label: "Summarize this lecture", query: "Summarize the key mathematical concepts and insights from this video." },
    { label: "How attention is computed?", query: "How is scaled dot-product attention computed mathematically?" },
    { label: "Key academic takeaways", query: "What are the primary structural takeaways discussed in this presentation?" }
  ];
  
  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;

      try {
        const data = await videoService.getVideoById(videoId);
        setVideo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    if (!videoId) return;

    const text = customText || inputText;

    if (!text.trim() || isSending) return;

    if (!customText) {
      setInputText("");
    }

    setIsSending(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    const botId = `bot-${Date.now()}`;

    const botPlaceholder: Message = {
      id: botId,
      role: "assistant",
      content: "",
      sources: [],
    };

    setMessages((prev) => [...prev, botPlaceholder]);

    try {
      const response = await chatService.chatVideo(
        videoId,
        text
      );

      chatService.streamResponse(
        response.answer,
        (streamed, finished) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId
                ? {
                    ...m,
                    content: streamed,
                    sources: finished
                      ? response.sources
                      : [],
                  }
                : m
            )
          );

          if (finished) {
            setActiveSources(response.sources ?? []);
            setIsSending(false);
          }
        },
        5
      );
    } catch (err) {
      console.error(err);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? {
                ...m,
                content: "Failed to generate response.",
              }
            : m
        )
      );

      setIsSending(false);
    }
  };

  const handleCitationClick = (sourceId: string) => {
    setHighlightedSourceId(sourceId);

    const element = document.getElementById(
      `source-item-${sourceId}`
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const formatTimestamp = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };



  if (videoLoading) {
    return (
      <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Loading LearnTube interactive workspace...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="font-bold">Lecture video not found or invalid ID.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans h-screen overflow-hidden">
      <Header />

      <div className="flex-1 grid grid-cols-12 overflow-hidden min-h-0">
        
        <aside id="workspace-sidebar" className="col-span-3 border-r border-zinc-800 bg-[#000000] p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6 text-left">
            
            <button
              id="sidebar-btn-back"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>

            <div className="space-y-3 p-3 bg-zinc-900/10 border border-zinc-800/80 rounded-xl relative">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                  video.status === 'processed' 
                    ? 'bg-emerald-500/90 text-white border-emerald-500' 
                    : 'bg-amber-500/90 text-white border-amber-500'
                }`}>
                  {video.status === 'processed' ? 'Processed' : 'Processing...'}
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="font-bold text-xs text-[#eeeeee] line-clamp-2 leading-tight">
                  {video.title}
                </h2>
                <p className="text-[10px] text-[#bfbfbf] leading-normal line-clamp-2 pt-0.5">
                  {video.description}
                </p>
              </div>
            </div>



          </div>

          <div className="border-t border-zinc-800 pt-4 text-[10px] text-[#666666] text-left">
            <span>Video ID: {video.id}</span>
          </div>
        </aside>

        <section 
        id="chat-workspace" 
        className="col-span-7 bg-[#000000] flex flex-col h-full min-h-0 border-r border-zinc-800">
          
          <div className="flex-1 min-h-0 overflow-y-auto chat-scroll px-6 py-6">
              
             {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-400">
                  <img src='/src/assets/logo1.svg' />
                </div>
                <div className="space-y-1.5">
                  <p className="font-bold text-white text-sm">Welcome to active video study tracks!</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select an index channel in the left rail or choose one of our automated prompt shortcuts below to query the artificial video intelligence.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-4 text-left ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                        isUser 
                          ? 'bg-[#3e3e3e] text-white' 
                          : 'text-[#ebebeb]'
                      }`}>
                        

                        <div className="markdown-body select-text">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>

                        {!isUser && message.content === '' && (
                          <div className="flex items-center gap-1 py-1">
                            <span className="w-2 h-2 rounded-full bg-[#525252] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-[#525252] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-[#525252] animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}

                        {!isUser && message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#4f4f4f] flex flex-wrap items-center gap-2">
                            <span className="text-[9px] uppercase tracking-wider text-[#7c7c7c] font-mono flex items-center gap-1 leading-none">
                              <BookOpen className="w-3 h-3" /> Cited Timestamps:
                            </span>
                            {message.sources.map((src) => (
                              <button
                                key={src.id}
                                id={`citation-chip-${src.id}`}
                                onClick={() => handleCitationClick(src.id)}
                                className="inline-flex items-center gap-1 bg-[#222222] hover:bg-[#2c2c2c] text-[#b8b8b8] px-2 py-1 rounded text-[10px] font-semibold border border-slate-800 transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5 text-[#b8b8b8]" />
                                {formatTimestamp(src.start_time)} - {formatTimestamp(src.end_time)}
                              </button>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          <div className="p-4 bg-black border-t border-zinc-700 space-y-4">
            
            {messages.length <= 1 && (
              <div id="suggested-prompts-bar" className="flex flex-wrap gap-2 text-left justify-start">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    id={`suggested-prompt-${idx}`}
                    onClick={() => handleSendMessage(p.query)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-[#d8d8d8] hover:text-white px-3 py-1.5 rounded-full transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                  {p.label}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2 items-center relative"
            >
              <input
                id="workspace-chat-input"
                type="text"
                placeholder= "Ask anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-black border border-slate-800 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-[#787878] focus:outline-none focus:border-indigo-600 transition-colors"
              />
              <button
                id="btn-workspace-send"
                type="submit"
                className="absolute right-2 bg-white hover:bg-[#cecece] disabled:bg-slate-850 disabled:text-slate-600 text-black p-2.5 rounded-lg text-xs leading-none transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        <aside id="workspace-sources-rail" className="col-span-2 bg-[#101010] p-4 flex flex-col overflow-y-auto">
          <div ref={activeSourcesContainerRef} className="space-y-5 text-left">
            
            <div className="flex items-center gap-1.5 border-b border-zinc-800 text-[#d7d7d7] pb-3">
              <BookOpen className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Source Document Citations</h2>
            </div>

            {activeSources.length === 0 ? (
              <div className="h-[200px] text-[#cfcfcf] flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-900/60 rounded-xl">
                <Clock className="w-6 h-6 mb-2" />
                <p className="text-[11px] ">No active citations loaded.</p>
                <p className="text-[9px] mt-1 max-w-[120px] text-[#b4b4b4]  mx-auto leading-normal">
                  Send a message. Bot answers will populate citations here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] text-[#9d9d9d] ">
                  Click timestamps below to highlight source contexts.
                </p>
                
                {activeSources.map((source) => {
                  
                  
                  return (
                    <div
                      key={source.id}
                      id={`source-item-${source.id}`}
                      className="p-3.5 border-[#5b5b5b] rounded-xl border transition-all duration-300 bg-transparent">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-[#bebebe] rounded px-1.5 py-0.5 font-bold font-mono">
                        {formatTimestamp(source.start_time)} - {formatTimestamp(source.end_time)}
                        </span>
                        
                        <div className="flex items-center gap-1 text-[9px] text-[#bebebe] hover:scale-102 font-semibold cursor-pointer hover:text-[#d2d2d2] transition-colors">
                          Jump in video <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
