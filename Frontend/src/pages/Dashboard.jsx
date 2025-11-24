import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FcReddit, FcRules } from "react-icons/fc";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaCat, FaTasks } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { IoAnalyticsSharp } from "react-icons/io5";
import { BsMicrosoftTeams } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { TbHelpHexagonFilled } from "react-icons/tb";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUserCog } from "react-icons/fa";
import Tasks from "./Tasks/Tasks";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState('dashboard'); // Nuevo estado para manejar vistas

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    setSidebarOpen(false); // Cerrar sidebar en móvil después de navegar
  };

  // Funciones para manejo de tareas
  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask)
      });

      if (response.ok) {
        await fetchTasks(); // Recargar tareas
      } else {
        console.error("Error updating task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchTasks(); // Recargar tareas
      } else {
        console.error("Error deleting task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });

      if (response.ok) {
        await fetchTasks(); // Recargar tareas
      } else {
        console.error("Error toggling task completion");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  // Estadísticas calculadas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'Alta').length;

  // Función para renderizar la vista actual
  const renderCurrentView = () => {
    switch(currentView) {
      case 'dashboard':
        return renderDashboardView();
      case 'tasks':
        return renderTasksView();
      case 'calendar':
        return renderCalendarView();
      case 'analytics':
        return renderAnalyticsView();
      case 'team':
        return renderTeamView();
      default:
        return renderDashboardView();
    }
  };

  const renderDashboardView = () => (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <span className="btn-icon">➕</span>
            Add Project
          </button>
          <button className="btn btn-secondary">Import Data</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <h3>Total Projects</h3>
            <span className="stat-icon">↗️</span>
          </div>
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-change positive">
            <span className="change-icon">📈</span>
            Increased from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Completed Projects</h3>
            <span className="stat-icon">↗️</span>
          </div>
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-change positive">
            <span className="change-icon">📈</span>
            Increased from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Pending Projects</h3>
            <span className="stat-icon">↗️</span>
          </div>
          <div className="stat-value">{pendingTasks}</div>
          <div className="stat-change positive">
            <span className="change-icon">📈</span>
            Increased from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>High Priority</h3>
            <span className="stat-icon">↗️</span>
          </div>
          <div className="stat-value">{highPriorityTasks}</div>
          <div className="stat-change neutral">
            On Discuss
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Analytics Section */}
        <div className="chart-section">
          <h3>Project Analytics</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{height: '60%'}}></div>
              <div className="bar" style={{height: '80%'}}></div>
              <div className="bar" style={{height: '90%'}}></div>
              <div className="bar" style={{height: '100%'}}></div>
              <div className="bar" style={{height: '70%'}}></div>
              <div className="bar" style={{height: '50%'}}></div>
              <div className="bar" style={{height: '40%'}}></div>
            </div>
            <div className="chart-labels">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="reminders-section">
          <div className="section-header">
            <h3>Reminders</h3>
          </div>
          <div className="reminder-card">
            <h4>Meeting with Team</h4>
            <p>Time: 02:00 pm - 04:00 pm</p>
            <button className="btn btn-primary btn-sm">
              <span className="btn-icon">▶️</span>
              Start Meeting
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="projects-section">
          <div className="section-header">
            <h3>Recent Tasks</h3>
            <button className="btn-text" onClick={() => handleNavigation('tasks')}>+ New</button>
          </div>
          <div className="project-list">
            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : tasks.slice(0, 5).map(task => (
              <div key={task.id} className="project-item">
                <div className="project-icon">⚡</div>
                <div className="project-info">
                  <h4>{task.title}</h4>
                  <p>{task.description || 'No description'}</p>
                </div>
                <div className="project-meta">
                  <span className={`priority ${task.priority?.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className="project-status">
                    {task.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-section">
          <h3>Project Progress</h3>
          <div className="progress-circle">
            <div className="circle">
              <span className="progress-value">{Math.round((completedTasks / totalTasks) * 100) || 0}%</span>
              <span className="progress-label">Project Finished</span>
            </div>
          </div>
          <div className="progress-legend">
            <div className="legend-item">
              <span className="dot completed"></span>
              Completed
            </div>
            <div className="legend-item">
              <span className="dot progress"></span>
              In Progress
            </div>
            <div className="legend-item">
              <span className="dot pending"></span>
              Pending
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderTasksView = () => (
    <Tasks 
      tasks={tasks} 
      loading={loading}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask} 
      onToggleComplete={handleToggleComplete}
    />
  );

  const renderCalendarView = () => (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Calendar</h1>
          <p>View your tasks and events in calendar format.</p>
        </div>
      </div>
      <div className="coming-soon">
        <h2>📅</h2>
        <p>Calendar view coming soon!</p>
      </div>
    </>
  );

  const renderAnalyticsView = () => (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Analytics</h1>
          <p>Insights and reports about your productivity.</p>
        </div>
      </div>
      <div className="coming-soon">
        <h2>📊</h2>
        <p>Analytics dashboard coming soon!</p>
      </div>
    </>
  );

  const renderTeamView = () => (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Team</h1>
          <p>Collaborate with your team members.</p>
        </div>
      </div>
      <div className="coming-soon">
        <h2>👥</h2>
        <p>Team collaboration coming soon!</p>
      </div>
    </>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon"><FaCat /></span>
            <h2 className="logo-text">Task Manager</h2>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-title">MENU</span>
            <ul>
              <li 
                className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigation('dashboard')}
              >
                <span className="nav-icon"><RiDashboardHorizontalFill /></span>
                Dashboard
              </li>
              <li 
                className={`nav-item ${currentView === 'tasks' ? 'active' : ''}`}
                onClick={() => handleNavigation('tasks')}
              >
                <span className="nav-icon"><FaTasks /></span>
                <span>Tasks</span>
                <span className="nav-badge">154</span>
              </li>
              <li 
                className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
                onClick={() => handleNavigation('calendar')}
              >
                <span className="nav-icon"><IoCalendarNumberOutline /></span>
                Calendar
              </li>
              <li 
                className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
                onClick={() => handleNavigation('analytics')}
              >
                <span className="nav-icon"><IoAnalyticsSharp /></span>
                Analytics
              </li>
              <li 
                className={`nav-item ${currentView === 'team' ? 'active' : ''}`}
                onClick={() => handleNavigation('team')}
              >
                <span className="nav-icon"><BsMicrosoftTeams /></span>
                Team
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="nav-title">GENERAL</span>
            <ul>
              <li className="nav-item">
                <span className="nav-icon"><IoSettings /></span>
                Settings
              </li>
              <li className="nav-item">
                <span className="nav-icon"><TbHelpHexagonFilled /></span>
                Help
              </li>
              <li className="nav-item" onClick={handleLogout}>
                <span className="nav-icon"><RiLogoutBoxFill /></span>
                Logout
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search task"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-shortcut">⌘F</span>
            </div>
          </div>
          
          <div className="header-right">
            <button className="header-btn">
              <span className="icon"><MdEmail /></span>
            </button>
            <button className="header-btn">
              <span className="icon"><IoNotifications /></span>
            </button>
            <div className="user-profile">
              <FaUserCog />
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-email">john@example.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {renderCurrentView()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default Dashboard;
