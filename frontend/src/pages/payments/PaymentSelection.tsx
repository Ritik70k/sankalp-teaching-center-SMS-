import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentSelection() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Record Transaction</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/payments" className="text-decoration-none">Payments</Link></li>
              <li className="breadcrumb-item active">Select Type</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row g-4 justify-content-center pt-4">
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm text-center p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', fontSize: '24px' }}>
              <i className="bi bi-person-fill-add"></i>
            </div>
            <h4 className="fw-bold text-dark">Student Fee Collection</h4>
            <p className="text-muted fs-13 mb-4">Record tuition fee installment collected from an active enrolled student.</p>
            <Link to="/payments/add-student" className="btn btn-success w-100 mt-auto py-2" style={{ borderRadius: '10px' }}>Collect Student Fee</Link>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm text-center p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', fontSize: '24px' }}>
              <i className="bi bi-wallet2"></i>
            </div>
            <h4 className="fw-bold text-dark">Teacher Salary Payout</h4>
            <p className="text-muted fs-13 mb-4">Record monthly salary check/online transfer payout issued to a faculty member.</p>
            <Link to="/payments/add-teacher" className="btn btn-danger w-100 mt-auto py-2" style={{ borderRadius: '10px' }}>Record Salary Payout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
