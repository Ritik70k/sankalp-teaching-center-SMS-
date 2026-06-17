import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function TeacherPaymentForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  
  const [teacherId, setTeacherId] = useState(searchParams.get('teacherId') || '');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.teachers.list()
      .then(res => {
        setTeachers(res.teachers);
        if (teacherId) {
          const t = res.teachers.find((x: any) => x.id === parseInt(teacherId));
          if (t) {
            setSelectedTeacher(t);
            setPaidAmount(String(t.monthlySalary));
          }
        }
      })
      .catch(err => console.error(err));
  }, [teacherId]);

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setTeacherId(id);
    const t = teachers.find(x => x.id === parseInt(id));
    setSelectedTeacher(t || null);
    if (t) {
      setPaidAmount(String(t.monthlySalary));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !paidAmount) return;

    try {
      await api.payments.createTeacherPayment({
        teacherId: parseInt(teacherId),
        paidAmount: parseFloat(paidAmount),
        paymentDate,
        paymentMode,
        transactionId,
        notes
      });
      navigate(`/teachers/detail/${teacherId}`);
    } catch (err: any) {
      alert(err.message || 'Error processing transaction.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Record Salary Payout</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/payments" className="text-decoration-none">Payments</Link></li>
              <li className="breadcrumb-item active">Record Salary</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Select Teacher</label>
              <select className="form-select" style={{ borderRadius: '10px' }} value={teacherId} onChange={handleTeacherChange} required>
                <option value="">-- Search and Select Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.teacherId} - {t.firstName} {t.lastName} (Salary: ₹{Number(t.monthlySalary).toLocaleString()})</option>
                ))}
              </select>
            </div>

            {selectedTeacher && (
              <div className="col-12 col-md-6 d-flex align-items-center">
                <div className="alert alert-danger w-100 mb-0 py-2 border-0" style={{ borderRadius: '10px', fontSize: '13px' }}>
                  <div className="fw-bold text-dark">Salary Context:</div>
                  Monthly Commitments: ₹{Number(selectedTeacher.monthlySalary).toLocaleString()} | Paid Payouts: ₹{selectedTeacher.paid_salary.toLocaleString()} | Remaining Balance: <span className="text-danger fw-bold">₹{selectedTeacher.remaining_salary.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Payout Amount (₹)</label>
              <input type="number" className="form-control" style={{ borderRadius: '10px' }} value={paidAmount} onChange={e => setPaidAmount(e.target.value)} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Payment Date</label>
              <input type="date" className="form-control" style={{ borderRadius: '10px' }} value={paymentDate} onChange={e => setPaymentDate(e.target.value)} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Payment Mode</label>
              <select className="form-select" style={{ borderRadius: '10px' }} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Reference Payout ID</label>
              <input type="text" className="form-control" placeholder="e.g. SAL-10298" style={{ borderRadius: '10px' }} value={transactionId} onChange={e => setTransactionId(e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Payout Notes</label>
              <textarea className="form-control" rows={3} placeholder="Add any details..." style={{ borderRadius: '10px' }} value={notes} onChange={e => setNotes(e.target.value)}></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <Link to="/payments" className="btn btn-light px-4" style={{ borderRadius: '10px' }}>Cancel</Link>
              <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>Submit Payout</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
