import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function StudentPaymentForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const [studentId, setStudentId] = useState(searchParams.get('studentId') || '');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // List all active students
    api.students.list('?limit=200')
      .then(res => {
        setStudents(res.students);
        if (studentId) {
          const s = res.students.find((x: any) => x.id === parseInt(studentId));
          if (s) setSelectedStudent(s);
        }
      })
      .catch(err => console.error(err));
  }, [studentId]);

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setStudentId(id);
    const s = students.find(x => x.id === parseInt(id));
    setSelectedStudent(s || null);
    if (s) {
      setPaidAmount(String(s.remaining_fees));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !paidAmount) return;

    try {
      await api.payments.createStudentPayment({
        studentId: parseInt(studentId),
        paidAmount: parseFloat(paidAmount),
        paymentDate,
        paymentMode,
        transactionId,
        notes
      });
      navigate(`/students/detail/${studentId}`);
    } catch (err: any) {
      alert(err.message || 'Error processing transaction.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Collect Student Fee</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/payments" className="text-decoration-none">Payments</Link></li>
              <li className="breadcrumb-item active">Collect Fee</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Select Student</label>
              <select className="form-select" style={{ borderRadius: '10px' }} value={studentId} onChange={handleStudentChange} required>
                <option value="">-- Search and Select Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.studentId} - {s.firstName} {s.lastName} (Remaining: ₹{s.remaining_fees})</option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="col-12 col-md-6 d-flex align-items-center">
                <div className="alert alert-info w-100 mb-0 py-2 border-0" style={{ borderRadius: '10px', fontSize: '13px' }}>
                  <div className="fw-bold text-dark">Fee Ledger Context:</div>
                  Total Assigned: ₹{Number(selectedStudent.totalFees).toLocaleString()} | Collected: ₹{selectedStudent.paid_amount.toLocaleString()} | Balance Outstandings: <span className="text-danger fw-bold">₹{selectedStudent.remaining_fees.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Collected Amount (₹)</label>
              <input type="number" className="form-control" style={{ borderRadius: '10px' }} value={paidAmount} onChange={e => setPaidAmount(e.target.value)} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Payment Date</label>
              <input type="date" className="form-control" style={{ borderRadius: '10px' }} value={paymentDate} onChange={e => setPaymentDate(e.target.value)} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Payment Mode</label>
              <select className="form-select" style={{ borderRadius: '10px' }} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Transaction / Reference ID</label>
              <input type="text" className="form-control" placeholder="e.g. TXN-1092716" style={{ borderRadius: '10px' }} value={transactionId} onChange={e => setTransactionId(e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Transaction Notes</label>
              <textarea className="form-control" rows={3} placeholder="Add any details (receipt print notes)..." style={{ borderRadius: '10px' }} value={notes} onChange={e => setNotes(e.target.value)}></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <Link to="/payments" className="btn btn-light px-4" style={{ borderRadius: '10px' }}>Cancel</Link>
              <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>Submit Fee Collection</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
