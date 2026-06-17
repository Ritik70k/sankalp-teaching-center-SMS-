import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function BatchDetail() {
  const { id } = useParams();
  const [batch, setBatch] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.batches.get(parseInt(id)).then(setBatch).catch(err => console.error(err));
    }
  }, [id]);

  if (!batch) return <div className="p-4 text-center text-muted">Loading batch details...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Batch Details</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/batches" className="text-decoration-none">Batches</Link></li>
              <li className="breadcrumb-item active">{batch.batchName}</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/batches/edit/${batch.id}`} className="btn btn-outline-primary" style={{ borderRadius: '10px' }}><i className="bi bi-pencil me-2"></i>Edit Details</Link>
          <Link to={`/attendance?batchId=${batch.id}`} className="btn btn-primary" style={{ borderRadius: '10px' }}><i className="bi bi-calendar-check me-2"></i>Mark Attendance</Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-3"><span className="text-muted fs-12 d-block">Faculty Assigned</span><span className="fw-bold text-dark">{batch.facultyName}</span></div>
            <div className="col-12 col-md-3"><span className="text-muted fs-12 d-block">Batch Timing</span><span className="fw-bold text-dark">{batch.batchTiming}</span></div>
            <div className="col-12 col-md-3"><span className="text-muted fs-12 d-block">Academic Year</span><span className="fw-bold text-dark">{batch.academicYear}</span></div>
            <div className="col-12 col-md-3"><span className="text-muted fs-12 d-block">Start Date</span><span className="fw-bold text-dark">{new Date(batch.startDate).toLocaleDateString()}</span></div>
            {batch.description && (
              <div className="col-12 border-top pt-2"><span className="text-muted fs-12 d-block">Description</span><span className="fw-bold text-dark">{batch.description}</span></div>
            )}
          </div>
        </div>
      </div>

      <h5 className="fw-bold text-dark mb-3"><i className="bi bi-people me-2 text-primary"></i>Enrolled Students ({batch.students.length})</h5>
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Course</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batch.students.length > 0 ? batch.students.map((s: any) => (
                <tr key={s.id}>
                  <td><span className="fw-700">{s.studentId}</span></td>
                  <td><span className="fw-600">{s.firstName} {s.lastName}</span></td>
                  <td>{s.course}</td>
                  <td>{new Date(s.admissionDate).toLocaleDateString()}</td>
                  <td><span className={`badge ${s.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{s.status}</span></td>
                  <td className="text-end">
                    <Link to={`/students/detail/${s.id}`} className="btn btn-sm btn-light" style={{ borderRadius: '6px' }}><i className="bi bi-eye"></i></Link>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center text-muted py-3">No students currently enrolled in this batch.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
