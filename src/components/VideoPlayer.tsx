import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video } from '../types';
import { Sparkles, HelpCircle, AlertCircle, Eye, Subtitles } from 'lucide-react';

interface VideoPlayerProps {
  video: Video | null;
  onVideoEnded?: () => void;
}

export default function VideoPlayer({ video, onVideoEnded }: VideoPlayerProps): React.JSX.Element {
  const [showWatermarkTip, setShowWatermarkTip] = useState(true);

  useEffect(() => {
    if (video) {
      // Automatically reset tip visibility when video changes
      setShowWatermarkTip(true);
      const timer = setTimeout(() => {
        setShowWatermarkTip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [video]);

  if (!video) {
    return (
      <div className="w-full aspect-video bg-linear-to-br from-[#15151A] to-[#0A0A0C] rounded-xl flex flex-col items-center justify-center p-8 border border-white/5 text-center gap-4 relative overflow-hidden group">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-x-0 inset-y-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-full bg-[#1C1C24] border border-white/10 flex items-center justify-center text-blue-500 mb-2 group-hover:scale-105 transition duration-300">
          <Eye className="w-8 h-8" />
        </div>
        <div className="space-y-1 z-10">
          <h3 className="text-lg font-semibold text-slate-200">Selecione um vídeo para começar</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Escolha qualquer episódio na lista abaixo sabendo que seu progresso é salvo instantaneamente.
          </p>
        </div>
      </div>
    );
  }

  const isPodcast = video.type === 'podcast';
  
  // Format the YouTube Embed URL
  // For podcast: force captions via cc_load_policy=1 and set portuguese language hl=pt
  const embedBase = `https://www.youtube.com/embed/${video.id}`;
  const embedParams = isPodcast
    ? `?autoplay=1&cc_load_policy=1&hl=pt&cc_lang_pref=pt&iv_load_policy=3&rel=0`
    : `?autoplay=1&iv_load_policy=3&rel=0`;
  const embedUrl = `${embedBase}${embedParams}`;

  return (
    <div className="space-y-3" id="main-video-player-container">
      {/* Dynamic Player Wrapper */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10 group">
        
        {/* Iframe element */}
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0 z-0"
          id={`youtube-iframe-${video.id}`}
        />

        {/* PODCAST SPECIAL: White watermark in absolute center of the video */}
        {isPodcast && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
            id={`watermark-overlay-${video.id}`}
          >
            <div className="text-white font-extrabold text-xs sm:text-base md:text-lg lg:text-xl opacity-20 tracking-wider uppercase text-center select-none bg-black/20 p-4 rounded-xl border border-white/5 shadow-2xl backdrop-blur-[0.5px] max-w-[80%] leading-relaxed pointer-events-none break-words">
              {video.title}
            </div>
          </div>
        )}

        {/* Podcast subtitles badge indicator */}
        {isPodcast && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white border border-white/10 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            <Subtitles className="w-3 text-blue-400 shrink-0" />
            <span>Legendas Automáticas Ativas</span>
          </div>
        )}
      </div>

      {/* Video Details Card below the player */}
      <div className="bg-[#15151A] border border-white/5 p-5 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isPodcast 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                {isPodcast ? '🎙️ Podcast' : '💡 MicroAprendizagem'}
              </span>
              <span className="text-xs text-slate-500 font-mono">{video.duration}</span>
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight sm:text-xl leading-tight">
              {video.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-450 leading-relaxed font-normal">
          {video.description}
        </p>

        {/* Adaptive Mode Alert Banner */}
        <AnimatePresence>
          {isPodcast && showWatermarkTip && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs p-3.5 rounded-xl flex gap-2.5 items-start overflow-hidden"
            >
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-400">Modo de Exibição de Podcast Premium</p>
                <p className="mt-0.5 leading-normal opacity-90">
                  Como este é um episódio de Podcast, a reprodução possui <span className="underline font-medium">Legendas Automáticas</span> ativadas no player e uma <span className="underline font-medium">marca d'água</span> persistente centralizada com o título do vídeo de forma transparente.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
