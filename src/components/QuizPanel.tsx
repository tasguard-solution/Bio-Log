import { useState, useCallback } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, BookOpen } from 'lucide-react';

interface QuizPanelProps {
  organismId: string;
  onScoreSave?: (correct: number, total: number) => void;
}

type QuizState = 'idle' | 'active' | 'answered' | 'finished';

export function QuizPanel({ organismId, onScoreSave }: QuizPanelProps) {
  const questions: QuizQuestion[] = QUIZ_QUESTIONS.filter(q => q.organismId === organismId);

  const [state, setState] = useState<QuizState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleStart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setState('active');
  };

  const handleSelect = useCallback((idx: number) => {
    if (state !== 'active') return;
    setSelectedOption(idx);
    setState('answered');
    if (idx === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  }, [state, currentQ?.correctIndex]);

  const handleNext = () => {
    if (isLast) {
      const finalScore = selectedOption === currentQ.correctIndex ? score : score;
      onScoreSave?.(finalScore, questions.length);
      setState('finished');
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setState('active');
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const scorePercent = Math.round((score / questions.length) * 100);

  // ── Idle state ──────────────────────────────────────────────────────────────
  if (state === 'idle') {
    return (
      <div className="mt-8 border-t border-outline-variant/30 pt-8">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif font-bold text-on-surface text-lg leading-snug">Quick Quiz</p>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Test your understanding of this topic — {questions.length} question{questions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleStart}
            className="shrink-0 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  // ── Finished state ──────────────────────────────────────────────────────────
  if (state === 'finished') {
    const passed = scorePercent >= 60;
    return (
      <div className="mt-8 border-t border-outline-variant/30 pt-8">
        <div className={`rounded-2xl border p-6 text-center ${passed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <Trophy className={`w-10 h-10 mx-auto mb-3 ${passed ? 'text-green-600' : 'text-amber-500'}`} />
          <p className="font-serif font-bold text-2xl text-on-surface mb-1">
            {score}/{questions.length} Correct
          </p>
          <p className={`text-sm font-medium mb-1 ${passed ? 'text-green-700' : 'text-amber-700'}`}>
            {scorePercent}% — {passed ? 'Great work! 🎉' : 'Keep revising and try again!'}
          </p>
          <p className="text-xs text-on-surface-variant mb-5">Progress saved automatically</p>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Active / Answered state ─────────────────────────────────────────────────
  return (
    <div className="mt-8 border-t border-outline-variant/30 pt-8">
      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs font-semibold text-outline uppercase tracking-wider">
              Quick Quiz
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant">
              Q{currentIndex + 1} of {questions.length}
            </span>
            {/* Progress bar */}
            <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + (state === 'answered' ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-5">
          <p className="font-serif text-base sm:text-lg font-semibold text-on-surface leading-relaxed mb-5">
            {currentQ.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isCorrect = idx === currentQ.correctIndex;
              const isSelected = idx === selectedOption;
              const revealed = state === 'answered';

              let classes = 'w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-200 ';
              if (!revealed) {
                classes += 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low active:scale-[0.99] cursor-pointer';
              } else if (isCorrect) {
                classes += 'border-green-300 bg-green-50 text-green-800';
              } else if (isSelected && !isCorrect) {
                classes += 'border-red-300 bg-red-50 text-red-800';
              } else {
                classes += 'border-outline-variant/20 opacity-50';
              }

              return (
                <button
                  key={idx}
                  className={classes}
                  onClick={() => handleSelect(idx)}
                  disabled={revealed}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center mt-0.5 ${
                    revealed && isCorrect ? 'border-green-400 bg-green-100 text-green-700' :
                    revealed && isSelected && !isCorrect ? 'border-red-400 bg-red-100 text-red-700' :
                    'border-outline-variant text-on-surface-variant'
                  }`}>
                    {optionLabels[idx]}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {revealed && isCorrect && <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />}
                  {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation + Next */}
          {state === 'answered' && (
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <p className="text-xs font-mono font-semibold text-outline uppercase tracking-wider mb-1.5">Explanation</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{currentQ.explanation}</p>
              </div>
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.99]"
              >
                {isLast ? (
                  <><Trophy className="w-4 h-4" /> See Results</>
                ) : (
                  <>Next Question <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
