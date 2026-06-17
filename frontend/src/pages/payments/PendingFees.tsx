import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function PendingFees() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.payments.pendingList()
      .then(res => {
        setPending(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center text-muted">Loading pending outstandings...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pending Outstandings</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/payments" className="text-decoration-none">Payments</Link></li>
              <li className="breadcrumb-item active">Outstandings</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Batch</th>
                <th>Assigned Fee</th>
                <th>Paid Amount</th>
                <th>Balance Outstanding</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.length > 0 ? pending.map((s: any) => (
                <tr key={s.id}>
                  <td><span className="fw-700">{s.studentId}</span></td>
                  <td><span className="fw-600">{s.firstName} {s.lastName}</span></td>
                  <td>{s.batch ? s.batch.batchName : 'No Batch'}</td>
                  <td>₹{Number(s.totalFees).toLocaleString()}</td>
                  <td className="text-success fw-600">₹{s.paid_amount.toLocaleString()}</td>
                  <td className="text-danger fw-700">₹{s.remaining_fees.toLocaleString()}</td>
                  <td className="text-end">
                    <Link to={`/payments/add-student?studentId=${s.id}`} className="btn btn-sm btn-success" style={{ borderRadius: '8px' }}><i className="bi bi-cash-coin me-1"></i>Collect</Link>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center text-success py-3"><i className="bi bi-check-circle me-1"></i>All fees fully collected! No outstandings.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
