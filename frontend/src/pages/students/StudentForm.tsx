import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [batches, setBatches] = useState<any[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNhMGFlYzAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    course: '',
    batchId: '',
    admissionDate: new Date().toISOString().split('T')[0],
    totalFees: '15000',
    status: 'Active',
    fatherName: '',
    motherName: '',
    mobile: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    api.batches.list().then(setBatches).catch(err => console.error(err));

    if (isEdit) {
      api.students.get(parseInt(id))
        .then(res => {
          setFormData({
            firstName: res.firstName || '',
            lastName: res.lastName || '',
            gender: res.gender || 'Male',
            dateOfBirth: res.dateOfBirth ? new Date(res.dateOfBirth).toISOString().split('T')[0] : '',
            course: res.course || '',
            batchId: res.batchId ? String(res.batchId) : '',
            admissionDate: res.admissionDate ? new Date(res.admissionDate).toISOString().split('T')[0] : '',
            totalFees: String(res.totalFees),
            status: res.status || 'Active',
            fatherName: res.fatherName || '',
            motherName: res.motherName || '',
            mobile: res.mobile || '',
            email: res.email || '',
            address: res.address || ''
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
        await api.students.update(parseInt(id), data);
        navigate(`/students/detail/${id}`);
      } else {
        const created = await api.students.create(data);
        navigate(`/students/detail/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving student record.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Student' : 'Add Student'}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/students" className="text-decoration-none">Students</Link></li>
              <li className="breadcrumb-item active">{isEdit ? 'Edit Student' : 'Add Student'}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <form className="row g-3" onSubmit={handleSubmit}>
            {/* Photo preview upload component */}
            <div className="col-12 text-center mb-3">
              <div className="d-inline-block position-relative">
                <img src={preview} className="rounded-circle border" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid var(--primary)' }} alt="" />
                <label htmlFor="photo" className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-1" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <i className="bi bi-camera"></i>
                  <input type="file" id="photo" accept="image/*" className="d-none" onChange={handlePhotoChange} />
                </label>
              </div>
              <div className="text-muted fs-12 mt-1">Upload student photo (JPG, PNG)</div>
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
              <label className="form-label fw-bold">Date of Birth</label>
              <input type="date" id="dateOfBirth" className="form-control" style={{ borderRadius: '10px' }} value={formData.dateOfBirth} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Course / Class</label>
              <input type="text" id="course" className="form-control" required placeholder="e.g. Science" style={{ borderRadius: '10px' }} value={formData.course} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Select Batch</label>
              <select id="batchId" className="form-select" style={{ borderRadius: '10px' }} value={formData.batchId} onChange={handleInputChange}>
                <option value="">-- No Batch Assigned --</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.batchName}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Admission Date</label>
              <input type="date" id="admissionDate" className="form-control" style={{ borderRadius: '10px' }} value={formData.admissionDate} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Father's Name</label>
              <input type="text" id="fatherName" className="form-control" style={{ borderRadius: '10px' }} value={formData.fatherName} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Mother's Name</label>
              <input type="text" id="motherName" className="form-control" style={{ borderRadius: '10px' }} value={formData.motherName} onChange={handleInputChange} />
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
              <label className="form-label fw-bold">Total Fees Assigned (₹)</label>
              <input type="number" id="totalFees" className="form-control" required style={{ borderRadius: '10px' }} value={formData.totalFees} onChange={handleInputChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Enrollment Status</label>
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
              <Link to="/students" className="btn btn-light px-4" style={{ borderRadius: '10px' }}>Cancel</Link>
              <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
