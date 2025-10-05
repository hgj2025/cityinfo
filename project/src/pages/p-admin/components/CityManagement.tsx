import React, { useState, useEffect } from 'react';
import styles from './CityManagement.module.css';

interface City {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CityManagement: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/cities');
      const result = await response.json();
      
      if (result.status === 'success') {
        setCities(result.data);
      } else {
        console.error('获取城市列表失败:', result.message);
      }
    } catch (error) {
      console.error('获取城市列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCity = () => {
    setEditingCity(null);
    setFormData({ name: '', country: '', description: '', imageUrl: '' });
    setShowAddModal(true);
  };

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      country: city.country,
      description: city.description,
      imageUrl: city.imageUrl
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCity 
        ? `/api/v1/cities/${editingCity.id}`
        : '/api/v1/cities';
      
      const method = editingCity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isActive: true
        }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setShowAddModal(false);
        fetchCities();
        alert(editingCity ? '城市更新成功' : '城市添加成功');
      } else {
        alert('操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleToggleActive = async (city: City) => {
    try {
      const response = await fetch(`/api/v1/cities/${city.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...city,
          isActive: !city.isActive
        }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchCities();
      } else {
        alert('操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleDeleteCity = async (city: City) => {
    if (!confirm(`确定要删除城市 "${city.name}" 吗？`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/v1/cities/${city.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchCities();
        alert('城市删除成功');
      } else {
        alert('删除失败: ' + result.message);
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>城市管理</h1>
        <div className={styles.actions}>
          <input
            type="text"
            placeholder="搜索城市..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <button onClick={handleAddCity} className={styles.addButton}>
            添加城市
          </button>
        </div>
      </div>

      <div className={styles.cityGrid}>
        {filteredCities.map(city => (
          <div key={city.id} className={styles.cityCard}>
            <div className={styles.cityImage}>
              {city.imageUrl ? (
                <img src={city.imageUrl} alt={city.name} />
              ) : (
                <div className={styles.noImage}>无图片</div>
              )}
            </div>
            <div className={styles.cityInfo}>
              <h3>{city.name}</h3>
              <p className={styles.country}>{city.country}</p>
              <p className={styles.description}>{city.description}</p>
              <div className={styles.status}>
                <span className={`${styles.statusBadge} ${city.isActive ? styles.active : styles.inactive}`}>
                  {city.isActive ? '启用' : '禁用'}
                </span>
              </div>
            </div>
            <div className={styles.cityActions}>
              <button 
                onClick={() => handleEditCity(city)}
                className={styles.editButton}
              >
                编辑
              </button>
              <button 
                onClick={() => handleToggleActive(city)}
                className={`${styles.toggleButton} ${city.isActive ? styles.disable : styles.enable}`}
              >
                {city.isActive ? '禁用' : '启用'}
              </button>
              <button 
                onClick={() => handleDeleteCity(city)}
                className={styles.deleteButton}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className={styles.empty}>
          {searchTerm ? '没有找到匹配的城市' : '暂无城市数据'}
        </div>
      )}

      {/* 添加/编辑城市模态框 */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingCity ? '编辑城市' : '添加城市'}</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>城市名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>国家</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>图片URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingCity ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityManagement;