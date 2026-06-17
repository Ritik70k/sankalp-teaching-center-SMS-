import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function TeacherDetail() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.teachers.get(parseInt(id)).then(setTeacher).catch(err => console.error(err));
    }
  }, [id]);

  if (!teacher) {
    return <div className="p-4 text-center text-muted">Loading profile ledger...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Teacher Profile</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/teachers" className="text-decoration-none">Teachers</Link></li>
              <li className="breadcrumb-item active">{teacher.firstName} {teacher.lastName}</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/teachers/edit/${teacher.id}`} className="btn btn-outline-primary" style={{ borderRadius: '10px' }}><i className="bi bi-pencil me-2"></i>Edit Profile</Link>
          <Link to={`/payments/add-teacher?teacherId=${teacher.id}`} className="btn btn-success" style={{ borderRadius: '10px' }}><i className="bi bi-cash-coin me-2"></i>Record Payout</Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Info Panel */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4 mb-4" style={{ borderRadius: '16px' }}>
            <div className="mb-3">
              <img src={teacher.photo ? `http://localhost:5000${teacher.photo}` : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNhMGFlYzAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+"} className="rounded-circle border" style={{ width: '120px', height: '120px', objectFit: 'cover' }} alt="" />
            </div>
            <h4 className="fw-bold mb-1">{teacher.firstName} {teacher.lastName}</h4>
            <p className="text-muted fs-13 mb-2">{teacher.teacherId}</p>
            <span className={`badge ${teacher.status === 'Active' ? 'badge-active' : 'badge-inactive'} d-inline-block mx-auto mb-3`}>{teacher.status}</span>
            <hr className="my-3" />
            <div className="row g-2 text-start">
              <div className="col-12">
                <span className="text-muted fs-12">Faculty Specialization</span>
                <div className="fw-bold fs-13">{teacher.subject}</div>
              </div>
            </div>
          </div>

          {/* Salary Card */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3"><i className="bi bi-wallet-fill me-2 text-success"></i>Salary Payout Ledger</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted fs-13">Monthly salary:</span>
              <span className="fw-bold text-dark">₹{Number(teacher.monthlySalary).toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted fs-13">Paid Payouts:</span>
              <span className="fw-bold text-success">₹{teacher.paid_salary.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted fs-13">Remaining Balance:</span>
              <span className="fw-bold text-danger">₹{teacher.remaining_salary.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Tab details */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 bg-transparent pt-3 px-4">
              <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-person-lines-fill me-2 text-primary"></i>Faculty Particulars</h5>
            </div>
            <div className="card-body px-4 pb-4 pt-2">
              <div className="row g-3 mb-4">
                <div className="col-6"><span className="text-muted fs-12 d-block">Qualification</span><span className="fw-bold text-dark">{teacher.qualification}</span></div>
                <div className="col-6"><span className="text-muted fs-12 d-block">Mobile Number</span><span className="fw-bold text-dark">{teacher.mobile}</span></div>
                <div className="col-6"><span className="text-muted fs-12 d-block">Email Address</span><span className="fw-bold text-dark">{teacher.email || 'N/A'}</span></div>
                <div className="col-6"><span className="text-muted fs-12 d-block">Joining Date</span><span className="fw-bold text-dark">{new Date(teacher.joiningDate).toLocaleDateString()}</span></div>
                <div className="col-12"><span className="text-muted fs-12 d-block">Residential Address</span><span className="fw-bold text-dark">{teacher.address || 'N/A'}</span></div>
              </div>

              <h6 className="fw-bold mb-3 border-top pt-3 text-dark"><i className="bi bi-clock-history me-2 text-success"></i>Payout Records History</h6>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Paid Amount</th>
                      <th>Payment Date</th>
                      <th>Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacher.payments.length > 0 ? teacher.payments.map((p: any) => (
                      <tr key={p.id}>
                        <td className="fw-bold">{p.transactionId || 'N/A'}</td>
                        <td className="text-success fw-700">₹{Number(p.paidAmount).toLocaleString()}</td>
                        <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                        <td><span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>{p.paymentMode}</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="text-center text-muted py-3">No salary payouts recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
