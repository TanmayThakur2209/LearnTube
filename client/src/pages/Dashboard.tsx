import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Clock, 
  AlertCircle, 
  Video as VideoIcon, 
  Play, 
  X, 
  ChevronRight, 
  Loader2
} from 'lucide-react';
import { AiFillYoutube } from "react-icons/ai";
import { useAuth } from '../contexts/AuthContext';
import { videoService } from '../services/video';
import type { Video } from '../types';
import Header from '../components/Header';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const fetchVideos = async () => {
    try {
      const data = await videoService.getVideos();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenModal = () => {
    setYoutubeUrl('');
    setImportError('');
    setModalOpen(true);
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) {
      setImportError('Please enter a valid YouTube URL');
      return;
    }
    
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      setImportError('Only valid YouTube links can be processed. Example: https://www.youtube.com/watch?v=szn_szgI_mY');
      return;
    }

    setImportError('');
    setImporting(true);

    try {
      const imported = await videoService.importVideo(youtubeUrl);
      
      setTimeout(() => {
        setImporting(false);
        setModalOpen(false);
        navigate(`/videos/${imported.id}`);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setImportError(err?.message || 'Failed to trigger video transcript import. Please verify connection.');
      setImporting(false);
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8 text-left">
        
        <div id="welcome-banner" className="bg-black border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-[#1b1b1b] pointer-events-none" />
          
          <div className="z-20 space-y-2 relative">
            <div className="inline-flex items-center gap-1.5 border border-[#494949] px-3 py-1 rounded-full text-xs font-semibold">
              <img src='src/assets/logo1.svg' className="w-3.5 h-3.5" /> Workspace Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-[#c1c1c1] text-sm max-w-xl">
              Paste in YouTube streams to extract, search transcripts, and compile concise chat summaries linking back to specific video coordinates.
            </p>
          </div>

          <button
            id="btn-import-trigger"
            onClick={handleOpenModal}
            className="z-20 bg-white hover:bg-[#e4e4e4] text-black text-sm font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all  hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Import Video Lecture
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#ffffff]" />
            <input
              id="library-search"
              type="text"
              placeholder ="Search lectures, topics, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-[#6e6e6e] text-white placeholder-black-500 text-sm pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#a8a8a8] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-black-400">
            <Clock className="w-4 h-4 " />
            <span>Updated: Just Now</span>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <VideoIcon className="w-5 h-5 text-white" />
            {searchQuery ? `Search Results (${filteredVideos.length})` : 'Recent Imported Library'}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#202020]  rounded-xl p-4 space-y-4 animate-pulse">
                  <div className="w-full aspect-video bg-black-850 rounded-lg" />
                </div>
              ))} 
            </div>
          ) : filteredVideos.length === 0 ? (
            <div id="dashboard-empty-state" className="border border-dashed border-[#525252] bg-[#1b1b1b] rounded-2xl py-16 px-6 text-center space-y-4 max-w-2xl mx-auto">
              <div className="mx-auto w-12 h-12 bg-black-900 border border-black-800 rounded-xl flex items-center justify-center text-black-500">
                <AiFillYoutube  className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-white">No Lecture Videos Found</p>
                <p className="text-black-400 text-xs max-w-md mx-auto">
                  {searchQuery 
                    ? `No matches found for "${searchQuery}". Try searching for categories like Algorithms, LLMs, or Attention.` 
                    : "Your dashboard is raw. Click 'Import Video Lecture' to fetch transcripts and unlock visual summary guides."}
                </p>
              </div>
              {!searchQuery && (
                <button
                  id="btn-empty-import"
                  onClick={handleOpenModal}
                  className="bg-white text-black hover:bg-[#c0c0c0] hover:scale-105 flex justify-center items-center mx-auto   text-xs font-semibold px-4 py-2.5 rounded-lg transition-all"
                >
                  <Plus/>Import My First Video
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  id={`video-card-${video.id}`}
                  onClick={() => navigate(`/videos/${video.id}`)}
                  className="bg-[#1a1a1a] border border-[#5b5b5b] rounded-xl overflow-hidden hover:border-black-700/80 shadow-lg group cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-950/20 transition-all duration-300"
                >
                  <div>
                    <div className="relative aspect-video bg-black-950 overflow-hidden">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-black p-3 rounded-full text-white shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-sm text-[#e3e3e3] group-hover:text-white line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                      <p className="text-xs text-[#a3a3a3] line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-2 border-t border-[#6a6a6a] flex items-center justify-between text-xs text-[#d1d1d1]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 ]" />
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {/* //   video.status === 'processed' 
                    //     ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    //     : video.status === 'processing' 
                    //       ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                    //       : 'bg-red-500/10 text-red-500 border-red-500/20'
            
                    //   {video.status === 'processed' ? 'Processed' : video.status === 'processing' ? 'Processing...' : 'Error'} */}
                    processed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !importing && setModalOpen(false)}
              className="absolute inset-0 bg-[#03050a]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-black border border-[#5a5a5a] rounded-2xl p-6 shadow-2xl z-10 space-y-6 mx-4 text-left"
            >
              <button
                id="btn-import-modal-close"
                onClick={() => !importing && setModalOpen(false)}
                className="absolute top-4 right-4 text-black-400 hover:text-white disabled:opacity-30 cursor-pointer"
                disabled={importing}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="bg-[#ffffff] w-10 p-2 rounded-xl inline-flex">
                  <img src='src/assets/logo.svg'/>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Import YouTube Video</h3>
                <p className="text-black-400 text-xs">
                  We download the transcription, analyze chapter marks, and generate active study indices.
                </p>
              </div>

              {importError && (
                <div className="p-3.5 bg-red-950/20 border border-red-900/40 text-red-300 rounded-xl text-xs flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{importError}</span>
                </div>
              )}
              {importing ? (
                <div id="import-loading-state" className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                  <Loader2 className="w-10 h-10 text-white  animate-spin" />
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-white">Synthesizing Lecture Data...</p>
                    <p className="text-black-500 text-xs animate-pulse">Retrieving transcripts, aligning timestamps, training model...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleImportSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-black-400 font-medium uppercase tracking-wider">YouTube Lecture URL</label>
                    <div className="relative">
                      <AiFillYoutube  className="absolute left-3.5 top-3.5 w-5 h-5 text-red-500" />
                      <input
                        id="youtube-url-input"
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=szn_szG_mY"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full bg-black-950 border border-black-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-black-600 focus:outline-none focus:border-indigo-600 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    id="btn-import-submit"
                    type="submit"
                    className="w-full bg-white hover:bg-[#e0e0e0] text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                  >
                    Import & Index Video <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
