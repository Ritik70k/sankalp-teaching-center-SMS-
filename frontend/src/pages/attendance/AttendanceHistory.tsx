import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function AttendanceHistory() {
  const [batches, setBatches] = useState<any[]>([]);
  const [batchId, setBatchId] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  const fetchHistory = () => {
    const query = new URLSearchParams({ batchId, date, search }).toString();
    api.attendance.history(`?${query}`).then(setLogs).catch(err => console.error(err));
  };

  useEffect(() => {
    api.batches.list().then(setBatches).catch(err => console.error(err));
    fetchHistory();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Attendance History</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/attendance" className="text-decoration-none">Mark Attendance</Link></li>
              <li className="breadcrumb-item active">Logs History</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-3">
          <form className="row g-2 align-items-center" onSubmit={handleFilter}>
            <div className="col-12 col-md-3">
              <input type="text" className="form-control border-0 fs-13" placeholder="Search student name..." style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select border-0 fs-13" style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={batchId} onChange={e => setBatchId(e.target.value)}>
                <option value="">All Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.batchName}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3">
              <input type="date" className="form-control border-0 fs-13" style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="col-12 col-md-3">
              <button type="submit" className="btn btn-primary w-100 fs-13 fw-600" style={{ borderRadius: '10px' }}>Apply Filter</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Batch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.map((log: any) => (
                <tr key={log.id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td className="fw-700">{log.student.studentId}</td>
                  <td className="fw-600">{log.student.firstName} {log.student.lastName}</td>
                  <td>{log.student.batch ? log.student.batch.batchName : 'No Batch'}</td>
                  <td><span className={`badge ${log.status === 'Present' ? 'badge-active' : 'badge-inactive'}`}>{log.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center text-muted py-3">No attendance logs match the criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
