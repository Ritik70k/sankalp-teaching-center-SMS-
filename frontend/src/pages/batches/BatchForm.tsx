import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function BatchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    batchName: '',
    courseName: '',
    facultyName: '',
    batchTiming: '',
    startDate: '',
    academicYear: '2026-2027',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    if (isEdit) {
      api.batches.get(parseInt(id))
        .then(res => {
          setFormData({
            batchName: res.batchName || '',
            courseName: res.courseName || '',
            facultyName: res.facultyName || '',
            batchTiming: res.batchTiming || '',
            startDate: res.startDate ? new Date(res.startDate).toISOString().split('T')[0] : '',
            academicYear: res.academicYear || '2026-2027',
            endDate: res.endDate ? new Date(res.endDate).toISOString().split('T')[0] : '',
            description: res.description || ''
          });
        })
        .catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.batches.update(parseInt(id), formData);
      } else {
        await api.batches.create(formData);
      }
      navigate('/batches');
    } catch (err) {
      console.error(err);
      alert("Error saving batch information.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Batch' : 'Add Batch'}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/batches" className="text-decoration-none">Batches</Link></li>
              <li className="breadcrumb-item active">{isEdit ? 'Edit Batch' : 'Add Batch'}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Batch Name</label>
              <input type="text" id="batchName" className="form-control" required placeholder="e.g. Class 10 - Science" style={{ borderRadius: '10px' }} value={formData.batchName} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Course / Class</label>
              <input type="text" id="courseName" className="form-control" required placeholder="e.g. Science" style={{ borderRadius: '10px' }} value={formData.courseName} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Faculty Name</label>
              <input type="text" id="facultyName" className="form-control" required placeholder="e.g. Rajesh Kumar" style={{ borderRadius: '10px' }} value={formData.facultyName} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Batch Timing</label>
              <input type="text" id="batchTiming" className="form-control" required placeholder="e.g. 04:00 PM - 05:30 PM" style={{ borderRadius: '10px' }} value={formData.batchTiming} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Start Date</label>
              <input type="date" id="startDate" className="form-control" required style={{ borderRadius: '10px' }} value={formData.startDate} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Academic Year</label>
              <input type="text" id="academicYear" className="form-control" required placeholder="e.g. 2026-2027" style={{ borderRadius: '10px' }} value={formData.academicYear} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">End Date</label>
              <input type="date" id="endDate" className="form-control" style={{ borderRadius: '10px' }} value={formData.endDate} onChange={handleInputChange} />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Description</label>
              <textarea id="description" className="form-control" rows={3} style={{ borderRadius: '10px' }} value={formData.description} onChange={handleInputChange}></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <Link to="/batches" className="btn btn-light px-4" style={{ borderRadius: '10px' }}>Cancel</Link>
              <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>Save Batch</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
