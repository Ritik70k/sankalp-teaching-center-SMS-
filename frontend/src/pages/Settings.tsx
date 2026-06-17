import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  
  // Settings Form
  const [institutionName, setInstitutionName] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [defaultStudentFee, setDefaultStudentFee] = useState('15000');
  const [address, setAddress] = useState('');
  const [backupFile, setBackupFile] = useState<File | null>(null);

  const fetchSettings = () => {
    api.settings.get().then(res => {
      setSettings(res);
      if (res) {
        setInstitutionName(res.institutionName || 'Sankalp Teaching Center');
        setCurrencySymbol(res.currencySymbol || '₹');
        setDefaultStudentFee(String(res.defaultStudentFee || '15000'));
        setAddress(res.address || '');
      }
    }).catch(err => console.error(err));
  };

  const fetchLogs = () => {
    api.settings.logs().then(setLogs).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.settings.update({ institutionName, currencySymbol, defaultStudentFee, address });
      alert("Settings updated successfully!");
      fetchSettings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset the database to demo defaults? All current logs, fees, and students will be lost!")) {
      try {
        await api.settings.reset();
        alert("Database successfully reset to seeds!");
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm("Clear all logs?")) {
      await api.settings.clearLogs();
      fetchLogs();
    }
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupFile) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        await api.settings.restore({ data: parsed });
        alert("Database successfully restored from backup!");
        window.location.reload();
      } catch (err) {
        alert("Invalid JSON backup file.");
      }
    };
    reader.readAsText(backupFile);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">Settings</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row g-4">
        {/* Core preferences form */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3 text-dark"><i className="bi bi-gear-fill me-2 text-primary"></i>Institution Settings</h5>
            <form onSubmit={handleUpdate} className="row g-3">
              <div className="col-12">
                <label className="form-label fw-bold">Institution Name</label>
                <input type="text" className="form-control" style={{ borderRadius: '10px' }} value={institutionName} onChange={e => setInstitutionName(e.target.value)} required />
              </div>
              <div className="col-6">
                <label className="form-label fw-bold">Base Currency Symbol</label>
                <input type="text" className="form-control" style={{ borderRadius: '10px' }} value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)} required />
              </div>
              <div className="col-6">
                <label className="form-label fw-bold">Default Tuition Fee (₹)</label>
                <input type="number" className="form-control" style={{ borderRadius: '10px' }} value={defaultStudentFee} onChange={e => setDefaultStudentFee(e.target.value)} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Institution Address</label>
                <textarea className="form-control" rows={3} style={{ borderRadius: '10px' }} value={address} onChange={e => setAddress(e.target.value)}></textarea>
              </div>
              <div className="col-12 d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>Save Settings</button>
              </div>
            </form>
          </div>

          {/* Backup Restore Card */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3 text-dark"><i className="bi bi-shield-fill-check me-2 text-success"></i>Backup & Restore</h5>
            <div className="d-flex gap-2 mb-4">
              <a href={api.settings.backupUrl} className="btn btn-outline-success w-100" style={{ borderRadius: '10px' }} download><i className="bi bi-cloud-arrow-down me-2"></i>Backup JSON DB</a>
              <button onClick={handleReset} className="btn btn-outline-danger w-100" style={{ borderRadius: '10px' }}><i className="bi bi-trash-fill me-2"></i>Reset to Seeds</button>
            </div>
            
            <form onSubmit={handleRestore} className="border-top pt-3">
              <label className="form-label fw-bold fs-13">Upload Database Backup</label>
              <div className="input-group">
                <input type="file" accept=".json" className="form-control" onChange={e => setBackupFile(e.target.files?.[0] || null)} required />
                <button type="submit" className="btn btn-success" style={{ borderRadius: '0 10px 10px 0' }}>Restore</button>
              </div>
            </form>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-clock-history me-2 text-danger"></i>System Activity Logs</h5>
              <button onClick={handleClearLogs} className="btn btn-sm btn-light text-danger" style={{ borderRadius: '6px' }}><i className="bi bi-trash"></i> Clear</button>
            </div>
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <div className="list-group list-group-flush fs-12">
                {logs.length > 0 ? logs.map(l => (
                  <div key={l.id} className="list-group-item px-0 py-2 border-0 border-bottom">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold text-dark">{l.action}</span>
                      <span className="text-muted">{new Date(l.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="mb-0 text-muted">{l.details}</p>
                    <span className="badge mt-1" style={{ background: '#f1f5f9', color: '#64748b' }}>by {l.user}</span>
                  </div>
                )) : (
                  <div className="text-center text-muted py-4">No system activities recorded.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
