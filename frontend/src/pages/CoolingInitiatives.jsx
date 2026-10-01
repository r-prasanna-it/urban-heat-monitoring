import React, { useState, useEffect } from 'react';
import {
  Wind,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import Modal from '../components/Modal';
import {
  getCoolingInitiatives,
  createCoolingInitiative,
  updateCoolingInitiative,
  deleteCoolingInitiative,
} from '../services/api';

const CoolingInitiatives = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'view' | 'delete'
  const [formData, setFormData] = useState({
    initiativeName: '',
    location: '',
    type: 'Tree Plantation',
    status: 'Planned',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [errorMsg, setErrorMsg] = useState('');

  const initiativeTypes = [
    'Tree Plantation',
    'Cool Roof',
    'Public Park',
    'Water Mist Station',
  ];

  const fetchInitiativesData = async () => {
    try {
      setLoading(true);
      const res = await getCoolingInitiatives();
      if (res.success) {
        setInitiatives(res.data);
      }
    } catch (err) {
      console.error('Error fetching cooling initiatives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitiativesData();
  }, []);

  const openAddModal = () => {
    setFormData({
      initiativeName: '',
      location: '',
      type: 'Tree Plantation',
      status: 'Planned',
      startDate: new Date().toISOString().split('T')[0],
    });
    setErrorMsg('');
    setModalType('add');
  };

  const openEditModal = (init) => {
    setSelectedInitiative(init);
    setFormData({
      initiativeName: init.initiativeName,
      location: init.location,
      type: init.type,
      status: init.status,
      startDate: init.startDate ? new Date(init.startDate).toISOString().split('T')[0] : '',
    });
    setErrorMsg('');
    setModalType('edit');
  };

  const openViewModal = (init) => {
    setSelectedInitiative(init);
    setModalType('view');
  };

  const openDeleteModal = (init) => {
    setSelectedInitiative(init);
    setModalType('delete');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedInitiative(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.initiativeName || !formData.location || !formData.type) {
      setErrorMsg('Please fill all required fields.');
      return;
    }

    try {
      if (modalType === 'add') {
        const res = await createCoolingInitiative(formData);
        if (res.success) {
          fetchInitiativesData();
          closeModal();
        }
      } else if (modalType === 'edit') {
        const res = await updateCoolingInitiative(selectedInitiative._id, formData);
        if (res.success) {
          fetchInitiativesData();
          closeModal();
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!selectedInitiative) return;
    try {
      const res = await deleteCoolingInitiative(selectedInitiative._id);
      if (res.success) {
        fetchInitiativesData();
        closeModal();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="table-card">
        <div className="table-header-bar">
          <div className="table-header-title">
            <h2>Urban Cooling Initiatives</h2>
            <p>Active mitigation interventions reducing city surface temperatures</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Initiative</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Initiative Name</th>
                <th>Location</th>
                <th>Intervention Type</th>
                <th>Deployment Status</th>
                <th>Start Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {initiatives.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                    No cooling initiatives found.
                  </td>
                </tr>
              ) : (
                initiatives.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Wind size={16} color="#0d9488" />
                        <strong>{item.initiativeName}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="#64748b" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={14} color="#64748b" />
                        <span>{item.type}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                        <Calendar size={14} />
                        <span>{new Date(item.startDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon view"
                          title="View Details"
                          onClick={() => openViewModal(item)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-icon edit"
                          title="Edit"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete"
                          onClick={() => openDeleteModal(item)}
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

      {/* Add / Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalType === 'add' ? 'Add Cooling Initiative' : 'Edit Cooling Initiative'}
        >
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Initiative Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Green Corridor Tree Planting"
                value={formData.initiativeName}
                onChange={(e) => setFormData({ ...formData, initiativeName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. North Industrial Area"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Intervention Type</label>
                <select
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {initiativeTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Deployment Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Planned">Planned</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                required
                className="form-control"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modalType === 'add' ? 'Save Initiative' : 'Update Initiative'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedInitiative && (
        <Modal isOpen={true} onClose={closeModal} title="Cooling Initiative Details">
          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Initiative Name</span>
              <span className="detail-value">{selectedInitiative.initiativeName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Target Location</span>
              <span className="detail-value">{selectedInitiative.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Intervention Type</span>
              <span className="detail-value">{selectedInitiative.type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <span className={`badge badge-${selectedInitiative.status.toLowerCase()}`}>
                  {selectedInitiative.status}
                </span>
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Start Date</span>
              <span className="detail-value">
                {new Date(selectedInitiative.startDate).toLocaleDateString()}
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
      {modalType === 'delete' && selectedInitiative && (
        <Modal isOpen={true} onClose={closeModal} title="Confirm Deletion">
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px' }}>
            Are you sure you want to delete the initiative{' '}
            <strong>"{selectedInitiative.initiativeName}"</strong>?
          </p>
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Initiative
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CoolingInitiatives;
