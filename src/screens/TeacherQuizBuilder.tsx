import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Plus, Save, Trash2, Edit2, Loader2, Check } from 'lucide-react';

interface TeacherQuizBuilderProps {
  user: any;
  onBack: () => void;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Question {
  id?: string;
  question: string;
  options: [string, string, string, string];
  correct_index: number;
  explanation: string;
}

export const TeacherQuizBuilder: React.FC<TeacherQuizBuilderProps> = ({ user, onBack }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create / Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [user.id]);

  const fetchQuizzes = async () => {
    setLoading(true);
    // Find school id for this admin
    const { data: schoolData } = await supabase
      .from('schools')
      .select('id')
      .eq('email', user.email)
      .single();
      
    if (schoolData) {
      setSchoolId(schoolData.id);
      const { data } = await supabase
        .from('custom_quizzes')
        .select('*')
        .eq('school_id', schoolData.id)
        .order('created_at', { ascending: false });
      if (data) setQuizzes(data);
    }
    setLoading(false);
  };

  const handleCreateNew = () => {
    setCurrentQuizId(null);
    setTitle('');
    setDescription('');
    setQuestions([{ question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' }]);
    setIsEditing(true);
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    setCurrentQuizId(quiz.id);
    setTitle(quiz.title);
    setDescription(quiz.description || '');
    
    // Fetch questions
    const { data } = await supabase
      .from('custom_quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id);
      
    if (data && data.length > 0) {
      setQuestions(data as Question[]);
    } else {
      setQuestions([{ question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' }]);
    }
    
    setIsEditing(true);
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    await supabase.from('custom_quizzes').delete().eq('id', id);
    fetchQuizzes();
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim() || questions.length === 0 || !schoolId) return;
    setSaving(true);
    
    try {
      let quizId = currentQuizId;
      
      if (!quizId) {
        // Insert new quiz
        const { data, error } = await supabase
          .from('custom_quizzes')
          .insert([{ school_id: schoolId, title, description }])
          .select()
          .single();
        if (error) throw error;
        quizId = data.id;
      } else {
        // Update existing quiz
        await supabase
          .from('custom_quizzes')
          .update({ title, description })
          .eq('id', quizId);
          
        // Delete old questions to replace them
        await supabase
          .from('custom_quiz_questions')
          .delete()
          .eq('quiz_id', quizId);
      }

      // Insert questions
      if (quizId) {
        const questionsToInsert = questions.map(q => ({
          quiz_id: quizId,
          question: q.question,
          options: q.options,
          correct_index: q.correct_index,
          explanation: q.explanation
        }));
        await supabase.from('custom_quiz_questions').insert(questionsToInsert);
      }

      setIsEditing(false);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      alert('Error saving quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex-1 bg-surface-container-low overflow-y-auto font-sans h-full flex flex-col">
        <div className="bg-surface border-b border-surface-container-high sticky top-0 z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-surface-container rounded-lg">
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <h1 className="text-xl font-bold text-on-surface">
              {currentQuizId ? 'Edit Quiz' : 'Create New Quiz'}
            </h1>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving || !title.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-xl font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Quiz
          </button>
        </div>

        <div className="max-w-4xl mx-auto w-full p-6 space-y-8 pb-20">
          <div className="bg-surface p-6 rounded-2xl border border-surface-container-high space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Quiz Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none" 
                placeholder="e.g. Midterm Cellular Biology Review"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Description (Optional)</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none" 
                placeholder="Instructions or topics covered..."
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold text-on-surface">Questions</h2>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-surface p-6 rounded-2xl border border-surface-container-high relative">
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="mb-4 pr-10">
                  <label className="block text-sm font-medium text-on-surface mb-1">Question {qIndex + 1}</label>
                  <input 
                    type="text" 
                    value={q.question}
                    onChange={e => updateQuestion(qIndex, 'question', e.target.value)}
                    className="w-full p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Enter question text..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name={`correct-${qIndex}`} 
                        checked={q.correct_index === optIndex}
                        onChange={() => updateQuestion(qIndex, 'correct_index', optIndex)}
                        className="w-4 h-4 text-primary"
                      />
                      <input 
                        type="text" 
                        value={opt}
                        onChange={e => updateOption(qIndex, optIndex, e.target.value)}
                        className={`flex-1 p-3 rounded-xl border outline-none ${q.correct_index === optIndex ? 'border-primary bg-primary/5' : 'border-surface-container-high bg-surface-container-lowest focus:border-primary'}`}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Explanation (Shown after answering)</label>
                  <input 
                    type="text" 
                    value={q.explanation}
                    onChange={e => updateQuestion(qIndex, 'explanation', e.target.value)}
                    className="w-full p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Why is this the correct answer?"
                  />
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addQuestion}
            className="w-full py-4 border-2 border-dashed border-primary/50 rounded-2xl text-primary font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto font-sans h-full">
      <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">Manage Quizzes</h1>
            <p className="text-sm text-on-surface-variant">Create and assign custom quizzes for your students.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Create New Quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-surface-container-high p-12 text-center">
            <h3 className="text-lg font-bold text-on-surface mb-2">No Quizzes Yet</h3>
            <p className="text-on-surface-variant mb-6">Create your first custom quiz to test your students' knowledge.</p>
            <button 
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Create New Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="bg-surface p-6 rounded-2xl border border-surface-container-high flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">{quiz.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{quiz.description || 'No description provided.'}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-container-high">
                  <span className="text-xs text-on-surface-variant">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditQuiz(quiz)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
