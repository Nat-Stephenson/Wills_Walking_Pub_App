'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateRouteFormData, PubFormData } from '@/types';
import styles from './create.module.css';

export default function CreateRoute() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateRouteFormData>({
    name: '',
    description: '',
    distance: '',
    duration: '',
    difficulty: 'Moderate',
    region: '',
    historicalFacts: [],
  });

  const [pubs, setPubs] = useState<Array<{
    name: string;
    description: string;
    latitude: number;
    longitude: number;
  }>>([]);
  
  const [currentPub, setCurrentPub] = useState<PubFormData>({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
  });

  const [currentHistoricalFact, setCurrentHistoricalFact] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentPub({
      ...currentPub,
      [e.target.name]: e.target.value,
    });
  };

  const addPub = () => {
    if (currentPub.name && currentPub.latitude && currentPub.longitude) {
      setPubs([
        ...pubs,
        {
          name: currentPub.name,
          description: currentPub.description,
          latitude: parseFloat(currentPub.latitude),
          longitude: parseFloat(currentPub.longitude),
        },
      ]);
      
      setCurrentPub({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
      });
    }
  };

  const removePub = (index: number) => {
    setPubs(pubs.filter((_, i) => i !== index));
  };

  const addHistoricalFact = () => {
    if (currentHistoricalFact.trim()) {
      setFormData({
        ...formData,
        historicalFacts: [...(formData.historicalFacts || []), currentHistoricalFact.trim()],
      });
      setCurrentHistoricalFact('');
    }
  };

  const removeHistoricalFact = (index: number) => {
    setFormData({
      ...formData,
      historicalFacts: (formData.historicalFacts || []).filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Route data:', { ...formData, pubs });
    alert('Route created successfully!');
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create New Walking Route</h2>
      <p className={styles.subtitle}>Add a new pub walking route to your collection</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="card">
          <h3 className={styles.sectionTitle}>📋 Basic Information</h3>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Route Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Enter route name"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Region *</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="e.g., Cotswolds, Peak District"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Distance (km) *</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                step="0.1"
                required
                className="input-field"
                placeholder="0.0"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="120"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
              className="input-field"
              placeholder="Describe the route..."
            />
          </div>
        </div>

        <div className="card">
          <h3 className={styles.sectionTitle}>📜 Historical Facts & Points of Interest</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
            Add interesting historical facts, legends, myths, or notable sights along the route.
          </p>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Add Historical Fact</label>
            <textarea
              value={currentHistoricalFact}
              onChange={(e) => setCurrentHistoricalFact(e.target.value)}
              rows={3}
              className="input-field"
              placeholder="e.g., This route passes through the village where the legend of the Barghest originated..."
            />
          </div>
          
          <button type="button" onClick={addHistoricalFact} className={styles.addButton}>
            ➕ Add Historical Fact
          </button>

          {formData.historicalFacts && formData.historicalFacts.length > 0 && (
            <div className={styles.pubList}>
              <h4>Added Historical Facts ({formData.historicalFacts.length}):</h4>
              {formData.historicalFacts.map((fact, index) => (
                <div key={index} className={styles.pubItem}>
                  <div>
                    <p style={{ margin: 0, lineHeight: '1.5' }}>{fact}</p>
                  </div>
                  <button type="button" onClick={() => removeHistoricalFact(index)} className={styles.removeButton}>
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className={styles.sectionTitle}>🍺 Add Pubs Along Route</h3>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Pub Name</label>
              <input
                type="text"
                name="name"
                value={currentPub.name}
                onChange={handlePubInputChange}
                className="input-field"
                placeholder="The Red Lion"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={currentPub.latitude}
                onChange={handlePubInputChange}
                step="any"
                className="input-field"
                placeholder="51.7519"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={currentPub.longitude}
                onChange={handlePubInputChange}
                step="any"
                className="input-field"
                placeholder="-1.2578"
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Pub Description</label>
            <textarea
              name="description"
              value={currentPub.description}
              onChange={handlePubInputChange}
              rows={2}
              className="input-field"
              placeholder="Traditional country pub with excellent ales..."
            />
          </div>
          
          <button type="button" onClick={addPub} className={styles.addButton}>
            ➕ Add Pub
          </button>

          {pubs.length > 0 && (
            <div className={styles.pubList}>
              <h4>Added Pubs ({pubs.length}):</h4>
              {pubs.map((pub, index) => (
                <div key={index} className={styles.pubItem}>
                  <div>
                    <strong>{pub.name}</strong>
                    {pub.description && <p>{pub.description}</p>}
                    <small>📍 {pub.latitude}, {pub.longitude}</small>
                  </div>
                  <button type="button" onClick={() => removePub(index)} className={styles.removeButton}>
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button type="submit" className="btn-primary" style={{ minWidth: '200px' }}>
            Create Route
          </button>
        </div>
      </form>
    </div>
  );
}