import { useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskForm({ onSubmit, initialValues, onCancel }) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [status, setStatus] = useState(initialValues?.status ?? 'pending');
  const [error, setError] = useState('');
  const isEdit = Boolean(initialValues);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
      });
      resetForm();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 style={{ marginTop: 0 }}>{isEdit ? 'Edit Task' : 'Add Task'}</h2>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEdit ? 'Update' : 'Add Task'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
