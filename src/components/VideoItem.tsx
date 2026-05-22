import React from 'react';
import { Video } from '../types';
import { Play, Check, Circle, Eye, Clock, CalendarDays } from 'lucide-react';

interface VideoItemProps {
  key?: React.Key;
  video: Video;
  active: boolean;
  watched: boolean;
  onPlay: () => void;
  onToggleWatched: () => void;
}

export default function VideoItem({ 
  video, 
  active, 
  watched, 
  onPlay, 
  onToggleWatched 
}: VideoItemProps): React.JSX.Element {
  const isNew = video.dateOffsetDays <= 7;
  const isPodcast = video.type === 'podcast';

  // YouTube high quality video thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;

  return (
    <div 
      onClick={onPlay}
      className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left gap-4 select-none ${
        active 
          ? 'bg-[#1C1C24] border-blue-500/60 shadow-lg shadow-blue-500/5' 
          : 'bg-[#15151A] border-white/5 hover:bg-[#1C1C24] hover:border-white/20'
      }`}
      id={`video-item-${video.id}`}
    >
      {/* 1. Left Section - Video Thumbnail / Image */}
      <div className="flex items-start sm:items-center gap-4 w-full md:w-auto flex-1">
        {/* Responsive Thumbnail wrapper */}
        <div className="relative w-32 h-18 sm:w-36 sm:h-20 rounded-xl overflow-hidden bg-[#0A0A0C] border border-white/10 flex-shrink-0 shadow-md">
          {/* Real Youtube Thumbnail */}
          <img 
            src={thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to elegant gradient if image fails
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80`;
            }}
          />
          {/* Subtle play hover overlay */}
          <div className="absolute inset-x-0 inset-y-0 bg-[#0A0A0C]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
              <Play className="w-4 h-4 fill-white text-white" />
            </div>
          </div>
          
          {/* Duration Badge */}
          <span className="absolute bottom-1.5 right-1.5 bg-black/85 backdrop-blur-xs text-[10px] font-mono text-slate-300 px-1.5 py-0.5 rounded font-black tracking-wide">
            {video.duration}
          </span>
        </div>

        {/* 2. Middle Section - Context & Titles */}
        <div className="space-y-1.5 flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
              isPodcast ? 'bg-blue-500/10 text-blue-400' : 'bg-indigo-400/10 text-indigo-400'
            }`}>
              {isPodcast ? 'Podcast' : 'Micro'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {video.duration}</span>
          </div>

          <h4 className={`text-sm sm:text-base font-semibold leading-tight mb-1 transition-colors duration-200 ${
            active ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'
          }`}>
            {video.title}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-1 max-w-lg">
            {video.description}
          </p>
        </div>
      </div>

      {/* 3. Right Section - Date & Progress Badges (The core requested block) */}
      <div 
        className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t border-white/5 md:border-t-0 p-2 md:p-0 pt-3 md:pt-0 w-full md:w-auto shrink-0 gap-3"
      >
        {/* High-level status indicating: Novo (within 7 days) or Mais Antigo (> 7 days) */}
        <div>
          {isNew ? (
            <div className="text-xs font-bold uppercase tracking-wider text-green-400">
              Novo
            </div>
          ) : (
            <div className="text-xs font-bold uppercase tracking-wider text-slate-550">
              Mais Antigo
            </div>
          )}
        </div>

        {/* Checked Watched and Unwatched actions */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Stop parent bubble event
            onToggleWatched();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-205 inline-flex items-center gap-1.5 border cursor-pointer hover:scale-102 ${
            watched 
              ? 'bg-blue-500/10 border-blue-500/20 text-slate-400 hover:text-slate-300' 
              : 'bg-red-650/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
          }`}
          title={watched ? 'Remover dos assistidos' : 'Marcar como assistido'}
        >
          {watched ? (
            <>
              <Check className="w-3.5 h-3.5 text-blue-400 stroke-[3]" />
              <span>Assistido</span>
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5" />
              <span>Não Assistido</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
