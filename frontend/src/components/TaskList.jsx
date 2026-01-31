import { useState, useEffect, useCallback } from 'react';
import TaskItem from './TaskItem';
import { getTasks, deleteTask, updateTask } from '../services/api';

export default function TaskList({ onEdit, refreshTrigger = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  }, [fetchTasks]);

  const handleStatusChange = useCallback(async (id, status) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    try {
      await updateTask(id, { ...task, status });
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  }, [tasks, fetchTasks]);

  if (loading) return <p className="loading">Loading tasks...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!tasks?.length) return <p className="loading">No tasks yet. Add one above.</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
