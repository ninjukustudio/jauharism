import React, { useState } from "react";
import { Download, Smartphone, X, Check } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall.ts";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone mode as installed PWA, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <>
        <button
          id="pwa-install-header-btn"
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800/80 border border-stone-800 transition-colors"
          title="Install Project Jauhari Progressive Web App"
        >
          {installSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Installed</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Install App</span>
            </>
          )}
        </button>
      </>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800/80 border border-stone-800 transition-colors"
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-stone-900 border border-stone-800 p-6 shadow-2xl text-stone-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img src="/icon.svg" alt="Project Jauhari Emblem" className="w-10 h-10 rounded-xl" />
                <div>
                  <h3 className="font-cinzel font-bold text-amber-300 text-sm">Install Project Jauhari</h3>
                  <p className="text-[11px] text-stone-400">iOS Safari Installation Guide</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-300 bg-stone-950/80 p-3.5 rounded-xl border border-stone-850">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    1
                  </span>
                  <p>
                    Tap the <strong className="text-white">Share</strong> button in the Safari toolbar at the bottom of the screen.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    2
                  </span>
                  <p>
                    Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    3
                  </span>
                  <p>
                    Confirm by tapping <strong className="text-amber-400">Add</strong> in the top right corner.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
