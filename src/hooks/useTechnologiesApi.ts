import {useState, useEffect, useCallback} from 'react';
import type {Technology, Status, TechCategory, TechDifficulty} from '../types/technology.ts';

const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&per_page=10';
const STORAGE_KEY = 'techTracker_github_data';

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
  homepage?: string | null;
}

function parseRepoToTechnology(repo: GithubRepo): Technology {
  return {
    id: repo.id,
    title: repo.name,
    status: 'not-started' as Status,
    description: repo.description || 'Нет описания',
    category: 'frontend' as TechCategory,
    difficulty: 'intermediate' as TechDifficulty,
    notes: '',
    deadline: undefined,
    resources: [
      repo.html_url,
      repo.homepage || ''
    ].filter(Boolean) as string[]
  };
}

// Загрузка из localStorage с fallback на пустой массив
function loadFromStorage(): Technology[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Сохранение в localStorage
function saveToStorage(data: Technology[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Не удалось сохранить в localStorage:', err);
  }
}

export default function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState<Technology[]>(loadFromStorage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Синхронизация с localStorage при любом изменении
  useEffect(() => {
    saveToStorage(technologies);
  }, [technologies]);

  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(GITHUB_SEARCH_URL, {
        headers: {
          'User-Agent': 'TechTracker-App/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API: ${response.status} ${response.statusText}`);
      }

      const data: { items: GithubRepo[] } = await response.json();
      const githubRepos = data.items.map(parseRepoToTechnology);

      // Сливаем: GitHub-репозитории (если их нет в локальном хранилище) + все пользовательские изменения
      setTechnologies(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newFromGithub = githubRepos.filter(repo => !existingIds.has(repo.id));
        return [...prev, ...newFromGithub];
      });
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить данные с GitHub');
      console.error(err);
      // Если ошибка — оставляем то, что уже есть в localStorage
    } finally {
      setLoading(false);
    }
  }, []);

  const addTechnology = (input: Omit<Technology, 'id'>): Technology => {
    const newTech: Technology = {
      id: Date.now(),
      ...input,
      status: input.status || 'not-started',
      notes: input.notes || '',
      resources: input.resources || [],
      category: input.category || 'other',
      difficulty: input.difficulty || 'beginner'
    };

    setTechnologies(prev => [...prev, newTech]);
    return newTech;
  };

  const updateStatus = (techId: number, newStatus: Status) => {
    setTechnologies(prev =>
      prev.map(tech => tech.id === techId ? {...tech, status: newStatus} : tech)
    );
  };

  const updateNotes = (techId: number, newNotes: string) => {
    setTechnologies(prev =>
      prev.map(tech => tech.id === techId ? {...tech, notes: newNotes} : tech)
    );
  };

  const updateTechnology = (techId: number, updates: Partial<Technology>) => {
    setTechnologies(prev =>
      prev.map(t => t.id === techId ? {...t, ...updates} : t)
    );
  };

  const deleteTechnology = (techId: number) => {
    setTechnologies(prev => prev.filter(t => t.id !== techId));
  };

  const markAllCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({...tech, status: 'completed' as Status}))
    );
  };

  const resetAll = () => {
    if (window.confirm('Удалить ВСЁ? Даже добавленные вручную технологии?')) {
      setTechnologies([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      source: 'Technologies',
      count: technologies.length,
      technologies
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);

    if (!parsed.technologies || !Array.isArray(parsed.technologies)) {
      throw new Error('Неверный формат файла: отсутствует массив technologies');
    }

    const importedTech: Technology[] = parsed.technologies;

    setTechnologies(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newTech = importedTech.filter(t => !existingIds.has(t.id));
      return [...prev, ...newTech];
    });

    return importedTech.length;
  };


  useEffect(() => {
    const saved = loadFromStorage();
    if (saved.length > 0) {
      setTechnologies(saved);
      setLoading(false);
    } else {
      fetchTechnologies();
    }
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    updateStatus,
    updateNotes,
    updateTechnology,
    deleteTechnology,
    markAllCompleted,
    resetAll,
    exportData,
    importData
  };
}