const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskItem({ task, onStatusChange, onDelete, onEdit }) {
  const statusClass = `badge badge-${task.status}`;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (task.status !== newStatus && onStatusChange) {
      onStatusChange(task._id, newStatus);
    }
  };

  return (
    <li className="task-item">
      <div className="content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="meta">
          <span className={statusClass}>{task.status}</span>
          <span>
            {task.createdAt
              ? new Date(task.createdAt).toLocaleDateString()
              : ''}
          </span>
        </div>
        {onStatusChange && (
          <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <label htmlFor={`status-${task._id}`} className="sr-only">
              Update status
            </label>
            <select
              id={`status-${task._id}`}
              value={task.status}
              onChange={handleStatusChange}
              className="task-status-select"
              aria-label="Update status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="actions">
        {onEdit && (
          <button
            type="button"
            className="btn-sm"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="btn-sm btn-danger"
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}
