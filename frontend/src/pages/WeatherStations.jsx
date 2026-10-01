import React, { useState, useEffect } from 'react';
import {
  Radio,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Droplets,
  Thermometer,
} from 'lucide-react';
import Modal from '../components/Modal';
import {
  getWeatherStations,
  createWeatherStation,
  updateWeatherStation,
  deleteWeatherStation,
} from '../services/api';

const WeatherStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'view' | 'delete'
  const [formData, setFormData] = useState({
    stationName: '',
    location: '',
    temperature: '',
    humidity: '',
    status: 'Active',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStationsData = async () => {
    try {
      setLoading(true);
      const res = await getWeatherStations();
      if (res.success) {
        setStations(res.data);
      }
    } catch (err) {
      console.error('Error fetching weather stations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationsData();
  }, []);

  const openAddModal = () => {
    setFormData({
      stationName: '',
      location: '',
      temperature: '',
      humidity: '',
      status: 'Active',
    });
    setErrorMsg('');
    setModalType('add');
  };

  const openEditModal = (st) => {
    setSelectedStation(st);
    setFormData({
      stationName: st.stationName,
      location: st.location,
      temperature: st.temperature,
      humidity: st.humidity,
      status: st.status,
    });
    setErrorMsg('');
    setModalType('edit');
  };

  const openViewModal = (st) => {
    setSelectedStation(st);
    setModalType('view');
  };

  const openDeleteModal = (st) => {
    setSelectedStation(st);
    setModalType('delete');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedStation(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !formData.stationName ||
      !formData.location ||
      formData.temperature === '' ||
      formData.humidity === ''
    ) {
      setErrorMsg('Please fill all required fields.');
      return;
    }

    try {
      if (modalType === 'add') {
        const res = await createWeatherStation(formData);
        if (res.success) {
          fetchStationsData();
          closeModal();
        }
      } else if (modalType === 'edit') {
        const res = await updateWeatherStation(selectedStation._id, formData);
        if (res.success) {
          fetchStationsData();
          closeModal();
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!selectedStation) return;
    try {
      const res = await deleteWeatherStation(selectedStation._id);
      if (res.success) {
        fetchStationsData();
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
            <h2>Meteorological Weather Stations</h2>
            <p>Monitored microclimate data across automated city monitoring nodes</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Station</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Station Name</th>
                <th>Location</th>
                <th>Ambient Temperature</th>
                <th>Relative Humidity</th>
                <th>Node Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                    No weather stations found.
                  </td>
                </tr>
              ) : (
                stations.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Radio size={16} color="#3b82f6" />
                        <strong>{st.stationName}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="#64748b" />
                        <span>{st.location}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Thermometer size={15} color="#ef4444" />
                        <span style={{ fontWeight: 600 }}>{st.temperature}°C</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Droplets size={15} color="#3b82f6" />
                        <span style={{ fontWeight: 600 }}>{st.humidity}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${st.status.toLowerCase()}`}>
                        {st.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon view"
                          title="View Details"
                          onClick={() => openViewModal(st)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-icon edit"
                          title="Edit"
                          onClick={() => openEditModal(st)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete"
                          onClick={() => openDeleteModal(st)}
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
          title={modalType === 'add' ? 'Add Weather Station' : 'Edit Weather Station'}
        >
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Station Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Central MET-05"
                value={formData.stationName}
                onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Downtown Central Sector"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="form-control"
                  placeholder="e.g. 35.4"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Humidity (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  className="form-control"
                  placeholder="e.g. 40"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Operating Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modalType === 'add' ? 'Save Station' : 'Update Station'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedStation && (
        <Modal isOpen={true} onClose={closeModal} title="Weather Station Details">
          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Station Identifier</span>
              <span className="detail-value">{selectedStation.stationName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location</span>
              <span className="detail-value">{selectedStation.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Current Temperature</span>
              <span className="detail-value">{selectedStation.temperature}°C</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Relative Humidity</span>
              <span className="detail-value">{selectedStation.humidity}%</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <span className={`badge badge-${selectedStation.status.toLowerCase()}`}>
                  {selectedStation.status}
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
      {modalType === 'delete' && selectedStation && (
        <Modal isOpen={true} onClose={closeModal} title="Confirm Deletion">
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px' }}>
            Are you sure you want to delete the station record for{' '}
            <strong>"{selectedStation.stationName}"</strong>?
          </p>
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Station
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WeatherStations;
