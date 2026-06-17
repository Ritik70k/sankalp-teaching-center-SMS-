import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
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

  if (loading) {
    return <div className="p-4 text-center text-muted">Loading dashboard analytics...</div>;
  }

  if (!data) {
    return <div className="p-4 text-center text-danger">Failed to load dashboard data.</div>;
  }

  const { stats, financialTrends } = data;

  const barData = {
    labels: financialTrends.map((t: any) => t.month),
    datasets: [
      {
        label: 'Collected Fees (₹)',
        data: financialTrends.map((t: any) => t.collected),
        backgroundColor: '#4f46e5',
        borderRadius: 6,
      },
      {
        label: 'Salary Payouts (₹)',
        data: financialTrends.map((t: any) => t.salaries),
        backgroundColor: '#ef4444',
        borderRadius: 6,
      }
    ]
  };

  const doughnutData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [stats.overallAttendancePct, 100 - stats.overallAttendancePct],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
      }
    ]
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard Analytics</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <Link to="/attendance" className="btn btn-primary" style={{ borderRadius: '10px' }}><i className="bi bi-calendar-check me-2"></i>Mark Attendance</Link>
          <Link to="/payments/add-student" className="btn btn-success" style={{ borderRadius: '10px' }}><i className="bi bi-cash-coin me-2"></i>Collect Fees</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}><i className="bi bi-people-fill"></i></div>
            <div>
              <div className="stat-value">{stats.activeStudents}</div>
              <div className="stat-label">Active Students</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="bi bi-person-workspace"></i></div>
            <div>
              <div className="stat-value">{stats.activeTeachers}</div>
              <div className="stat-label">Active Faculty</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><i className="bi bi-collection-fill"></i></div>
            <div>
              <div className="stat-value">{stats.totalBatches}</div>
              <div className="stat-label">Active Batches</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><i className="bi bi-check-circle-fill"></i></div>
            <div>
              <div className="stat-value">{stats.overallAttendancePct}%</div>
              <div className="stat-label">Overall Attendance</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Financial Flow Bar Chart */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold text-dark mb-3"><i className="bi bi-bar-chart-fill me-2 text-primary"></i>Financial Flow Trend</h5>
            <div style={{ height: '300px' }}>
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        {/* Attendance Doughnut Chart */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold text-dark mb-3"><i className="bi bi-pie-chart-fill me-2 text-success"></i>Overall Attendance Log</h5>
            <div style={{ height: '220px', position: 'relative' }} className="d-flex align-items-center justify-content-center">
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              <div style={{ position: 'absolute', top: '44%', fontSize: '20px', fontWeight: 800 }}>{stats.overallAttendancePct}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Ledgers Grid */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 pb-0 pt-3 px-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-cash-stack text-success me-2"></i>Fees collection</h5>
              <Link to="/payments" className="btn btn-sm btn-light text-primary" style={{ borderRadius: '6px' }}>View All</Link>
            </div>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between mb-2 fs-13 text-muted">
                <span>Expected:</span>
                <span className="fw-bold text-dark">₹{stats.totalExpectedFees.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 fs-13 text-muted">
                <span>Collected:</span>
                <span className="fw-bold text-success">₹{stats.totalCollectedFees.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between fs-13 text-muted">
                <span>Pending Outstandings:</span>
                <span className="fw-bold text-danger">₹{stats.pendingFees.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 pb-0 pt-3 px-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-credit-card-2-front text-danger me-2"></i>Faculty Budget</h5>
              <Link to="/teachers" className="btn btn-sm btn-light text-primary" style={{ borderRadius: '6px' }}>View All</Link>
            </div>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between mb-2 fs-13 text-muted">
                <span>Monthly Budget:</span>
                <span className="fw-bold text-dark">₹{stats.monthlySalaryBudget.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between fs-13 text-muted">
                <span>Paid Payouts:</span>
                <span className="fw-bold text-success">₹{stats.totalPaidSalaries.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
