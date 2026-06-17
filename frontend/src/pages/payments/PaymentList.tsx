import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function PaymentList() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [search, setSearch] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchPayments = () => {
    const query = new URLSearchParams({ search, paymentMode, startDate, endDate }).toString();
    api.payments.studentList(`?${query}`)
      .then(res => {
        setPayments(res.payments);
        setTotalCollected(res.totalCollected);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPayments();
  }, [paymentMode]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const exportCSV = () => {
    const headers = 'Transaction ID,Student,Amount,Date,Mode\n';
    const rows = payments.map(p => `"${p.transactionId || 'N/A'}","${p.student.firstName} ${p.student.lastName}",${p.paidAmount},"${new Date(p.paymentDate).toLocaleDateString()}","${p.paymentMode}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'student_payments_report.csv');
    a.click();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Payments Ledger</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">Payments</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <Link to="/payments/pending" className="btn btn-outline-danger" style={{ borderRadius: '10px' }}><i className="bi bi-clock me-2"></i>Pending Fees</Link>
          <Link to="/payments/selection" className="btn btn-primary" style={{ borderRadius: '10px' }}><i className="bi bi-plus-lg me-2"></i>Record Payout / Fee</Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="bi bi-cash-stack"></i></div>
            <div>
              <div className="stat-value">₹{totalCollected.toLocaleString()}</div>
              <div className="stat-label">Total Fees Collected (Filtered)</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-end">
          <button onClick={exportCSV} className="btn btn-light border" style={{ borderRadius: '10px' }}><i className="bi bi-download me-2"></i>Export CSV Ledger</button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-3">
          <form className="row g-2 align-items-center" onSubmit={handleFilter}>
            <div className="col-12 col-md-3">
              <input type="text" className="form-control border-0 fs-13" placeholder="Student name or ID..." style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select border-0 fs-13" style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                <option value="">All Payment Modes</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <input type="date" className="form-control border-0 fs-13" style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <input type="date" className="form-control border-0 fs-13" style={{ background: 'var(--body-bg)', borderRadius: '10px' }} value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="col-12 col-md-2">
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
                <th>Transaction ID</th>
                <th>Student</th>
                <th>Paid Amount</th>
                <th>Date</th>
                <th>Mode</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? payments.map((p: any) => (
                <tr key={p.id}>
                  <td className="fw-700">{p.transactionId || 'N/A'}</td>
                  <td>
                    <div className="fw-600">{p.student.firstName} {p.student.lastName}</div>
                    <div className="text-muted fs-11">{p.student.studentId} - {p.student.batch ? p.student.batch.batchName : 'No Batch'}</div>
                  </td>
                  <td className="text-success fw-700">₹{Number(p.paidAmount).toLocaleString()}</td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td><span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>{p.paymentMode}</span></td>
                  <td className="text-muted fs-12">{p.notes || '—'}</td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center text-muted py-3">No matching payment transactions.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
