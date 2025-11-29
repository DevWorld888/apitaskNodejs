import React, { useState } from 'react';
import './Tasks.css';

const Tasks = ({ tasks = [], loading, onUpdateTask, onDeleteTask, onToggleComplete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'todo',
    completed: false
  });

  // Función para categorizar tareas por estado
  const categorizeTasksByStatus = (tasks) => {
    return {
      todo: tasks.filter(task => !task.completed && (!task.status || task.status === 'todo')),
      doing: tasks.filter(task => !task.completed && task.status === 'doing'),
      done: tasks.filter(task => task.completed || task.status === 'done')
    };
  };

  const tasksByStatus = categorizeTasksByStatus(tasks);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      status: task.status || 'todo'
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
      const updatedTask = {
        ...taskForm,
        completed: taskForm.status === 'done'
      };
      await onUpdateTask(editingTask.id, updatedTask);
      setShowModal(false);
      setEditingTask(null);
    }
  };

  // Funciones de Drag & Drop
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    if (draggedTask && onUpdateTask) {
      const updatedTask = {
        ...draggedTask,
        status: status,
        completed: status === 'done'
      };
      await onUpdateTask(draggedTask.id, updatedTask);
      setDraggedTask(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const taskDate = new Date(date);
    return taskDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa726';
      case 'low': return '#42a5f5';
      default: return '#ffa726';
    }
  };

  const getRandomAvatar = (index) => {
    const avatars = ['👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨'];
    return avatars[index % avatars.length];
  };

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <h1>Task Board</h1>
        <button className="add-task-btn" onClick={() => setShowModal(true)}>
          <span className="add-icon">+</span>
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="kanban-board">
          {/* TO DO Column */}
          <div className="kanban-column"
               onDragOver={handleDragOver}
               onDrop={(e) => handleDrop(e, 'todo')}>
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon">📝</span>
                <span>To do</span>
                <span className="task-count">{tasksByStatus.todo.length}</span>
              </div>
              <button className="add-column-task">+</button>
            </div>
            <div className="column-content">
              {tasksByStatus.todo.map((task, index) => (
                <div 
                  key={task.id} 
                  className="kanban-task"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <div className="task-header">
                    <div className="task-menu">
                      <button className="menu-dots" onClick={() => handleEditTask(task)}>⋯</button>
                    </div>
                  </div>
                  
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">
                    {task.description || 'No description provided'}
                  </p>
                  
                  <div className="task-footer">
                    <div className="task-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority || 'Medium'}
                      </span>
                      <span className="task-status">
                        {task.status === 'todo' ? 'On Track' : 'At Risk'}
                      </span>
                    </div>
                    <div className="task-bottom">
                      <div className="task-date">
                        <span className="date-icon">📅</span>
                        <span>{formatDate(task.dueDate) || '12 Jul'}</span>
                        <span className="comment-count">2 💬</span>
                      </div>
                      <div className="task-avatar">{getRandomAvatar(index)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOING Column */}
          <div className="kanban-column"
               onDragOver={handleDragOver}
               onDrop={(e) => handleDrop(e, 'doing')}>
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon">⚡</span>
                <span>Doing</span>
                <span className="task-count">{tasksByStatus.doing.length}</span>
              </div>
              <button className="add-column-task">+</button>
            </div>
            <div className="column-content">
              {tasksByStatus.doing.map((task, index) => (
                <div 
                  key={task.id} 
                  className="kanban-task doing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <div className="task-header">
                    <div className="task-menu">
                      <button className="menu-dots" onClick={() => handleEditTask(task)}>⋯</button>
                    </div>
                  </div>
                  
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">
                    {task.description || 'No description provided'}
                  </p>
                  
                  <div className="task-footer">
                    <div className="task-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority || 'Medium'}
                      </span>
                      <span className="task-status at-risk">
                        At Risk
                      </span>
                    </div>
                    <div className="task-bottom">
                      <div className="task-date">
                        <span className="date-icon">📅</span>
                        <span>{formatDate(task.dueDate) || '12 Jul'}</span>
                        <span className="comment-count">2 💬</span>
                      </div>
                      <div className="task-avatar">{getRandomAvatar(index + 3)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DONE Column */}
          <div className="kanban-column"
               onDragOver={handleDragOver}
               onDrop={(e) => handleDrop(e, 'done')}>
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon">✅</span>
                <span>Done</span>
                <span className="task-count">{tasksByStatus.done.length}</span>
              </div>
              <button className="add-column-task">+</button>
            </div>
            <div className="column-content">
              {tasksByStatus.done.map((task, index) => (
                <div 
                  key={task.id} 
                  className="kanban-task done"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <div className="task-header">
                    <div className="task-menu">
                      <button className="menu-dots" onClick={() => handleEditTask(task)}>⋯</button>
                    </div>
                  </div>
                  
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">
                    {task.description || 'No description provided'}
                  </p>
                  
                  <div className="task-footer">
                    <div className="task-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority || 'Medium'}
                      </span>
                      <span className="task-status on-track">
                        On Track
                      </span>
                    </div>
                    <div className="task-bottom">
                      <div className="task-date">
                        <span className="date-icon">📅</span>
                        <span>{formatDate(task.dueDate) || '10 Jul'}</span>
                        <span className="comment-count">2 💬</span>
                      </div>
                      <div className="task-avatar">{getRandomAvatar(index + 6)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Untitled Section */}
          <div className="kanban-column untitled">
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon">📂</span>
                <span>Untitled section</span>
              </div>
              <button className="add-column-task">+</button>
            </div>
            <div className="column-content">
              <button className="add-task-placeholder">
                <span className="add-icon">+</span>
                Add Task
              </button>
            </div>
          </div>
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
              <div className="form-group">
                <label>Status</label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
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