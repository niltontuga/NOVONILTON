import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Youtube, 
  Bell, 
  Star, 
  Check, 
  X, 
  ArrowRight, 
  Activity,
  Heart
} from 'lucide-react';
import { UserProgress } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updates: Partial<UserProgress>) => void;
}

export default function SubscriptionModal({ 
  isOpen, 
  onClose, 
  progress, 
  onUpdateProgress 
}: SubscriptionModalProps): React.JSX.Element | null {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Restart step when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const handleSubscribeClick = () => {
    // Open Nilton's youtube channel in a new tab with sub_confirmation parameter
    window.open('https://www.youtube.com/@nilton_portuga?sub_confirmation=1', '_blank', 'noopener,noreferrer');
    
    // Smooth transition
    setLoading(true);
    setTimeout(() => {
      onUpdateProgress({ subscribed: true });
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleNotifyClick = () => {
    // Smooth transition for notification activation
    setLoading(true);
    setTimeout(() => {
      onUpdateProgress({ notified: true });
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleFavoriteClick = () => {
    setLoading(true);
    setTimeout(() => {
      onUpdateProgress({ favoritedPlaylists: ['podcast', 'micro'] });
      setLoading(false);
      setStep(4);
    }, 1200);
  };

  const handleFinish = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="subscription-modal-wrapper">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-[#0F0F12] border border-white/10 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl z-10 p-6 sm:p-8"
          id="subscription-modal"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400">
              <Youtube className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Assistente de Subscrição • Passo {Math.min(step, 3)} de 3
            </span>
          </div>

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-white">
                  Passo 1: Inscreva-se no Canal
                </h3>
                <p className="text-sm text-slate-350 leading-relaxed">
                  Para podermos acompanhar seu progresso, você precisa se inscrever no canal do YouTube de 
                  <strong className="text-blue-400"> Nilton Nascimento</strong>. Nós iremos abrir o link oficial 
                  com o lembrete de inscrição para você.
                </p>

                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
                  <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-normal">
                    Se você já for inscrito, clique no botão para confirmar a sua inscrição local e avançar para o próximo passo.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubscribeClick}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/40 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Redirecionando...' : 'Inscrever-se no Canal (@nilton_portuga)'}</span>
                    <Youtube className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-white">
                  Passo 2: Ative as Notificações
                </h3>
                <p className="text-sm text-slate-350 leading-relaxed">
                  Não perca nenhuma novidade do canal de Nilton Nascimento! Clique no sininho de notificações do canal para receber atualizações imediatas de novos episódios de podcasts e microaprendizagens.
                </p>

                <div className="bg-black/50 border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-4 text-center">
                  <motion.div 
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                    className="p-3 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/10"
                  >
                    <Bell className="w-8 h-8" />
                  </motion.div>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Ative as notificações para "Todas" na barra lateral de inscrições no YouTube para garantir o recebimento de avisos.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleNotifyClick}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-750 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 border border-blue-400/20"
                  >
                    <span>{loading ? 'Ativando Notificações...' : 'Confirmar Ativação do Sininho 🔔'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-white">
                  Passo 3: Favoritar as Playlists
                </h3>
                <p className="text-sm text-slate-350 leading-relaxed">
                  Para fixar o Podcast e a MicroAprendizagem em seu painel de acompanhamento inteligente e marcar como suas favoritas para acesso rápido.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a 
                    href="https://youtube.com/playlist?list=PLhUeluG4tU752tEp5UN1RAx-_6IY11z1B&si=iLYONPzMrVx6uwnY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-white/5 hover:border-blue-500/40 transition-colors cursor-pointer group text-left block"
                  >
                    <Star className="w-5 h-5 text-blue-400 fill-blue-500/20 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Podcast</p>
                      <p className="text-[10px] text-slate-505">Ver no YouTube ↗</p>
                    </div>
                  </a>
                  <a 
                    href="https://youtube.com/playlist?list=PLhUeluG4tU76J8zcSMy5cEgmLCjXGXRsr&si=RtDpPGwJNuSLewzK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-white/5 hover:border-blue-500/40 transition-colors cursor-pointer group text-left block"
                  >
                    <Star className="w-5 h-5 text-blue-400 fill-blue-500/20 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">MicroAprendizagem</p>
                      <p className="text-[10px] text-slate-505">Ver no YouTube ↗</p>
                    </div>
                  </a>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleFavoriteClick}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50 border border-blue-400/20 shadow-blue-900/20"
                  >
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{loading ? 'Adicionando aos Favoritos...' : 'Favoritar as Duas Playlists ⭐'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center py-6"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Subscrição Ativada com Sucesso!</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Parabéns! Suas inscrições e favoritos foram registrados localmente e sua conexão com o canal <span className="text-blue-400 font-semibold">@nilton_portuga</span> está estabelecida.
                  </p>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-white/5 max-w-sm mx-auto divide-y divide-white/5 text-left">
                  <div className="flex justify-between items-center py-2 text-xs">
                    <span className="text-slate-400">Inscrição no Canal:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">Inscrito <Check className="w-3.5 h-3.5" /></span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-xs">
                    <span className="text-slate-400">Notificações por Sininho:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">Ativo <Check className="w-3.5 h-3.5" /></span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-xs">
                    <span className="text-slate-400">Favorito (Podcast & Micro):</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">Favoritado <Check className="w-3.5 h-3.5" /></span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleFinish}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer border border-blue-400/20"
                  >
                    <span>Fechar e Ver meu Progresso</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
