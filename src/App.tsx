import React, { useState, useEffect } from 'react';
import { PODCAST_VIDEOS, MICRO_VIDEOS } from './data';
import { Video, UserProgress } from './types';
import Header from './components/Header';
import SubscriptionModal from './components/SubscriptionModal';
import VideoPlayer from './components/VideoPlayer';
import VideoItem from './components/VideoItem';
import { 
  Compass, 
  Tv, 
  Sparkles, 
  Search, 
  Filter, 
  RotateCcw, 
  Bookmark, 
  History,
  Check, 
  Youtube,
  Star,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_KEY = 'nilton_nascimento_playlists_progress';

const initialProgress: UserProgress = {
  subscribed: false,
  notified: false,
  favoritedPlaylists: [],
  watchedVideos: []
};

export default function App() {
  // Modes: 'podcast' or 'micro' - Startup with Podcast active by default!
  const [activeTab, setActiveTab] = useState<'podcast' | 'micro'>('podcast');
  
  // State elements to record real-time YouTube sync outputs
  const [podcastVideos, setPodcastVideos] = useState<Video[]>(PODCAST_VIDEOS);
  const [microVideos, setMicroVideos] = useState<Video[]>(MICRO_VIDEOS);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Active selected video inside the player container (No featured video by default)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  
  // Search and filter keyword values
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'watched' | 'unwatched' | 'new'>('all');

  // Load and preserve User Progress locally
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading progress from storage', e);
    }
    return initialProgress;
  });

  // Track Subscription modal trigger state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  // Sync state to local storage on modification
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [progress]);

  // Fetch live YouTube playlist contents in the background seamlessly
  const fetchLivePlaylists = async (forceRefresh: boolean = false) => {
    setIsLoadingLive(true);
    try {
      const endpoint = forceRefresh ? '/api/playlists/refresh' : '/api/playlists';
      const method = forceRefresh ? 'POST' : 'GET';
      const res = await fetch(endpoint, { method });
      const data = await res.json();
      
      if (data.podcast && data.podcast.length > 0) {
        setPodcastVideos(data.podcast);
      }
      if (data.micro && data.micro.length > 0) {
        setMicroVideos(data.micro);
      }
      if (data.lastUpdated) {
        setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      console.warn('Real-time playlist sync bypass, keeping robust default metadata:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLivePlaylists();
  }, []);

  // Handler for partial updates to progress state
  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleChannelSubscribe = () => {
    // Directly launch subscription modal process
    setIsSubModalOpen(true);
  };

  const handleGoToSite = () => {
    window.open('https://www.niltonnascimento.com/', '_blank', 'noopener,noreferrer');
  };

  // Toggle dynamic assistido watch state
  const handleToggleWatched = (videoId: string) => {
    const isWatched = progress.watchedVideos.includes(videoId);
    let updated: string[];
    if (isWatched) {
      updated = progress.watchedVideos.filter(id => id !== videoId);
    } else {
      updated = [...progress.watchedVideos, videoId];
    }
    updateProgress({ watchedVideos: updated });
  };

  // Select appropriate video list based on selected active tab
  const activeVideosSource = activeTab === 'podcast' ? podcastVideos : microVideos;

  // Process sorting & filtering ("Mais recentes primeiro" -> sorted by dateOffsetDays ascending)
  const filteredVideos = activeVideosSource
    .filter(video => {
      // 1. Text filter query match
      const titleMatch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = video.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!titleMatch && !descMatch) return false;

      // 2. Status filter selection
      const isWatched = progress.watchedVideos.includes(video.id);
      const isNew = video.dateOffsetDays <= 7;
      if (statusFilter === 'watched' && !isWatched) return false;
      if (statusFilter === 'unwatched' && isWatched) return false;
      if (statusFilter === 'new' && !isNew) return false;

      return true;
    })
    // Sort "Mais recentes primeiro" (Day offset closer to 0 means more recent)
    .sort((a, b) => a.dateOffsetDays - b.dateOffsetDays);

  const totalPossibleVideosCount = podcastVideos.length + microVideos.length;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col font-sans" id="app-root-container">
      {/* 1. Navbar Header */}
      <Header onGoToSite={handleGoToSite} />

      {/* 2. Primary Layout Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full space-y-8">
        
        {/* 3. Controls & Dynamic Target Actions */}
        <div className="bg-[#0F0F12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6" id="control-board">
          
          {/* Action Selector Bar & Main subscription button */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-2">
            
            {/* Playlist mode toggle buttons: Podcast or MicroAprendizagem */}
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">
                SELECIONE O QUE DESEJA HOJE
              </label>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => {
                    setActiveTab('podcast');
                    setSearchQuery('');
                  }}
                  id="tab-podcast"
                  className={`flex-1 py-3 px-6 font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'podcast'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-2 ring-blue-400/30'
                      : 'bg-[#1A1A20] text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  Podcast
                </button>
                <button
                  onClick={() => {
                    setActiveTab('micro');
                    setSearchQuery('');
                  }}
                  id="tab-micro"
                  className={`flex-1 py-3 px-6 font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'micro'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-2 ring-blue-400/30'
                      : 'bg-[#1A1A20] text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  MicroAprendizagem
                </button>
              </div>
            </div>

            {/* Main call to action subscription progress triggers */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 lg:pt-0">
              <button
                onClick={handleChannelSubscribe}
                id="btn-subscribe-and-progress"
                className={`inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.01] ${
                  progress.subscribed 
                    ? 'bg-emerald-600/20 border border-emerald-500/35 text-emerald-400 hover:bg-emerald-600/30' 
                    : 'bg-red-650 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 border border-red-500/30'
                }`}
              >
                {progress.subscribed ? (
                  <>
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>Inscrito & Playlists Favoritadas! 🎯</span>
                  </>
                ) : (
                  <>
                    <Youtube className="w-5 h-5 fill-white" />
                    <span>Subscreva aqui para acompanhar seu progresso</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Filtering controllers */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Real Search bar filter */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder={`Procurar em ${activeTab === 'podcast' ? 'Podcast' : 'MicroAprendizagem'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition duration-205"
              />
            </div>

            {/* Quick Filter buttons */}
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  statusFilter === 'all' 
                    ? 'bg-[#191922] text-white border border-white/5' 
                    : 'text-slate-400 hover:bg-[#1A1A20] hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('new')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  statusFilter === 'new' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-400 hover:bg-[#1A1A20] hover:text-white'
                }`}
              >
                Novos (últimos 7 dias)
              </button>
              <button
                onClick={() => setStatusFilter('unwatched')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  statusFilter === 'unwatched' 
                    ? 'bg-[#191922] text-slate-300 border border-white/5' 
                    : 'text-slate-400 hover:bg-[#1A1A20] hover:text-white'
                }`}
              >
                Não Assistidos
              </button>
              <button
                onClick={() => setStatusFilter('watched')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  statusFilter === 'watched' 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:bg-[#1A1A20] hover:text-white'
                }`}
              >
                Assistidos
              </button>
            </div>
          </div>
        </div>

        {/* 4. Multi-Pane Player & Playlist List Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Video list panel (Takes 7 cols on large screens, sorted chronologically latest first) */}
          <div className="lg:col-span-7 space-y-4 order-2 lg:order-1" id="playlist-view">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>Lista de Vídeos {activeTab === 'podcast' ? 'do Podcast' : 'da MicroAprendizagem'} ({filteredVideos.length})</span>
                </h3>
                <a 
                  href={activeTab === 'podcast' ? 'https://youtube.com/playlist?list=PLhUeluG4tU752tEp5UN1RAx-_6IY11z1B&si=iLYONPzMrVx6uwnY' : 'https://youtube.com/playlist?list=PLhUeluG4tU76J8zcSMy5cEgmLCjXGXRsr&si=RtDpPGwJNuSLewzK'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors pb-0.5"
                >
                  Ver Playlist no YouTube ↗
                </a>
              </div>
              <p className="text-xs text-slate-500 font-mono">Mais recentes primeiro</p>
            </div>

            {/* Dynamic Sync Status bar */}
            <div className="bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLoadingLive ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoadingLive ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                </span>
                <span>
                  {isLoadingLive 
                    ? 'Sincronizando com o canal do YouTube...' 
                    : lastUpdated 
                      ? `Sincronizado com o YouTube (Atualizado: ${new Date(lastUpdated).toLocaleTimeString()})`
                      : 'Sincronizado com o canal do YouTube em tempo real'}
                </span>
              </div>
              <button 
                onClick={() => fetchLivePlaylists(true)}
                disabled={isLoadingLive}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline text-left"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin text-blue-500' : ''}`} />
                Sincronizar Playlist
              </button>
            </div>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1C1C24] scrollbar-track-transparent">
              {filteredVideos.length > 0 ? (
                filteredVideos.map(video => (
                  <VideoItem
                    key={video.id}
                    video={video}
                    active={activeVideo?.id === video.id}
                    watched={progress.watchedVideos.includes(video.id)}
                    onPlay={() => {
                      setActiveVideo(video);
                      // Toggle watched automatically upon play to help progress tracking
                      if (!progress.watchedVideos.includes(video.id)) {
                        updateProgress({ watchedVideos: [...progress.watchedVideos, video.id] });
                      }
                      
                      // Smooth scroll to video player on smaller viewports
                      if (window.innerWidth < 1024) {
                        const playerElement = document.getElementById('main-video-player-container');
                        if (playerElement) {
                          playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    onToggleWatched={() => handleToggleWatched(video.id)}
                  />
                ))
              ) : (
                <div className="bg-[#15151A] rounded-2xl p-12 text-center border border-white/5 border-dashed space-y-2">
                  <p className="text-slate-400 text-sm font-semibold">Nenhum vídeo foi encontrado com esse filtro.</p>
                  <p className="text-slate-500 text-xs">Experimente digitar outro termo de busca ou redefinir os filtros rápidos.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-xs text-white rounded-lg hover:bg-blue-700 border border-blue-400/20 font-medium transition cursor-pointer"
                  >
                    Redefinir Filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Video Player & stats module (Takes 5 cols on large screens, floating index) */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4 lg:sticky lg:top-6" id="player-view">
            <div className="px-2">
              <h3 className="text-lg font-bold tracking-tight text-white">
                Player Auxiliar de Estudo
              </h3>
            </div>
            
            <VideoPlayer 
              video={activeVideo} 
            />
          </div>

        </div>

      </main>

      {/* 5. Subscription Step Assistant Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        progress={progress}
        onUpdateProgress={updateProgress}
      />

      {/* 6. Footer section */}
      <footer className="bg-[#0F0F12] border-t border-white/10 py-8 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <p className="font-semibold text-slate-400">
            Nilton Nascimento — Gestão, Liderança e Comportamento Humano © 2026
          </p>
          <div className="flex justify-center gap-4 text-slate-500">
            <a href="https://www.niltonnascimento.com/politica-de-privacidade" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Política de Privacidade</a>
            <span>•</span>
            <a href="https://www.youtube.com/@nilton_portuga" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Canal no YouTube</a>
            <span>•</span>
            <a href="https://www.niltonnascimento.com/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Website Oficial</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
