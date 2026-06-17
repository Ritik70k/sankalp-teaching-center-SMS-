import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pwdVisible, setPwdVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.auth.login({ username, password });
      localStorage.setItem('stc_token', res.token);
      localStorage.setItem('stc_user', res.username);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs styling matching login.html */}
      <style>{`
        .orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.4; animation: float 8s ease-in-out infinite; }
        .orb-1 { width: 300px; height: 300px; background: #4f46e5; top: -100px; left: -100px; }
        .orb-2 { width: 200px; height: 200px; background: #06b6d4; bottom: -50px; right: -50px; animation-delay: 3s; }
        .orb-3 { width: 150px; height: 150px; background: #10b981; top: 50%; right: 15%; animation-delay: 5s; }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .login-wrapper { position: relative; z-index: 10; width: 100%; max-width: 420px; padding: 20px; }
        .login-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; box-shadow: 0 25px 60px rgba(0,0,0,0.4); }
        .logo-icon { width: 64px; height: 64px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; color: white; box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4); margin-bottom: 16px; }
        .login-form-label { font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px; }
        .login-form-control { background: rgba(255, 255, 255, 0.07); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 12px; color: white; font-size: 14px; padding: 12px 16px; }
        .login-form-control:focus { background: rgba(255,255,255,0.1); border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25); color: white; }
        .login-form-control::placeholder { color: #475569; }
        .login-input-group-text { background: rgba(255, 255, 255, 0.07); border: 1.5px solid rgba(255, 255, 255, 0.12); border-left: none; border-radius: 0 12px 12px 0; color: #94a3b8; cursor: pointer; }
        .login-input-group-text:hover { color: white; }
        .btn-login { width: 100%; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; padding: 13px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4); margin-top: 8px; }
        .btn-login:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5); }
      `}</style>

      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="login-wrapper">
        <div className="login-card">
          <div className="text-center mb-4">
            <div className="logo-icon"><i className="bi bi-mortarboard-fill"></i></div>
            <h4 className="text-white fw-bold">Sankalp Teaching Center</h4>
            <p className="text-muted fs-13 mb-0">Student Management System</p>
          </div>

          {error && (
            <div className="alert alert-danger mb-3 py-2 border-0" style={{ borderRadius: '10px', fontSize: '13px' }}>
              <i className="bi bi-x-circle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="login-form-label d-block text-start">Username</label>
              <input type="text" className="form-control login-form-control w-100" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="login-form-label d-block text-start">Password</label>
              <div className="input-group">
                <input type={pwdVisible ? 'text' : 'password'} className="form-control login-form-control" style={{ borderRight: 'none' }} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                <span className="input-group-text login-input-group-text" onClick={() => setPwdVisible(!pwdVisible)}>
                  <i className={`bi ${pwdVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </span>
              </div>
            </div>
            <button type="submit" className="btn-login">
              <i className="bi bi-shield-lock me-2"></i>Sign In to Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
