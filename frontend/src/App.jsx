import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { createTask, updateTask } from './services/api';

const THEME_KEY = 'task-manager-theme';

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const handleCreate = async (task) => {
    await createTask(task);
    setRefreshTrigger((t) => t + 1);
  };

  const handleUpdate = async (task) => {
    await updateTask(editingTask._id, task);
    setEditingTask(null);
    setRefreshTrigger((t) => t + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Task Management</h1>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <span className="theme-icon" aria-hidden="true">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
            <span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>
      <main className="app-main">
        {editingTask ? (
          <TaskForm
            initialValues={editingTask}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTask(null)}
          />
        ) : (
          <TaskForm onSubmit={handleCreate} />
        )}
        <section className="app-section">
          <TaskList
            onEdit={setEditingTask}
            refreshTrigger={refreshTrigger}
          />
        </section>
      </main>
    </div>
  );
}
