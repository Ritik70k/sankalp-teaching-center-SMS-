import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.dashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center text-muted">Loading reports analysis...</div>;
  if (!data) return <div className="p-4 text-center text-danger">Failed to load reports.</div>;

  const { stats, batchBreakdown } = data;

  const chartData = {
    labels: batchBreakdown.map((b: any) => b.batchName),
    datasets: [
      {
        label: 'Student Enrollment',
        data: batchBreakdown.map((b: any) => b.studentCount),
        backgroundColor: '#4f46e5',
        borderRadius: 8,
      }
    ]
  };

  const exportStudents = () => {
    api.students.list('?limit=2000').then(res => {
      const headers = 'Student ID,First Name,Last Name,Gender,Mobile,Email,Course,Status\n';
      const rows = res.students.map((s: any) => `"${s.studentId}","${s.firstName}","${s.lastName}","${s.gender}","${s.mobile}","${s.email || ''}","${s.course}","${s.status}"`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'students_export.csv';
      link.click();
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">Reports</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '16px' }}>
            <h6 className="text-muted mb-2">Total Collected Fees</h6>
            <h3 className="fw-800 text-success">₹{stats.totalCollectedFees.toLocaleString()}</h3>
            <span className="fs-12 text-muted mt-1">Tuition outstandings remaining: ₹{stats.pendingFees.toLocaleString()}</span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '16px' }}>
            <h6 className="text-muted mb-2">Total Salary Payouts</h6>
            <h3 className="fw-800 text-danger">₹{stats.totalPaidSalaries.toLocaleString()}</h3>
            <span className="fs-12 text-muted mt-1">Monthly budget overhead: ₹{stats.monthlySalaryBudget.toLocaleString()}</span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '16px' }}>
            <h6 className="text-muted mb-2">Export Data Modules</h6>
            <div className="d-flex flex-column gap-2 mt-2">
              <button onClick={exportStudents} className="btn btn-sm btn-outline-primary" style={{ borderRadius: '8px' }}><i className="bi bi-download me-2"></i>Export Student List</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3">Enrolments by Class Batch</h5>
            <div style={{ height: '300px' }}>
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-3">Batch Breakdown</h5>
            <div className="table-responsive">
              <table className="table mb-0 fs-13">
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th className="text-end">Enrolments</th>
                  </tr>
                </thead>
                <tbody>
                  {batchBreakdown.map((b: any) => (
                    <tr key={b.batchId}>
                      <td className="fw-600">{b.batchName}</td>
                      <td className="text-end fw-bold text-primary">{b.studentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
