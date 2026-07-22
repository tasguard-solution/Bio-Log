import { useState, useMemo, useCallback } from 'react';
import { ScreenType, PastQuestion } from '../types';
import { PAST_QUESTIONS } from '../data/pastQuestions';
import {
  ArrowLeft, CheckCircle, XCircle, ChevronRight, ChevronLeft,
  RotateCcw, Trophy, Filter, BookOpen, Layers, Clock, Target,
} from 'lucide-react';

interface PastQuestionsScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

type Mode = 'browse' | 'quiz';

const TOPICS = [...new Set(PAST_QUESTIONS.map(q => q.topic))].sort();
const YEARS = [...new Set(PAST_QUESTIONS.map(q => q.year))].sort((a, b) => b - a);

export function PastQuestionsScreen({ onBack }: PastQuestionsScreenProps) {
  // Filters
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | 'all'>('all');
  const [mode, setMode] = useState<Mode>('browse');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return PAST_QUESTIONS.filter(q => {
      const yearOk = selectedYear === 'all' || q.year === selectedYear;
      const topicOk = selectedTopic === 'all' || q.topic === selectedTopic;
      return yearOk && topicOk;
    });
  }, [selectedYear, selectedTopic]);

  const startQuiz = useCallback(() => {
    setQuizIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setMode('quiz');
  }, []);

  const handleSelect = useCallback((opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === filtered[quizIndex].answer) setScore(s => s + 1);
  }, [answered, filtered, quizIndex]);

  const handleNext = useCallback(() => {
    if (quizIndex >= filtered.length - 1) {
      setFinished(true);
    } else {
      setQuizIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [quizIndex, filtered.length]);

  const currentQ: PastQuestion | undefined = filtered[quizIndex];
  const scorePercent = filtered.length > 0 ? Math.round((score / filtered.length) * 100) : 0;
  const optionKeys: Array<keyof PastQuestion['options']> = ['A', 'B', 'C', 'D'];

  // ── Finished ────────────────────────────────────────────────────────────────
  if (mode === 'quiz' && finished) {
    const passed = scorePercent >= 50;
    return (
      <div className="flex-1 bg-surface-container-low overflow-y-auto">
        <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
          <div className={`rounded-3xl border p-8 sm:p-12 text-center ${passed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100' : 'bg-amber-100'}`}>
              <Trophy className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-amber-500'}`} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-on-surface mb-2">
              {score}/{filtered.length} Correct
            </h2>
            <p className={`text-lg font-semibold mb-1 ${passed ? 'text-green-700' : 'text-amber-700'}`}>
              {scorePercent}% — {passed ? 'Excellent work! 🎉' : 'Keep revising!'}
            </p>
            <p className="text-sm text-on-surface-variant mb-8">
              {selectedYear !== 'all' ? `${selectedYear} questions` : 'All years'} ·{' '}
              {selectedTopic !== 'all' ? selectedTopic : 'All topics'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={startQuiz}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={() => setMode('browse')}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-outline-variant rounded-xl font-medium text-on-surface-variant hover:bg-surface transition-colors"
              >
                Browse Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz mode ────────────────────────────────────────────────────────────────
  if (mode === 'quiz' && currentQ) {
    const isCorrect = selected === currentQ.answer;
    return (
      <div className="flex-1 bg-surface-container-low overflow-y-auto">
        <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setMode('browse')}
              className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Quiz
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface-variant font-mono">
                {quizIndex + 1}/{filtered.length}
              </span>
              <div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((quizIndex + (answered ? 1 : 0)) / filtered.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Year badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold">
              <Clock className="w-3 h-3" /> WAEC {currentQ.year} {currentQ.paper}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-medium">
              <Layers className="w-3 h-3" /> {currentQ.topic}
            </span>
          </div>

          {/* Question card */}
          <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden mb-4">
            <div className="p-5 sm:p-6">
              <p className="font-serif text-base sm:text-lg font-semibold text-on-surface leading-relaxed mb-6">
                {currentQ.question}
              </p>

              <div className="space-y-2.5">
                {optionKeys.map(key => {
                  const text = currentQ.options[key];
                  const isSelected = selected === key;
                  const isCorrectOpt = key === currentQ.answer;
                  let cls = 'w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-200 ';
                  if (!answered) {
                    cls += 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low cursor-pointer active:scale-[0.99]';
                  } else if (isCorrectOpt) {
                    cls += 'border-green-300 bg-green-50 text-green-800';
                  } else if (isSelected) {
                    cls += 'border-red-300 bg-red-50 text-red-800';
                  } else {
                    cls += 'border-outline-variant/20 opacity-50';
                  }
                  return (
                    <button key={key} className={cls} onClick={() => handleSelect(key)} disabled={answered}>
                      <span className={`shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center mt-0.5 ${
                        answered && isCorrectOpt ? 'border-green-400 bg-green-100 text-green-700' :
                        answered && isSelected ? 'border-red-400 bg-red-100 text-red-700' :
                        'border-outline-variant text-on-surface-variant'
                      }`}>{key}</span>
                      <span className="flex-1 leading-relaxed">{text}</span>
                      {answered && isCorrectOpt && <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />}
                      {answered && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-4 space-y-3">
                  <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    <p className={`text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                      {isCorrect ? '✓ Correct!' : `✗ Correct Answer: ${currentQ.answer}`}
                    </p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{currentQ.explanation}</p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.99]"
                  >
                    {quizIndex >= filtered.length - 1 ? (
                      <><Trophy className="w-4 h-4" /> See Results</>
                    ) : (
                      <>Next Question <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Score running total */}
          <p className="text-center text-xs text-on-surface-variant">
            Score: {score}/{quizIndex + (answered ? 1 : 0)}
          </p>
        </div>
      </div>
    );
  }

  // ── Browse mode ──────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary leading-tight">
              WAEC Past Questions
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {PAST_QUESTIONS.length} questions · 2008–2017 · Biology Objective
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: BookOpen, label: 'Questions', value: PAST_QUESTIONS.length },
            { icon: Clock, label: 'Years', value: YEARS.length },
            { icon: Layers, label: 'Topics', value: TOPICS.length },
            { icon: Target, label: 'Filtered', value: filtered.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-surface rounded-xl border border-outline-variant/30 p-4 text-center">
              <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="font-serif text-2xl font-bold text-on-surface">{value}</div>
              <div className="text-xs text-on-surface-variant">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters + Start Quiz */}
        <div className="bg-surface rounded-2xl border border-outline-variant/30 p-4 sm:p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilter(f => !f)}
              className="flex items-center gap-2 px-3 py-2 border border-outline-variant/50 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <Filter className="w-4 h-4" /> Filters
              {(selectedYear !== 'all' || selectedTopic !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-primary ml-0.5" />
              )}
            </button>

            {showFilter && (
              <>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="flex-1 min-w-[120px] px-3 py-2 border border-outline-variant/40 rounded-lg text-sm bg-surface text-on-surface focus:outline-none focus:border-primary/50"
                >
                  <option value="all">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  className="flex-1 min-w-[140px] px-3 py-2 border border-outline-variant/40 rounded-lg text-sm bg-surface text-on-surface focus:outline-none focus:border-primary/50"
                >
                  <option value="all">All Topics</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {(selectedYear !== 'all' || selectedTopic !== 'all') && (
                  <button
                    onClick={() => { setSelectedYear('all'); setSelectedTopic('all'); }}
                    className="text-xs text-on-surface-variant hover:text-on-surface underline"
                  >
                    Clear
                  </button>
                )}
              </>
            )}

            <button
              disabled={filtered.length === 0}
              onClick={startQuiz}
              className="ml-auto px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 active:scale-95"
            >
              Start Quiz ({filtered.length}) →
            </button>
          </div>
        </div>

        {/* Question list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <BookOpen className="w-12 h-12 opacity-30 mx-auto mb-3" />
            <p>No questions match the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((q, i) => (
              <div key={q.id} className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden group hover:border-primary/20 transition-colors">
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-outline">Q{q.questionNumber}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3" /> {q.year} {q.paper}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-xs">
                      {q.topic}
                    </span>
                  </div>
                  <p className="font-serif font-semibold text-on-surface leading-snug mb-4">{q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {optionKeys.map(key => (
                      <div key={key} className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm ${key === q.answer ? 'border-green-300 bg-green-50 text-green-800' : 'border-outline-variant/20 text-on-surface-variant'}`}>
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs mt-0.5 ${key === q.answer ? 'bg-green-200 text-green-700' : 'bg-surface-container text-outline'}`}>{key}</span>
                        <span className="leading-relaxed">{q.options[key]}</span>
                      </div>
                    ))}
                  </div>
                  <details className="mt-3">
                    <summary className="text-xs text-primary cursor-pointer font-medium hover:underline">Show explanation</summary>
                    <p className="mt-2 text-xs text-on-surface-variant leading-relaxed bg-surface-container-low rounded-lg p-3 border border-outline-variant/20">
                      {q.explanation}
                    </p>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
