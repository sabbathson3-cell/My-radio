/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Search, 
  Radio, 
  Heart, 
  Share2, 
  Info,
  ChevronRight,
  Music2,
  Newspaper,
  Mic2,
  Globe
} from 'lucide-react';
import { STATIONS } from './constants';
import { RadioStation } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = ['All', 'News', 'Music', 'Talk', 'General'];

  const filteredStations = STATIONS.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         station.frequency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || station.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStationSelect = (station: RadioStation) => {
    if (currentStation?.id === station.id) {
      togglePlay();
    } else {
      setPlaybackError(null);
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentStation) return;
    if (playbackError) {
      setPlaybackError(null);
      if (audioRef.current) {
        audioRef.current.load();
      }
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (currentStation) {
        // When station changes, we should ensure the audio element loads the new source
        audioRef.current.load();
      }
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Playback failed:", err);
            setPlaybackError("Unable to play this station. It might be offline.");
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentStation]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-brand-olive"
          >
            <Radio className="w-6 h-6" />
            <span className="uppercase tracking-[0.2em] text-xs font-semibold">Live from Nepal</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif font-medium leading-none"
          >
            Hamro <span className="italic">Radio</span>
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative w-full md:w-80"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-olive/50" />
          <input 
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-brand-olive/20 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all font-serif italic text-lg"
          />
        </motion.div>
      </header>

      {/* Categories */}
      <nav className="px-6 md:px-12 mb-12 overflow-x-auto no-scrollbar">
        <div className="flex gap-4">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-brand-olive text-white shadow-lg" 
                  : "bg-white/50 text-brand-olive hover:bg-white border border-brand-olive/10"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredStations.map((station, idx) => (
              <motion.div
                layout
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleStationSelect(station)}
                className={cn(
                  "group relative p-6 rounded-[32px] transition-all cursor-pointer overflow-hidden",
                  currentStation?.id === station.id 
                    ? "bg-brand-olive text-white shadow-2xl scale-[1.02]" 
                    : "bg-white hover:shadow-xl border border-brand-olive/5"
                )}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <img 
                      src={station.logoUrl} 
                      alt={station.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-brand-cream/20"
                      referrerPolicy="no-referrer"
                    />
                    {currentStation?.id === station.id && isPlaying && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg">
                        <div className="flex gap-0.5 items-end h-4 w-4">
                          {[1, 2, 3].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                              className="w-1 bg-brand-olive rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold",
                    currentStation?.id === station.id ? "bg-white/20" : "bg-brand-cream text-brand-olive"
                  )}>
                    {station.category}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-serif font-semibold">{station.name}</h3>
                  <p className={cn(
                    "text-sm font-medium opacity-70",
                    currentStation?.id === station.id ? "text-white" : "text-brand-olive"
                  )}>
                    {station.frequency} • {station.location}
                  </p>
                </div>

                <div className={cn(
                  "mt-6 flex items-center gap-2 text-xs font-medium transition-all",
                  currentStation?.id === station.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <span>Listen Now</span>
                  <ChevronRight className="w-3 h-3" />
                </div>

                {/* Decorative background element */}
                <div className={cn(
                  "absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-3xl transition-all",
                  currentStation?.id === station.id ? "bg-white/20" : "bg-brand-olive/5"
                )} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Player Bar */}
      <AnimatePresence>
        {currentStation && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500",
              isScrolled ? "px-4 pb-4 md:px-24 md:pb-4" : "px-4 pb-4 md:px-12 md:pb-8"
            )}
          >
            <motion.div 
              layout
              className={cn(
                "max-w-7xl mx-auto glass shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 transition-all duration-500",
                isScrolled ? "rounded-[30px] p-3 md:p-4" : "rounded-[40px] p-4 md:p-6"
              )}
            >
              {/* Station Info */}
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <motion.img 
                  layout
                  src={currentStation.logoUrl} 
                  alt={currentStation.name}
                  className={cn(
                    "rounded-full object-cover shadow-md transition-all duration-500",
                    isScrolled ? "w-10 h-10" : "w-14 h-14"
                  )}
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <motion.h4 layout className={cn(
                    "font-serif font-bold truncate transition-all duration-500",
                    isScrolled ? "text-lg" : "text-xl"
                  )}>
                    {currentStation.name}
                  </motion.h4>
                  {playbackError ? (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{playbackError}</p>
                  ) : (
                    !isScrolled && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-brand-olive/60 font-medium truncate"
                      >
                        {currentStation.frequency} • {currentStation.location}
                      </motion.p>
                    )
                  )}
                </div>
                {!isScrolled && (
                  <button className="p-2 hover:bg-brand-olive/5 rounded-full transition-colors">
                    <Heart className="w-5 h-5 text-brand-olive/40 hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-1 w-full md:w-1/3">
                <div className="flex items-center gap-6 md:gap-8">
                  {!isScrolled && (
                    <button className="p-2 text-brand-olive/40 hover:text-brand-olive transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  )}
                  <motion.button 
                    layout
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className={cn(
                      "bg-brand-olive text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-brand-olive/20 transition-all duration-500",
                      isScrolled ? "w-12 h-12" : "w-16 h-16"
                    )}
                  >
                    {isPlaying ? (
                      <Pause className={cn("fill-current", isScrolled ? "w-5 h-5" : "w-8 h-8")} />
                    ) : (
                      <Play className={cn("fill-current ml-1", isScrolled ? "w-5 h-5" : "w-8 h-8")} />
                    )}
                  </motion.button>
                  {!isScrolled && (
                    <button className="p-2 text-brand-olive/40 hover:text-brand-olive transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {isPlaying && !isScrolled && (
                  <div className="flex gap-1 items-end h-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                        transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: i * 0.05 }}
                        className="w-0.5 bg-brand-olive/30 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Volume */}
              <div className="flex items-center gap-4 w-full md:w-1/3 justify-end">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-brand-olive/60 hover:text-brand-olive transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className={cn(
                    "accent-brand-olive transition-all duration-500",
                    isScrolled ? "w-16 md:w-24" : "w-24 md:w-32"
                  )}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={currentStation?.streamUrl}
        onPlay={() => {
          setIsPlaying(true);
          setPlaybackError(null);
        }}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio element error:", e);
          setPlaybackError("Station offline or unsupported format.");
          setIsPlaying(false);
        }}
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Footer Info */}
      <footer className="px-6 md:px-12 py-12 border-t border-brand-olive/10 mt-12 bg-white/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h5 className="text-xl font-serif font-bold">About Hamro Radio</h5>
            <p className="text-sm text-brand-olive/70 leading-relaxed">
              Bringing the sounds of Nepal to your fingertips. Stream your favorite local FM stations, 
              stay updated with news, and enjoy the best of Nepali music from anywhere in the world.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="text-xl font-serif font-bold">Categories</h5>
            <ul className="text-sm text-brand-olive/70 space-y-2">
              <li className="flex items-center gap-2"><Newspaper className="w-4 h-4" /> News & Current Affairs</li>
              <li className="flex items-center gap-2"><Music2 className="w-4 h-4" /> Pop, Folk & Classical Music</li>
              <li className="flex items-center gap-2"><Mic2 className="w-4 h-4" /> Talk Shows & Podcasts</li>
              <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> Community Radio</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-xl font-serif font-bold">Connect</h5>
            <p className="text-sm text-brand-olive/70">
              Made with ❤️ for the Nepali community.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-olive/5 flex items-center justify-center hover:bg-brand-olive/10 cursor-pointer transition-colors">
                <Share2 className="w-4 h-4 text-brand-olive" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-brand-olive/5 text-center text-[10px] uppercase tracking-[0.2em] text-brand-olive/40 font-bold">
          © 2024 Nepali Hamro Radio • All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
