import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, CheckCircle, Play } from 'lucide-react';
import { DnaProgressBar } from '../components/DnaProgressBar';

interface StudentAssignmentsScreenProps {
  user: any;
  onBack: () => void;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface QuizResult {
  quiz_id: string;
  score: number;
  total_questions: number;
}

interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correct_index: number;
  explanation: string;
}

export const StudentAssignmentsScreen: React.FC<StudentAssignmentsScreenProps> = ({ user, onBack }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<Record<string, QuizResult>>({});
  const [loading, setLoading] = useState(true);
  
  // Quiz taking state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    fetchQuizzesAndResults();
  }, [user.id]);

  const fetchQuizzesAndResults = async () => {
    setLoading(true);
    
    // Find school id for this student
    const { data: studentData } = await supabase
      .from('students')
      .select('school_id')
      .eq('id', user.id)
      .single();
      
    if (studentData?.school_id) {
      // Fetch quizzes
      const { data: quizzesData } = await supabase
        .from('custom_quizzes')
        .select('*')
        .eq('school_id', studentData.school_id)
        .order('created_at', { ascending: false });
        
      if (quizzesData) setQuizzes(quizzesData);
      
      // Fetch results
      const { data: resultsData } = await supabase
        .from('student_quiz_results')
        .select('*')
        .eq('student_id', user.id);
        
      if (resultsData) {
        const resultMap: Record<string, QuizResult> = {};
        resultsData.forEach(r => {
          resultMap[r.quiz_id] = r;
        });
        setResults(resultMap);
      }
    }
    setLoading(false);
  };

  const handleTakeQuiz = async (quiz: Quiz) => {
    setLoading(true);
    const { data } = await supabase
      .from('custom_quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id);
      
    if (data && data.length > 0) {
      setQuestions(data as Question[]);
      setActiveQuiz(quiz);
      setCurrentQIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      setQuizFinished(false);
    } else {
      alert('This quiz has no questions yet.');
    }
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQIndex].correct_index) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Finish quiz
      setQuizFinished(true);
      await saveResult();
    }
  };

  const saveResult = async () => {
    if (!activeQuiz) return;
    try {
      await supabase.from('student_quiz_results').insert([{
        student_id: user.id,
        quiz_id: activeQuiz.id,
        score,
        total_questions: questions.length
      }]);
      // Update local results
      setResults({
        ...results,
        [activeQuiz.id]: {
          quiz_id: activeQuiz.id,
          score,
          total_questions: questions.length
        }
      });
    } catch (err) {
      console.error('Error saving result:', err);
    }
  };

  const handleCloseQuiz = () => {
    setActiveQuiz(null);
    fetchQuizzesAndResults();
  };

  if (loading && !activeQuiz) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (activeQuiz) {
    if (quizFinished) {
      const percentage = Math.round((score / questions.length) * 100);
      return (
        <div className="flex-1 bg-surface-container-low overflow-y-auto font-sans h-full flex flex-col items-center justify-center p-6">
          <div className="bg-surface rounded-3xl border border-surface-container-high p-8 max-w-md w-full text-center shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-on-surface mb-2">Quiz Complete!</h2>
            <p className="text-on-surface-variant mb-8">You scored {score} out of {questions.length}</p>
            
            <div className="mb-8">
              <DnaProgressBar percent={percentage} level={1} />
              <p className="text-sm font-bold text-primary mt-2">{percentage}% Score</p>
            </div>
            
            <button 
              onClick={handleCloseQuiz}
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Back to Assignments
            </button>
          </div>
        </div>
      );
    }

    const q = questions[currentQIndex];
    return (
      <div className="flex-1 bg-surface-container-low overflow-y-auto font-sans h-full flex flex-col">
        <div className="bg-surface border-b border-surface-container-high p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={handleCloseQuiz} className="p-2 hover:bg-surface-container rounded-lg">
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <h1 className="text-xl font-bold text-on-surface line-clamp-1">{activeQuiz.title}</h1>
          </div>
          <div className="text-sm font-medium text-on-surface-variant">
            Question {currentQIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8">
          <div className="bg-surface rounded-2xl border border-surface-container-high p-6 sm:p-10 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-8">{q.question}</h2>
            
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                
                if (!showExplanation) {
                  btnClass += "border-surface-container-high hover:border-primary/50 hover:bg-surface-container-low";
                } else {
                  if (idx === q.correct_index) {
                    btnClass += "border-green-500 bg-green-50 text-green-900";
                  } else if (idx === selectedAnswer && idx !== q.correct_index) {
                    btnClass += "border-red-500 bg-red-50 text-red-900";
                  } else {
                    btnClass += "border-surface-container-high opacity-50";
                  }
                }
                
                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleAnswer(idx)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold
                        ${showExplanation && idx === q.correct_index ? 'bg-green-500 border-green-500 text-white' : 
                          showExplanation && idx === selectedAnswer ? 'bg-red-500 border-red-500 text-white' : 
                          'border-outline text-on-surface-variant'}`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-medium text-base">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {showExplanation && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                {q.explanation && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-xl mb-6">
                    <p className="font-semibold mb-1">Explanation:</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
                
                <button 
                  onClick={handleNext}
                  className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  {currentQIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto font-sans h-full">
      <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">Assignments & Quizzes</h1>
        <p className="text-on-surface-variant mb-8">Complete quizzes assigned by your teacher.</p>
        
        {quizzes.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-surface-container-high p-12 text-center">
            <h3 className="text-lg font-bold text-on-surface mb-2">No Assignments Yet</h3>
            <p className="text-on-surface-variant">Check back later for new quizzes from your teacher.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map(quiz => {
              const result = results[quiz.id];
              
              return (
                <div key={quiz.id} className="bg-surface p-6 rounded-2xl border border-surface-container-high flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-on-surface">{quiz.title}</h3>
                      {result && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{quiz.description || 'No description provided.'}</p>
                  </div>
                  
                  {result ? (
                    <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Score</p>
                        <p className="text-2xl font-bold text-primary">{result.score} / {result.total_questions}</p>
                      </div>
                      <button 
                        onClick={() => handleTakeQuiz(quiz)}
                        className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-container-high"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-surface-container-high flex justify-end">
                      <button 
                        onClick={() => handleTakeQuiz(quiz)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90"
                      >
                        <Play className="w-4 h-4 fill-current" /> Start Quiz
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
