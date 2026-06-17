import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';

export default function MarkAttendance() {
  const [batches, setBatches] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [batchId, setBatchId] = useState(searchParams.get('batchId') || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  
  // Attendance records state
  const [records, setRecords] = useState<{ [key: number]: 'Present' | 'Absent' }>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    api.batches.list().then(setBatches).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (batchId) {
      setLoading(true);
      setSuccessMsg('');
      api.batches.get(parseInt(batchId))
        .then(res => {
          const activeStudents = res.students.filter((s: any) => s.status === 'Active');
          setStudents(activeStudents);
          
          // Pre-populate records as Present
          const initialRecords: any = {};
          activeStudents.forEach((s: any) => {
            initialRecords[s.id] = 'Present';
          });
          setRecords(initialRecords);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setStudents([]);
    }
  }, [batchId]);

  const toggleStatus = (studentId: number) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const markAll = (status: 'Present' | 'Absent') => {
    const updated = { ...records };
    students.forEach(s => {
      updated[s.id] = status;
    });
    setRecords(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date,
      records: Object.entries(records).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status
      }))
    };

    try {
      await api.attendance.bulkMark(payload);
      setSuccessMsg(`Attendance marked successfully for ${payload.records.length} students!`);
    } catch (err) {
      console.error(err);
      alert('Error updating attendance records.');
    }
  };

  const presentCount = Object.values(records).filter(r => r === 'Present').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mark Attendance</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">Mark Attendance</li>
            </ol>
          </nav>
        </div>
        <Link to="/attendance/history" className="btn btn-outline-primary" style={{ borderRadius: '10px' }}><i className="bi bi-clock-history me-2"></i>Attendance History</Link>
      </div>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <form className="row g-3" onSubmit={handleSave}>
            <div className="col-12 col-md-5">
              <label className="form-label fw-bold">Select Batch</label>
              <select className="form-select" style={{ borderRadius: '10px' }} value={batchId} onChange={e => {
                setBatchId(e.target.value);
                setSearchParams({ batchId: e.target.value });
              }} required>
                <option value="">-- Select Class Batch --</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.batchName}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-5">
              <label className="form-label fw-bold">Attendance Date</label>
              <input type="date" className="form-control" style={{ borderRadius: '10px' }} value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="col-12 col-md-2 d-flex align-items-end">
              <div className="w-100 py-2 text-center border" style={{ borderRadius: '10px', background: 'var(--body-bg)' }}>
                <div className="fs-11 text-muted uppercase font-bold">Present</div>
                <div className="fw-800 text-primary fs-18">{batchId ? `${presentCount}/${students.length}` : '0/0'}</div>
              </div>
            </div>

            {batchId && students.length > 0 && (
              <div className="col-12 border-top pt-3 mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark mb-0">Student Roster</h6>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-success" onClick={() => markAll('Present')} style={{ borderRadius: '6px' }}>Mark All Present</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => markAll('Absent')} style={{ borderRadius: '6px' }}>Mark All Absent</button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id}>
                          <td><span className="fw-700">{s.studentId}</span></td>
                          <td><span className="fw-600">{s.firstName} {s.lastName}</span></td>
                          <td className="text-center">
                            <button type="button" onClick={() => toggleStatus(s.id)} className={`btn btn-sm px-4 fw-600 ${records[s.id] === 'Present' ? 'btn-success' : 'btn-danger'}`} style={{ borderRadius: '8px', minWidth: '100px' }}>
                              {records[s.id] === 'Present' ? 'Present' : 'Absent'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {successMsg && (
                  <div className="alert alert-success mt-3 py-2 border-0" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="submit" className="btn btn-primary px-5" style={{ borderRadius: '10px' }}>Save Attendance Log</button>
                </div>
              </div>
            )}
            
            {batchId && students.length === 0 && !loading && (
              <div className="col-12 text-center text-muted py-3">No active students enrolled in this batch.</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
