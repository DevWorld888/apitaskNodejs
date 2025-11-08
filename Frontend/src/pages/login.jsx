import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import loginImage from "../assets/login.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-illustration">
          <img src={loginImage} alt="Task Manager" className="login-image" />
          <h1>📊 Task Manager</h1>
          <p>Gestiona tus tareas de manera eficiente<br />y mantente organizado cada día</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <span className="signup-text">¿No tienes cuenta?</span>
            <Link to="/register" className="signup-link">Regístrate</Link>
          </div>
          
          <h2 className="login-title">Sign in</h2>
          <p className="login-subtitle">Accede con tu cuenta de Open</p>
          
          <div className="social-buttons">
            <button className="social-btn">
              🔍 Google
            </button>
            <button className="social-btn">
              🍎 Apple ID
            </button>
          </div>

          <div className="or-divider">O continúa con dirección email</div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Correo o usuario"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Accediendo..." : "Start trading"}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;