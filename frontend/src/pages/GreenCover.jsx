import React, { useState, useEffect } from 'react';
import {
  Trees,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  BarChart2,
  TreeDeciduous,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Modal from '../components/Modal';
import {
  getGreenCovers,
  createGreenCover,
  updateGreenCover,
  deleteGreenCover,
} from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GreenCover = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'view' | 'delete'
  const [formData, setFormData] = useState({
    location: '',
    greenCoverPercentage: '',
    numberOfTrees: '',
    status: 'Moderate',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchGreenCoverData = async () => {
    try {
      setLoading(true);
      const res = await getGreenCovers();
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error('Error fetching green cover data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreenCoverData();
  }, []);

  const openAddModal = () => {
    setFormData({
      location: '',
      greenCoverPercentage: '',
      numberOfTrees: '',
      status: 'Moderate',
    });
    setErrorMsg('');
    setModalType('add');
  };

  const openEditModal = (rec) => {
    setSelectedRecord(rec);
    setFormData({
      location: rec.location,
      greenCoverPercentage: rec.greenCoverPercentage,
      numberOfTrees: rec.numberOfTrees,
      status: rec.status,
    });
    setErrorMsg('');
    setModalType('edit');
  };

  const openViewModal = (rec) => {
    setSelectedRecord(rec);
    setModalType('view');
  };

  const openDeleteModal = (rec) => {
    setSelectedRecord(rec);
    setModalType('delete');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRecord(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.location || formData.greenCoverPercentage === '' || formData.numberOfTrees === '') {
      setErrorMsg('Please fill all required fields.');
      return;
    }

    try {
      if (modalType === 'add') {
        const res = await createGreenCover(formData);
        if (res.success) {
          fetchGreenCoverData();
          closeModal();
        }
      } else if (modalType === 'edit') {
        const res = await updateGreenCover(selectedRecord._id, formData);
        if (res.success) {
          fetchGreenCoverData();
          closeModal();
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    try {
      const res = await deleteGreenCover(selectedRecord._id);
      if (res.success) {
        fetchGreenCoverData();
        closeModal();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Delete failed');
    }
  };

  // Chart configuration
  const chartData = {
    labels: records.map((r) => r.location),
    datasets: [
      {
        label: 'Green Cover (%)',
        data: records.map((r) => r.greenCoverPercentage),
        backgroundColor: records.map((r) =>
          r.status === 'Good'
            ? 'rgba(16, 185, 129, 0.75)'
            : r.status === 'Moderate'
            ? 'rgba(234, 179, 8, 0.75)'
            : 'rgba(239, 68, 68, 0.75)'
        ),
        borderColor: records.map((r) =>
          r.status === 'Good' ? '#059669' : r.status === 'Moderate' ? '#ca8a04' : '#dc2626'
        ),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Coverage (%)' },
        grid: { color: '#f1f5f9' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div>
      <div className="table-card" style={{ marginBottom: '24px' }}>
        <div className="table-header-bar">
          <div className="table-header-title">
            <h2>Urban Green Cover & Canopy</h2>
            <p>Vegetation density and urban forestry distribution records</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Green Cover</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Green Cover %</th>
                <th>Estimated Trees</th>
                <th>Ecological Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                    No green cover records found.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} color="#64748b" />
                        <strong>{rec.location}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#059669' }}>
                        {rec.greenCoverPercentage}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <TreeDeciduous size={15} color="#059669" />
                        <span>{rec.numberOfTrees.toLocaleString()} trees</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${rec.status.toLowerCase()}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon view"
                          title="View Details"
                          onClick={() => openViewModal(rec)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-icon edit"
                          title="Edit"
                          onClick={() => openEditModal(rec)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete"
                          onClick={() => openDeleteModal(rec)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart.js chart for Green Cover */}
      <div className="card">
        <div className="card-header">
          <h3>
            <BarChart2 size={18} color="#059669" />
            Green Cover Percentage Comparison
          </h3>
        </div>
        <div className="card-body" style={{ height: '300px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalType === 'add' ? 'Add Green Cover Record' : 'Edit Green Cover Record'}
        >
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. South Residential Sector"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Green Cover (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  className="form-control"
                  placeholder="e.g. 45"
                  value={formData.greenCoverPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, greenCoverPercentage: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Number of Trees</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="form-control"
                  placeholder="e.g. 5000"
                  value={formData.numberOfTrees}
                  onChange={(e) => setFormData({ ...formData, numberOfTrees: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modalType === 'add' ? 'Save Record' : 'Update Record'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedRecord && (
        <Modal isOpen={true} onClose={closeModal} title="Green Cover Details">
          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Location</span>
              <span className="detail-value">{selectedRecord.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Green Cover %</span>
              <span className="detail-value" style={{ color: '#059669' }}>
                {selectedRecord.greenCoverPercentage}%
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Estimated Trees</span>
              <span className="detail-value">
                {selectedRecord.numberOfTrees.toLocaleString()} trees
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <span className={`badge badge-${selectedRecord.status.toLowerCase()}`}>
                  {selectedRecord.status}
                </span>
              </span>
            </div>
          </div>
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {modalType === 'delete' && selectedRecord && (
        <Modal isOpen={true} onClose={closeModal} title="Confirm Deletion">
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px' }}>
            Are you sure you want to delete the green cover record for{' '}
            <strong>"{selectedRecord.location}"</strong>?
          </p>
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Record
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GreenCover;
