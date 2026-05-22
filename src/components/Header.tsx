import React from 'react';
import { ExternalLink } from 'lucide-react';

interface HeaderProps {
  onGoToSite: () => void;
}

export default function Header({ onGoToSite }: HeaderProps): React.JSX.Element {
  return (
    <header className="w-full bg-[#0F0F12] text-white border-b border-white/10 shadow-2xl" id="app-header">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Profile and Titles */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center">
            {/* Elegant Letter Monogram for Nilton */}
            <div className="w-full h-full rounded-full bg-[#0F0F12] flex items-center justify-center font-extrabold text-2xl text-blue-400">
              NN
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Nilton <span className="text-blue-500">Nascimento</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Action button "Ir para o site" */}
        <button
          onClick={onGoToSite}
          id="btn-goto-site"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all border border-blue-400/20 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/40"
        >
          <span>Ir para o site</span>
          <ExternalLink className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  );
}
