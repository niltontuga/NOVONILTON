import React from 'react';
import { UserProgress, Video } from '../types';
import { 
  CheckCircle2, 
  Tv, 
  Flame, 
  Sparkles, 
  Bookmark, 
  Youtube,
  Award,
  Bell
} from 'lucide-react';

interface StatsSectionProps {
  progress: UserProgress;
  totalVideos: number;
  onOpenSubscriptionModal: () => void;
}

export default function StatsSection({ progress, totalVideos, onOpenSubscriptionModal }: StatsSectionProps): React.JSX.Element {
  const watchedCount = progress.watchedVideos.length;
  const progressPercent = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  
  // Calculate continuous study streak based on watch history length to make progress interactive
  const streak = Math.min(watchedCount, 5) + (progress.subscribed ? 1 : 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard">
      {/* 1. Interactive Core Progress Card */}
      <div className="bg-[#15151A] border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-white/10 hover:bg-[#1C1C24] transition duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-[11px]">Aulas & Episódios</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{watchedCount}</span>
            <span className="text-xs text-slate-400">/ {totalVideos} Concluídos</span>
          </div>
          {/* Custom progress bar */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-black overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>{progressPercent}% Completo</span>
              <span>Rumo à Maestria!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Youtube Subscription Checklist Status */}
      <div className="bg-[#15151A] border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-white/10 hover:bg-[#1C1C24] transition duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-[11px]">Canal YouTube</span>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
            <Youtube className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-white">
              {progress.subscribed ? 'Inscrito Oficial ✅' : 'Não Inscrito ⚠️'}
            </span>
          </div>
          <p className="text-[11px] text-slate-550 leading-snug">
            {progress.subscribed 
              ? 'Conexão estabelecida com @nilton_portuga. Notificações e favoritos ativos.' 
              : 'Clique no botão para subscrever e favoritar as playlists.'}
          </p>
          {!progress.subscribed && (
            <button
              onClick={onOpenSubscriptionModal}
              className="text-blue-400 hover:text-blue-300 font-bold text-[10px] uppercase tracking-wider mt-2 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Inscrever-se Agora &rarr;
            </button>
          )}
        </div>
      </div>

      {/* 3. Favorite Tracks Status Card */}
      <div className="bg-[#15151A] border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-white/10 hover:bg-[#1C1C24] transition duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-[11px]">Playlists Favoritadas</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Bookmark className="w-4.5 h-4.5 text-blue-400 fill-blue-500/10" />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{progress.favoritedPlaylists.length}</span>
            <span className="text-xs text-slate-400">/ 2 Favoritas</span>
          </div>
          <p className="text-[11px] text-slate-550 leading-snug">
            {progress.favoritedPlaylists.length === 2 
              ? 'Episódios e MicroAprendizagens fixados no seu painel principal.' 
              : 'Subscreva no canal para favoritar ambas as playlists instantaneamente.'}
          </p>
        </div>
      </div>

      {/* 4. Active Learning Streak Card */}
      <div className="bg-[#15151A] border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-white/10 hover:bg-[#1C1C24] transition duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-[11px]">Flama de Aprendizado</span>
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <Flame className="w-4.5 h-4.5 text-orange-400 fill-orange-400/10" />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{streak}</span>
            <span className="text-xs text-slate-400">Pontos de XP</span>
          </div>
          <p className="text-[11px] text-slate-550 leading-snug">
            Acumule XP assistindo as aulas e participando do canal para expandir sua inteligência de gestão.
          </p>
        </div>
      </div>
    </div>
  );
}
