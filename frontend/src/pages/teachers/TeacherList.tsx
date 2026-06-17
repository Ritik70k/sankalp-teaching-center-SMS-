import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

export default function TeacherList() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [budget, setBudget] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTeachers = () => {
    const query = new URLSearchParams({ search, status }).toString();
    api.teachers.list(`?${query}`)
      .then(res => {
        setTeachers(res.teachers);
        setActiveCount(res.activeCount || 0);
        setBudget(res.monthlyBudget || 0);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTeachers();
  }, [status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  const triggerDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await api.teachers.delete(deleteId);
        setShowConfirm(false);
        fetchTeachers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Faculty List</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">Teachers</li>
            </ol>
          </nav>
        </div>
        <Link to="/teachers/add" className="btn btn-primary" style={{ borderRadius: '10px' }}>
          <i className="bi bi-person-plus-fill me-2"></i>Add Teacher
        </Link>
      </div>

      {/* Salary Overview stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="bi bi-person-workspace"></i></div>
            <div>
              <div className="stat-value">{activeCount}</div>
              <div className="stat-label">Active Faculty Members</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}><i className="bi bi-cash-stack"></i></div>
            <div>
              <div className="stat-value">₹{budget.toLocaleString()}</div>
              <div className="stat-label">Monthly Salary Budget</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-3">
          <form className="row g-2 align-items-center" onSubmit={handleSearchSubmit}>
            <div className="col-12 col-md-6">
              <div className="input-group" style={{ background: 'var(--body-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                <span className="input-group-text border-0 bg-transparent text-muted"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control border-0 bg-transparent fs-13" placeholder="Search by name, specialization, or teacher ID..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-6 col-md-4">
              <select className="form-select border-0 fs-13" style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <button type="submit" className="btn btn-primary w-100 fs-13 fw-600" style={{ borderRadius: '10px' }}>Apply Filters</button>
            </div>
          </form>
        </div>
      </div>

      {/* Table grid */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>Full Name</th>
                <th>Specialization</th>
                <th>Joining Date</th>
                <th>Monthly Salary</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? teachers.map((t: any) => (
                <tr key={t.id}>
                  <td><span className="fw-700">{t.teacherId}</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={
                          t.photo
                            ? t.photo
                            : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNhMGFlYzAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+"
                        }
                        className="teacher-avatar"
                        alt=""
                      />                      <span className="fw-600">{t.firstName} {t.lastName}</span>
                    </div>
                  </td>
                  <td>{t.subject}</td>
                  <td>{new Date(t.joiningDate).toLocaleDateString()}</td>
                  <td className="fw-700 text-dark">₹{Number(t.monthlySalary).toLocaleString()}</td>
                  <td><span className={`badge ${t.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{t.status}</span></td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <Link to={`/teachers/detail/${t.id}`} className="btn btn-sm btn-light text-primary border-0" style={{ borderRadius: '6px' }}><i className="bi bi-eye"></i></Link>
                      <Link to={`/teachers/edit/${t.id}`} className="btn btn-sm btn-light text-success border-0" style={{ borderRadius: '6px' }}><i className="bi bi-pencil"></i></Link>
                      <button onClick={() => triggerDelete(t.id)} className="btn btn-sm btn-light text-danger border-0" style={{ borderRadius: '6px' }}><i className="bi bi-trash"></i></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">No teacher records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal show={showConfirm} title="Confirm Teacher Deletion" message="Are you sure you want to delete this teacher profile? This will permanently wipe all logs and payouts associated with them." onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
    </div>
  );
}
