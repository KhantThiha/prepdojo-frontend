"use client";

import { updateQuizMetadata } from "@/app/actions/update-quiz";
import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};
type QuizResult = {
  score: number;
  answers: Record<number, number>; // Map of Question Index -> Selected Option Index
  completed_at: string;
};
type QuizDeckProps = {
  input: {
    questions: Question[];
  };
  messageId: string; // <--- NEW PROP
  initialQuizResult?: QuizResult; // <--- NEW PROP
};

export function QuizCard({ input, messageId, initialQuizResult }: QuizDeckProps) {
  if (!input || !input.questions) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>(
    initialQuizResult?.answers || {} 
  );
  const [showResult, setShowResult] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(!!initialQuizResult);
  const currentQuestion = input.questions[currentIndex];
  const [isSaving, setIsSaving] = useState(false);

  const handleOptionClick = (index: number) => {
    // Prevent changing if already answered for this question
    if (userAnswers[currentIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: index,
    }));
    setShowResult(true);
  };

  const handleNext = async () => {
    if (currentIndex < input.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowResult(false);
    } else {
      // Quiz Finished! - Save to Backend
      if (!isSaved) {
        setIsSaving(true); // <--- SET SAVING TRUE
        try {
          const score = Object.values(userAnswers).filter(
            (ans, idx) => ans === input.questions[idx].correct_index
          ).length;

          console.log("Saving Quiz:", { messageId, score, answers: userAnswers }); // <--- DEBUG LOG

          // Call Server Action
          await updateQuizMetadata({
            messageId: messageId,
            score: score,
            answers: userAnswers,
          });
          
          setIsSaved(true);
          console.log("Quiz saved successfully!");
        } catch (error) {
          console.error("Failed to save quiz:", error);
          alert("Failed to save your progress. Please try again."); // <--- USER ALERT
        } finally {
          setIsSaving(false); // <--- SET SAVING FALSE
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowResult(true); // Show result when going back to previous
    }
  };
  const currentScore = Object.values(userAnswers).filter(
    (ans, idx) => ans === input.questions[idx].correct_index
  ).length;

  // Button Styling
  const getButtonStyle = (index: number) => {
    const selectedAnswer = userAnswers[currentIndex];
    const isAnswered = selectedAnswer !== undefined;
    
    // Default (Unanswered)
    let style = "w-full text-left px-4 py-3 rounded-md border transition-all duration-200 flex items-start gap-3 text-sm border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 cursor-pointer";

    if (isAnswered) {
      // Disable hover effects
      style = "w-full text-left px-4 py-3 rounded-md border transition-all duration-200 flex items-start gap-3 text-sm cursor-default";
      
      const isSelected = index === selectedAnswer;
      const isCorrect = index === currentQuestion.correct_index;

      if (isCorrect) {
        style += " border-green-500 bg-green-50 text-green-900 font-medium";
      } else if (isSelected) {
        style += " border-red-500 bg-red-50 text-red-900";
      } else {
        style += " border-gray-100 bg-gray-50 opacity-50";
      }
    }
    
    return style;
  };

  return (
    <div className="my-6 w-full max-w-2xl border rounded-lg p-6 bg-white shadow-sm">
      {/* Header: Progress */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div className="text-sm font-medium text-gray-500">
          Question {currentIndex + 1} / {input.questions.length}
        </div>
        {/* Optional: Simple Score Calculation */}
        <div className="text-sm font-bold text-blue-600">
          Score: {currentScore} / {input.questions.length}
          {isSaved && <span className="text-xs text-green-600 ml-2">✔ Saved</span>}
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold leading-relaxed text-gray-900 mb-4">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={getButtonStyle(index)}
              disabled={userAnswers[currentIndex] !== undefined}
            >
              <span className="mt-0.5 shrink-0 font-medium text-gray-400">
                {String.fromCharCode(65 + index)}.
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {userAnswers[currentIndex] !== undefined && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className={`p-3 rounded-md text-sm border ${
              userAnswers[currentIndex] === currentQuestion.correct_index
                ? "bg-green-50 text-green-800 border-green-100"
                : "bg-red-50 text-red-800 border-red-100"
            }`}>
              <span className="font-semibold block mb-1">
                {userAnswers[currentIndex] === currentQuestion.correct_index ? "✅ Correct!" : "❌ Incorrect"}
              </span>
              {currentQuestion.explanation}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Navigation Arrows */}
      <div className="flex justify-between items-center pt-4 border-t mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {currentIndex < input.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={userAnswers[currentIndex] === undefined}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={userAnswers[currentIndex] === undefined || isSaving} // Disable while saving
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Finish & Save →"} {/* <--- FEEDBACK */}
          </button>
        )}
      </div>
    </div>
  );
}