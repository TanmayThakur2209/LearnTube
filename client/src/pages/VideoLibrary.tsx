import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Library, 
  Search, 
  Filter, 
  Clock, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { videoService } from '../services/video';
import type { Video } from '../types';
import Header from '../components/Header';

export default function VideoLibrary() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await videoService.getVideos();
      setVideos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChannel = selectedChannel === 'ALL' || v.channel === selectedChannel;
    
    const matchesStatus = selectedStatus === 'ALL' || v.status === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const uniqueChannels = ['ALL', ...Array.from(new Set(videos.map(v => v.channel)))];
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVideos.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedChannel, selectedStatus]);

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Library className="w-6 h-6 text-white" />
              Lectures Archive
            </h1>
            <p className="text-gray-50 text-xs">
              Explore all imported video classrooms, searchable by subtitle streams or lecture keywords.
            </p>
          </div>

          <button
            id="btn-lib-refresh"
            onClick={fetchVideos}
            disabled={loading}
            className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-2 rounded-lg transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} /> Refresh Catalog
          </button>
        </div>

        <div id="filter-controls-row" className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              id="library-search-query"
              type="text"
              placeholder="Search by topic, keyword, channel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850/80 text-white placeholder-slate-650 text-sm pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Channel</label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
              <select
                id="library-filter-channel"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850/80 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-indigo-650 transition-colors cursor-pointer appearance-none"
              >
                {uniqueChannels.map(channel => (
                  <option key={channel} value={channel}>
                    {channel === 'ALL' ? 'All Channels' : channel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Status</label>
            <select
              id="library-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850/80 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-650 transition-colors cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="processed">Processed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-[#141414] border border-slate-850 rounded-xl p-4 space-y-4 animate-pulse">
                <div className="w-full aspect-video bg-slate-850 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-850 rounded w-11/12" />
                  <div className="h-4 bg-slate-850 rounded w-7/12" />
                </div>
              </div>
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl py-20 text-center space-y-4 max-w-2xl mx-auto">
            <div className="mx-auto w-12 h-12 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-center text-slate-600">
              <Library className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-white">No Matched Lectures Found</p>
              <p className="text-slate-400 text-xs">
                We couldn't locate any record matching those filter options. Adjust your filters or import a new lecture.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map(video => (
                <div
                  key={video.id}
                  id={`library-video-${video.id}`}
                  onClick={() => navigate(`/videos/${video.id}`)}
                  className="bg-[#1e1e1e] border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700/80 shadow-lg group cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-950/20 transition-all duration-300"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden">
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
                      <p className="text-xs text-indigo-400 font-medium">{video.channel}</p>
                      <h3 className="font-bold text-sm text-[#ededed] group-hover:text-white line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                      <p className="text-xs text-[#ddd] line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {/* // ${
                    //   video.status === 'processed' 
                    //     ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    //     : video.status === 'processing' 
                    //       ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                    //       : 'bg-red-500/10 text-red-500 border-red-500/20'
                    // }`}>
                      // {video.status === 'processed' ? 'Processed' : video.status === 'processing' ? 'Processing...' : 'Failed'} */}
                    processed
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div id="library-pagination" className="flex items-center justify-between pt-4 border-t border-slate-900 max-w-xl mx-auto">
                <button
                  id="btn-pag-prev"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-xs px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="text-xs text-slate-400">
                  Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                </div>

                <button
                  id="btn-pag-next"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-xs px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
