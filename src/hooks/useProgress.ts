import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'biolog_progress_v1';

interface ProgressData {
  visitedOrganisms: string[];
  quizScores: Record<string, { correct: number; total: number; lastAttempt: number }>;
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { visitedOrganisms: [], quizScores: {} };
    return JSON.parse(raw);
  } catch {
    return { visitedOrganisms: [], quizScores: {} };
  }
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function useProgress() {
  const [data, setData] = useState<ProgressData>(loadProgress);

  // Persist on every change
  useEffect(() => {
    saveProgress(data);
  }, [data]);

  const markVisited = useCallback((id: string) => {
    setData(prev => {
      if (prev.visitedOrganisms.includes(id)) return prev;
      return { ...prev, visitedOrganisms: [...prev.visitedOrganisms, id] };
    });
  }, []);

  const saveQuizScore = useCallback((organismId: string, correct: number, total: number) => {
    setData(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [organismId]: { correct, total, lastAttempt: Date.now() },
      },
    }));
  }, []);

  const isVisited = useCallback(
    (id: string) => data.visitedOrganisms.includes(id),
    [data.visitedOrganisms]
  );

  const getQuizScore = useCallback(
    (id: string) => data.quizScores[id] ?? null,
    [data.quizScores]
  );

  const getProgressPercent = useCallback(
    (totalOrganisms: number) => {
      if (totalOrganisms === 0) return 0;
      return Math.round((data.visitedOrganisms.length / totalOrganisms) * 100);
    },
    [data.visitedOrganisms.length]
  );

  const getQuizCount = useCallback(
    () => Object.keys(data.quizScores).length,
    [data.quizScores]
  );

  const resetProgress = useCallback(() => {
    setData({ visitedOrganisms: [], quizScores: {} });
  }, []);

  return {
    visitedOrganisms: data.visitedOrganisms,
    markVisited,
    saveQuizScore,
    isVisited,
    getQuizScore,
    getProgressPercent,
    getQuizCount,
    resetProgress,
  };
}
