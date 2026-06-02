import { useState } from 'react';
import { Play, Pause, Headphones, Repeat, Info, Settings2, Volume2, VolumeX } from 'lucide-react';
import { WaveformPlayer, formatTime, useAudioPlayer } from 'wavesurf';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const { isPlaying, togglePlay, currentSong, play, volume, setVolume, currentTime, duration } = useAudioPlayer();
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  if (!src) return null;

  const handlePlay = () => {
    if (currentSong?.audioUrl === src) {
      togglePlay();
    } else {
      play({
        id: src,
        title: 'Listening Practice',
        audioUrl: src,
      });
    }
  };

  const isCurrentAudio = currentSong?.audioUrl === src;

  return (
    <div className="w-full mx-auto space-y-4">
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#3182ed]/10 text-[#3182ed] rounded-xl font-bold">
                <Headphones className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Listening Audio</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Section: Listening Comprehension</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Speed */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 text-slate-600 dark:text-slate-400">
                    <Settings2 className="size-4" />
                    <span className="text-xs font-medium">{playbackSpeed}x</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={playbackSpeed === speed ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}
                    >
                      {speed}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Volume Control */}
              <div className="flex items-center gap-2 group">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                  className="text-slate-400 hover:text-[#3182ed] transition-colors"
                >
                  {volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3182ed] opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Waveform Area */}
          <div className="relative py-2 flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              className="size-12 rounded-full border-2 border-[#3182ed] text-[#3182ed] hover:bg-[#3182ed] hover:text-white shrink-0 shadow-sm"
              onClick={handlePlay}
            >
              {isPlaying && isCurrentAudio ? (
                <Pause className="size-6 fill-current" />
              ) : (
                <Play className="size-6 fill-current ml-1" />
              )}
            </Button>

            <div className="flex-1 space-y-1">
              <WaveformPlayer
                song={{
                  id: src,
                  title: 'Listening Practice',
                  audioUrl: src,
                }}
                waveformConfig={{
                  height: 60,
                  waveColor: '#e2e8f0',
                  progressColor: '#3182ed',
                  cursorColor: '#3182ed',
                  barWidth: 3,
                  barGap: 3,
                  barRadius: 3,
                }}
                showTime={false}
                className="waveform-custom"
              />
              <div className="flex justify-end pr-1">
                <span className="text-[10px] font-mono font-medium text-slate-400 tracking-wider">
                  {isCurrentAudio ? `${formatTime(currentTime)} / ${formatTime(duration)}` : `0:00 / 0:00`}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info className="size-3" />
              <span>You can listen to this audio once during the exam.</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-[#3182ed] transition-colors">
                <Repeat className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}