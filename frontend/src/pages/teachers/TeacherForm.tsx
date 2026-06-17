import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function TeacherForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNhMGFlYzAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    mobile: '',
    email: '',
    address: '',
    qualification: '',
    subject: '',
    joiningDate: new Date().toISOString().split('T')[0],
    monthlySalary: '25000',
    status: 'Active'
  });

  useEffect(() => {
    if (isEdit) {
      api.teachers.get(parseInt(id))
        .then(res => {
          setFormData({
            firstName: res.firstName || '',
            lastName: res.lastName || '',
            gender: res.gender || 'Male',
            mobile: res.mobile || '',
            email: res.email || '',
            address: res.address || '',
            qualification: res.qualification || '',
            subject: res.subject || '',
            joiningDate: res.joiningDate ? new Date(res.joiningDate).toISOString().split('T')[0] : '',
            monthlySalary: String(res.monthlySalary),
            status: res.status || 'Active'
          });
          if (res.photo) {
            setPreview(`http://localhost:5000${res.photo}`);
          }
        })
        .catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });
    if (photoFile) {
      data.append('photo', photoFile);
    }

    try {
      if (isEdit) {
        await api.teachers.update(parseInt(id), data);
        navigate(`/teachers/detail/${id}`);
      } else {
        const created = await api.teachers.create(data);
        navigate(`/teachers/detail/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving teacher profile.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Teacher' : 'Add Teacher'}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/teachers" className="text-decoration-none">Teachers</Link></li>
              <li className="breadcrumb-item active">{isEdit ? 'Edit Teacher' : 'Add Teacher'}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 text-center mb-3">
              <div className="d-inline-block position-relative">
                <img src={preview} className="rounded-circle border" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid var(--primary)' }} alt="" />
                <label htmlFor="photo" className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-1" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <i className="bi bi-camera"></i>
                  <input type="file" id="photo" accept="image/*" className="d-none" onChange={handlePhotoChange} />
                </label>
              </div>
              <div className="text-muted fs-12 mt-1">Upload teacher photo</div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">First Name</label>
              <input type="text" id="firstName" className="form-control" required style={{ borderRadius: '10px' }} value={formData.firstName} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Last Name</label>
              <input type="text" id="lastName" className="form-control" required style={{ borderRadius: '10px' }} value={formData.lastName} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Gender</label>
              <select id="gender" className="form-select" style={{ borderRadius: '10px' }} value={formData.gender} onChange={handleInputChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Qualification</label>
              <input type="text" id="qualification" className="form-control" placeholder="e.g. M.Sc. Physics" required style={{ borderRadius: '10px' }} value={formData.qualification} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Subject Specialization</label>
              <input type="text" id="subject" className="form-control" placeholder="e.g. Physics" required style={{ borderRadius: '10px' }} value={formData.subject} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Mobile Number</label>
              <input type="tel" id="mobile" className="form-control" required style={{ borderRadius: '10px' }} value={formData.mobile} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Email Address</label>
              <input type="email" id="email" className="form-control" style={{ borderRadius: '10px' }} value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Monthly Salary (₹)</label>
              <input type="number" id="monthlySalary" className="form-control" required style={{ borderRadius: '10px' }} value={formData.monthlySalary} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Joining Date</label>
              <input type="date" id="joiningDate" className="form-control" style={{ borderRadius: '10px' }} value={formData.joiningDate} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Status</label>
              <select id="status" className="form-select" style={{ borderRadius: '10px' }} value={formData.status} onChange={handleInputChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Residential Address</label>
              <textarea id="address" className="form-control" rows={3} style={{ borderRadius: '10px' }} value={formData.address} onChange={handleInputChange}></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <Link to="/teachers" className="btn btn-light px-4" style={{ borderRadius: '10px' }}>Cancel</Link>
              <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
