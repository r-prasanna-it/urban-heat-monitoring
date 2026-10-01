import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Thermometer,
} from 'lucide-react';
import L from 'leaflet';
import Modal from '../components/Modal';
import {
  getHotspots,
  createHotspot,
  updateHotspot,
  deleteHotspot,
} from '../services/api';

const HeatHotspots = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'view' | 'delete'
  const [formData, setFormData] = useState({
    location: '',
    temperature: '',
    severity: 'Medium',
    date: new Date().toISOString().split('T')[0],
    latitude: '12.9716',
    longitude: '77.5946',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const fetchHotspotsData = async () => {
    try {
      setLoading(true);
      const res = await getHotspots();
      if (res.success) {
        setHotspots(res.data);
      }
    } catch (err) {
      console.error('Error fetching hotspots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspotsData();
  }, []);

  // Update map markers when hotspots data changes
  useEffect(() => {
    if (!mapContainerRef.current || hotspots.length === 0) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = hotspots[0]?.latitude || 12.9716;
    const defaultLng = hotspots[0]?.longitude || 77.5946;

    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds = [];

    hotspots.forEach((spot) => {
      if (spot.latitude && spot.longitude) {
        const color =
          spot.severity === 'High' ? '#ef4444' : spot.severity === 'Medium' ? '#f59e0b' : '#10b981';

        const marker = L.circleMarker([spot.latitude, spot.longitude], {
          radius: 12,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-size: 13px;">
            <b>${spot.location}</b><br/>
            Temp: <b style="color: ${color}">${spot.temperature}°C</b><br/>
            Severity: ${spot.severity}
          </div>
        `);

        bounds.push([spot.latitude, spot.longitude]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hotspots]);

  const openAddModal = () => {
    setFormData({
      location: '',
      temperature: '',
      severity: 'Medium',
      date: new Date().toISOString().split('T')[0],
      latitude: '12.9716',
      longitude: '77.5946',
    });
    setErrorMsg('');
    setModalType('add');
  };

  const openEditModal = (spot) => {
    setSelectedHotspot(spot);
    setFormData({
      location: spot.location,
      temperature: spot.temperature,
      severity: spot.severity,
      date: spot.date ? new Date(spot.date).toISOString().split('T')[0] : '',
      latitude: spot.latitude,
      longitude: spot.longitude,
    });
    setErrorMsg('');
    setModalType('edit');
  };

  const openViewModal = (spot) => {
    setSelectedHotspot(spot);
    setModalType('view');
  };

  const openDeleteModal = (spot) => {
    setSelectedHotspot(spot);
    setModalType('delete');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedHotspot(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.location || formData.temperature === '') {
      setErrorMsg('Please enter location and temperature.');
      return;
    }

    try {
      if (modalType === 'add') {
        const res = await createHotspot(formData);
        if (res.success) {
          fetchHotspotsData();
          closeModal();
        }
      } else if (modalType === 'edit') {
        const res = await updateHotspot(selectedHotspot._id, formData);
        if (res.success) {
          fetchHotspotsData();
          closeModal();
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!selectedHotspot) return;
    try {
      const res = await deleteHotspot(selectedHotspot._id);
      if (res.success) {
        fetchHotspotsData();
        closeModal();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="table-card" style={{ marginBottom: '24px' }}>
        <div className="table-header-bar">
          <div className="table-header-title">
            <h2>Heat Hotspots Registry</h2>
            <p>Monitor critical temperature zones across municipal sectors</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Hotspot</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Temperature</th>
                <th>Severity</th>
                <th>Recorded Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotspots.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                    No heat hotspots found.
                  </td>
                </tr>
              ) : (
                hotspots.map((spot) => (
                  <tr key={spot._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} color="#64748b" />
                        <strong>{spot.location}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: spot.temperature >= 40 ? '#ef4444' : '#1e293b' }}>
                        {spot.temperature}°C
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${spot.severity.toLowerCase()}`}
                      >
                        {spot.severity}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                        <Calendar size={14} />
                        <span>{new Date(spot.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon view"
                          title="View Details"
                          onClick={() => openViewModal(spot)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-icon edit"
                          title="Edit"
                          onClick={() => openEditModal(spot)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete"
                          onClick={() => openDeleteModal(spot)}
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

      {/* Map visualization */}
      <div className="card">
        <div className="card-header">
          <h3>
            <Flame size={18} color="#ef4444" />
            Hotspot Spatial Heatmap
          </h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div ref={mapContainerRef} className="map-container" />
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalType === 'add' ? 'Add Heat Hotspot' : 'Edit Heat Hotspot'}
        >
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Downtown Central Market"
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
                  placeholder="e.g. 42.5"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select
                  className="form-control"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Recorded Date</label>
              <input
                type="date"
                required
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  className="form-control"
                  placeholder="12.9716"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  className="form-control"
                  placeholder="77.5946"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modalType === 'add' ? 'Save Hotspot' : 'Update Hotspot'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedHotspot && (
        <Modal isOpen={true} onClose={closeModal} title="Heat Hotspot Details">
          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Location</span>
              <span className="detail-value">{selectedHotspot.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Temperature</span>
              <span className="detail-value" style={{ color: '#ef4444' }}>
                {selectedHotspot.temperature}°C
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Severity</span>
              <span className="detail-value">
                <span className={`badge badge-${selectedHotspot.severity.toLowerCase()}`}>
                  {selectedHotspot.severity}
                </span>
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Recorded Date</span>
              <span className="detail-value">
                {new Date(selectedHotspot.date).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Coordinates</span>
              <span className="detail-value">
                {selectedHotspot.latitude}, {selectedHotspot.longitude}
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
      {modalType === 'delete' && selectedHotspot && (
        <Modal isOpen={true} onClose={closeModal} title="Confirm Deletion">
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px' }}>
            Are you sure you want to delete the heat hotspot record for{' '}
            <strong>"{selectedHotspot.location}"</strong>?
          </p>
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Hotspot
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HeatHotspots;
