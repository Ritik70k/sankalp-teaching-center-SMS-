import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'particulars' | 'ledger' | 'attendance'>('particulars');

  useEffect(() => {
    if (id) {
      api.students.get(parseInt(id)).then(setStudent).catch(err => console.error(err));
    }
  }, [id]);

  if (!student) {
    return <div className="p-4 text-center text-muted">Loading profile ledger...</div>;
  }

  const printReceipt = (payment: any) => {
    const printContent = `
      <html>
        <head>
          <title>Receipt - STC</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; color: #333; max-width: 400px; margin: auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .footer { text-align: center; border-top: 2px dashed #000; padding-top: 10px; margin-top: 20px; font-size: 12px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>Sankalp Teaching Center</h3>
            <p>Fee Payment Receipt</p>
          </div>
          <div class="item"><span class="bold">Receipt ID:</span> <span>${payment.transactionId || 'N/A'}</span></div>
          <div class="item"><span class="bold">Student ID:</span> <span>${student.studentId}</span></div>
          <div class="item"><span class="bold">Name:</span> <span>${student.firstName} ${student.lastName}</span></div>
          <div class="item"><span class="bold">Payment Date:</span> <span>${new Date(payment.paymentDate).toLocaleDateString()}</span></div>
          <div class="item"><span class="bold">Payment Mode:</span> <span>${payment.paymentMode}</span></div>
          <div class="item" style="font-size: 18px; margin-top: 10px;"><span class="bold">Paid Amount:</span> <span class="bold">₹${Number(payment.paidAmount).toLocaleString()}</span></div>
          <div class="footer">
            <p>Thank you for your fee payment!</p>
            <p>For any queries, contact support@sankalp.edu</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printContent);
      win.document.close();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Details</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/students" className="text-decoration-none">Students</Link></li>
              <li className="breadcrumb-item active">{student.firstName} {student.lastName}</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/students/edit/${student.id}`} className="btn btn-outline-primary" style={{ borderRadius: '10px' }}><i className="bi bi-pencil me-2"></i>Edit Profile</Link>
          <Link to={`/payments/add-student?studentId=${student.id}`} className="btn btn-success" style={{ borderRadius: '10px' }}><i className="bi bi-cash-coin me-2"></i>Collect Fees</Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side overview card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4 mb-4" style={{ borderRadius: '16px' }}>
            <div className="mb-3">
              <img src={student.photo ? `http://localhost:5000${student.photo}` : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNhMGFlYzAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+"} className="rounded-circle border" style={{ width: '120px', height: '120px', objectFit: 'cover' }} alt="" />
            </div>
            <h4 className="fw-bold mb-1">{student.firstName} {student.lastName}</h4>
            <p className="text-muted fs-13 mb-2">{student.studentId}</p>
            <span className={`badge ${student.status === 'Active' ? 'badge-active' : 'badge-inactive'} d-inline-block mx-auto mb-3`}>{student.status}</span>
            
            <hr className="my-3" />
            <div className="row g-2 text-start">
              <div className="col-6">
                <span className="text-muted fs-12">Batch Assigned</span>
                <div className="fw-bold fs-13 text-truncate">{student.batch ? student.batch.batchName : 'No Batch'}</div>
              </div>
              <div className="col-6">
                <span className="text-muted fs-12">Course Class</span>
                <div className="fw-bold fs-13">{student.course}</div>
              </div>
            </div>
          </div>

          {/* Fees Summary Card */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3"><i className="bi bi-credit-card-fill me-2 text-success"></i>Fees Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted fs-13">Total Fee Assigned:</span>
              <span className="fw-bold text-dark">₹{Number(student.totalFees).toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted fs-13">Collected Fee:</span>
              <span className="fw-bold text-success">₹{student.paid_amount.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted fs-13">Remaining Balance:</span>
              <span className="fw-bold text-danger">₹{student.remaining_fees.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center border-top pt-2">
              <span className="text-muted fs-12">Overall Status:</span>
              <span className={`badge badge-${student.fee_status.toLowerCase()}`}>{student.fee_status}</span>
            </div>
          </div>
        </div>

        {/* Right side particulars / ledger tabs */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="card-header border-0 bg-transparent p-0">
              <ul className="nav nav-tabs px-3 pt-2">
                <li className="nav-item">
                  <button className={`nav-link border-0 fw-600 ${activeTab === 'particulars' ? 'active' : ''}`} onClick={() => setActiveTab('particulars')}>Particulars</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link border-0 fw-600 ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>Fee History</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link border-0 fw-600 ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Attendance Logs</button>
                </li>
              </ul>
            </div>

            <div className="card-body p-4">
              {activeTab === 'particulars' && (
                <div className="row g-3">
                  <div className="col-6"><span className="text-muted fs-12 d-block">Father's Name</span><span className="fw-bold text-dark">{student.fatherName || 'N/A'}</span></div>
                  <div className="col-6"><span className="text-muted fs-12 d-block">Mother's Name</span><span className="fw-bold text-dark">{student.motherName || 'N/A'}</span></div>
                  <div className="col-6"><span className="text-muted fs-12 d-block">Mobile Number</span><span className="fw-bold text-dark">{student.mobile || 'N/A'}</span></div>
                  <div className="col-6"><span className="text-muted fs-12 d-block">Email Address</span><span className="fw-bold text-dark">{student.email || 'N/A'}</span></div>
                  <div className="col-6"><span className="text-muted fs-12 d-block">Date of Birth</span><span className="fw-bold text-dark">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</span></div>
                  <div className="col-6"><span className="text-muted fs-12 d-block">Admission Date</span><span className="fw-bold text-dark">{new Date(student.admissionDate).toLocaleDateString()}</span></div>
                  <div className="col-12 border-top pt-2"><span className="text-muted fs-12 d-block">Residential Address</span><span className="fw-bold text-dark">{student.address || 'N/A'}</span></div>
                </div>
              )}

              {activeTab === 'ledger' && (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Receipt ID</th>
                        <th>Collected Amount</th>
                        <th>Date</th>
                        <th>Mode</th>
                        <th className="text-end">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.payments.length > 0 ? student.payments.map((p: any) => (
                        <tr key={p.id}>
                          <td className="fw-bold">{p.transactionId || 'N/A'}</td>
                          <td className="text-success fw-700">₹{Number(p.paidAmount).toLocaleString()}</td>
                          <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                          <td><span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>{p.paymentMode}</span></td>
                          <td className="text-end">
                            <button onClick={() => printReceipt(p)} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '6px' }}><i className="bi bi-printer me-1"></i>Print</button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="text-center text-muted py-3">No payments recorded yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted fs-13">Aggregate Attendance Ratio:</span>
                    <span className="fw-bold text-success fs-18">{student.attendance_percentage}%</span>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.attendances.length > 0 ? student.attendances.map((a: any) => (
                          <tr key={a.id}>
                            <td>{new Date(a.date).toLocaleDateString()}</td>
                            <td><span className={`badge ${a.status === 'Present' ? 'badge-active' : 'badge-inactive'}`}>{a.status}</span></td>
                          </tr>
                        )) : (
                          <tr><td colSpan={2} className="text-center text-muted py-3">No attendance logs found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
