import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

export default function StudentList() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [batchId, setBatchId] = useState(searchParams.get('batchId') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  
  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchStudents = () => {
    const query = new URLSearchParams({
      search,
      batchId,
      status,
      page: String(currentPage)
    }).toString();
    
    api.students.list(`?${query}`)
      .then(res => {
        setStudents(res.students);
        setTotal(res.total);
        setPages(res.pages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    api.batches.list().then(setBatches).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, batchId, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams({ search, batchId, status });
    fetchStudents();
  };

  const triggerDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await api.students.delete(deleteId);
        setShowConfirm(false);
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Roster</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">Students</li>
            </ol>
          </nav>
        </div>
        <Link to="/students/add" className="btn btn-primary" style={{ borderRadius: '10px' }}>
          <i className="bi bi-person-plus-fill me-2"></i>Add Student
        </Link>
      </div>

      {/* Filter and Search Form */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-3">
          <form className="row g-2 align-items-center" onSubmit={handleSearchSubmit}>
            <div className="col-12 col-md-4">
              <div className="input-group" style={{ background: 'var(--body-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                <span className="input-group-text border-0 bg-transparent text-muted"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control border-0 bg-transparent fs-13" placeholder="Search by name or student ID..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
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
              <select className="form-select border-0 fs-13" style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <button type="submit" className="btn btn-primary w-100 fs-13 fw-600" style={{ borderRadius: '10px' }}>Apply Filters</button>
            </div>
          </form>
        </div>
      </div>

      {/* Students Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Batch</th>
                <th>Course</th>
                <th>Fee Status</th>
                <th>Remaining</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map((s: any) => (
                <tr key={s.id}>
                  <td><span className="fw-700">{s.studentId}</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={s.photo || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNhMGFlYzAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+"} className="student-avatar" alt="" />
                      <span className="fw-600">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td>{s.batch ? s.batch.batchName : 'No Batch'}</td>
                  <td>{s.course}</td>
                  <td><span className={`badge badge-${s.fee_status.toLowerCase()}`}>{s.fee_status}</span></td>
                  <td className="fw-600 text-dark">₹{s.remaining_fees.toLocaleString()}</td>
                  <td><span className={`badge ${s.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{s.status}</span></td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <Link to={`/students/detail/${s.id}`} className="btn btn-sm btn-light text-primary border-0" style={{ borderRadius: '6px' }}><i className="bi bi-eye"></i></Link>
                      <Link to={`/students/edit/${s.id}`} className="btn btn-sm btn-light text-success border-0" style={{ borderRadius: '6px' }}><i className="bi bi-pencil"></i></Link>
                      <button onClick={() => triggerDelete(s.id)} className="btn btn-sm btn-light text-danger border-0" style={{ borderRadius: '6px' }}><i className="bi bi-trash"></i></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">No student records found matching the filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      {pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3 px-2">
          <span className="fs-12 text-muted">Showing page {currentPage} of {pages} ({total} total records)</span>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-light border" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ borderRadius: '6px' }}>Prev</button>
            <button className="btn btn-sm btn-light border" disabled={currentPage === pages} onClick={() => setCurrentPage(currentPage + 1)} style={{ borderRadius: '6px' }}>Next</button>
          </div>
        </div>
      )}

      <ConfirmModal show={showConfirm} title="Confirm Student Deletion" message="Are you sure you want to delete this student profile? This will permanently wipe all logs and fees history associated with them." onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
    </div>
  );
}
