'use client';

import { Question } from '@/app/types/exam';
import { OptionCard } from './OptionCard';
import { AudioPlayer } from './AudioPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: number;
  onAnswerSelect: (index: number) => void;
  disabled?: boolean;
  showCorrect?: boolean;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  disabled = false,
  showCorrect = false,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {question.section === 'reading' ? 'Reading Comprehension' : 
           question.section === 'listening' ? 'Listening Comprehension' :
           question.section === 'vocabulary' ? 'Vocabulary Question' :
           'Grammar Question'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Question Text */}
        <div className="text-lg font-medium whitespace-pre-wrap">
          {question.text}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <OptionCard
              key={index}
              index={index}
              text={option}
              selected={selectedAnswer === index}
              correct={showCorrect && index === question.correctIndex}
              incorrect={showCorrect && selectedAnswer === index && selectedAnswer !== question.correctIndex}
              showResult={showCorrect}
              onClick={() => onAnswerSelect(index)}
              disabled={disabled}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}