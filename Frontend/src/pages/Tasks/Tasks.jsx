import React, { useState } from 'react';
import './Tasks.css';

const Tasks = ({ tasks, loading, onUpdateTask, onDeleteTask, onToggleComplete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: ''
  });

  // Colores para las tarjetas
  const cardColors = [
    'task-card-blue',
    'task-card-purple', 
    'task-card-yellow',
    'task-card-pink',
    'task-card-green'
  ];

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      if (onDeleteTask) {
        await onDeleteTask(taskId);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTask && onUpdateTask) {
      await onUpdateTask(editingTask.id, taskForm);
      setShowModal(false);
      setEditingTask(null);
    }
  };

  const formatTime = (date) => {
    if (!date) return '10:30 AM - 12:00 PM';
    const taskDate = new Date(date);
    return taskDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) + ' - ' + new Date(taskDate.getTime() + 90*60000).toLocaleTimeString('en-US', {
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Tasks</h1>
          <p>Manage and organize your tasks efficiently.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <span className="btn-icon">➕</span>
            New Task
          </button>
          <button className="btn btn-secondary">Filter</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task, index) => (
            <div key={task.id} className={`task-card ${cardColors[index % cardColors.length]}`}>
              <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-menu">
                  <button className="menu-dots">⋯</button>
                  <div className="menu-dropdown">
                    <button onClick={() => handleEditTask(task)} className="menu-item">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="menu-item delete">
                      🗑️ Delete
                    </button>
                    <button 
                      onClick={() => onToggleComplete && onToggleComplete(task.id, !task.completed)}
                      className="menu-item"
                    >
                      {task.completed ? '↩️ Undo' : '✅ Complete'}
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="task-description">
                {task.description || 'Lorem ipsum dolor sit amet, consectetur elit iddv niotem idjsfjfi.'}
              </p>
              
              <div className="task-time">
                {formatTime(task.dueDate)}
              </div>

              {task.completed && (
                <div className="task-completed-badge">
                  ✅ Completed
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="task-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;