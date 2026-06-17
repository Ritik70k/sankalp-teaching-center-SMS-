import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

export default function BatchList() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchBatches = () => {
    api.batches.list()
      .then(res => {
        setBatches(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const triggerDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await api.batches.delete(deleteId);
        setShowConfirm(false);
        fetchBatches();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-4 text-center text-muted">Loading batches...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Class Batches</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">Batches</li>
            </ol>
          </nav>
        </div>
        <Link to="/batches/add" className="btn btn-primary" style={{ borderRadius: '10px' }}>
          <i className="bi bi-collection-fill me-2"></i>Add Batch
        </Link>
      </div>

      <div className="row g-3">
        {batches.length > 0 ? batches.map((b: any) => (
          <div className="col-12 col-md-6 col-lg-4" key={b.id}>
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark mb-0">{b.batchName}</h5>
                  <span className="badge text-primary" style={{ background: '#eef2ff' }}>{b.academicYear}</span>
                </div>
                <h6 className="text-muted fs-13 mb-3">{b.courseName}</h6>
                
                <div className="mt-auto pt-3 border-top">
                  <div className="d-flex justify-content-between mb-2 fs-13">
                    <span className="text-muted">Faculty Assigned:</span>
                    <span className="fw-bold">{b.facultyName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 fs-13">
                    <span className="text-muted">Class Timing:</span>
                    <span className="fw-bold">{b.batchTiming}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 fs-13">
                    <span className="text-muted">Active Enrols:</span>
                    <span className="badge bg-success">{b.student_count} Active</span>
                  </div>

                  <div className="d-flex gap-2">
                    <Link to={`/batches/detail/${b.id}`} className="btn btn-sm btn-outline-primary w-100" style={{ borderRadius: '8px' }}>Manage Students</Link>
                    <Link to={`/batches/edit/${b.id}`} className="btn btn-sm btn-light" style={{ borderRadius: '8px' }}><i className="bi bi-pencil"></i></Link>
                    <button onClick={() => triggerDelete(b.id)} className="btn btn-sm btn-light text-danger" style={{ borderRadius: '8px' }}><i className="bi bi-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center text-muted py-4">No class batches registered yet.</div>
        )}
      </div>

      <ConfirmModal show={showConfirm} title="Confirm Batch Deletion" message="Are you sure you want to delete this batch? All enrolled students will be set to 'No Batch' state." onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
    </div>
  );
}
