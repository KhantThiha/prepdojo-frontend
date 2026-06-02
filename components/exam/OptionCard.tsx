'use client';

import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface OptionCardProps {
  index: number;
  text: string;
  selected: boolean;
  correct?: boolean;
  incorrect?: boolean;
  showResult?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionCard({
  index,
  text,
  selected,
  correct = false,
  incorrect = false,
  showResult = false,
  onClick,
  disabled = false,
}: OptionCardProps) {
  // Determine card state classes
  const getCardClasses = () => {
    if (showResult) {
      if (correct) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      }
      if (incorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      }
    }
    if (selected) {
      return 'border-primary bg-primary/5';
    }
    return 'border-border hover:border-primary/50 hover:bg-muted/50';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full p-4 rounded-lg border-2 text-left transition-all',
        'flex items-start gap-3',
        getCardClasses(),
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={`Option ${index + 1}: ${text}`}
    >
      {/* Option Number */}
      <span
        className={cn(
          'flex items-center justify-center w-7 h-7 rounded-full border-2 text-sm font-medium shrink-0',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30',
          showResult && correct && 'border-green-600 bg-green-600 text-white',
          showResult && incorrect && 'border-red-600 bg-red-600 text-white'
        )}
      >
        {showResult && correct ? (
          <Check className="h-4 w-4" />
        ) : showResult && incorrect ? (
          <X className="h-4 w-4" />
        ) : (
          index + 1
        )}
      </span>

      {/* Option Text */}
      <span className="pt-0.5 flex-1">{text}</span>

      {/* Result Indicator */}
      {showResult && correct && (
        <Check className="h-5 w-5 text-green-600 shrink-0" />
      )}
      {showResult && incorrect && (
        <X className="h-5 w-5 text-red-600 shrink-0" />
      )}
    </button>
  );
}