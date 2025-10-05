import React, { useState, useEffect } from 'react';
import styles from './AttractionManagement.module.css';

interface Attraction {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  cityId: string;
  cityName?: string;
  coordinates?: string;
  openingHours: string;
  ticketPrice: string;
  rating: number;
  imageUrl: string;
  tags?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface City {
  id: string;
  name: string;
}

const AttractionManagement: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    cityId: '',
    openingHours: '',
    ticketPrice: '',
    rating: 0,
    imageUrl: '',
    tags: ''
  });

  useEffect(() => {
    fetchAttractions();
    fetchCities();
  }, []);

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/attractions');
      const result = await response.json();
      
      if (result.status === 'success') {
        setAttractions(result.data);
      } else {
        console.error('获取景点列表失败:', result.message);
      }
    } catch (error) {
      console.error('获取景点列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/v1/cities');
      const result = await response.json();
      
      if (result.status === 'success') {
        setCities(result.data);
      }
    } catch (error) {
      console.error('获取城市列表失败:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || attraction.cityId === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleAddAttraction = () => {
    setEditingAttraction(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      address: '',
      cityId: '',
      openingHours: '',
      ticketPrice: '',
      rating: 0,
      imageUrl: '',
      tags: ''
    });
    setShowAddModal(true);
  };

  const handleEditAttraction = (attraction: Attraction) => {
    setEditingAttraction(attraction);
    setFormData({
      name: attraction.name,
      description: attraction.description,
      category: attraction.category,
      address: attraction.address,
      cityId: attraction.cityId,
      openingHours: attraction.openingHours,
      ticketPrice: attraction.ticketPrice,
      rating: attraction.rating,
      imageUrl: attraction.imageUrl,
      tags: attraction.tags || ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingAttraction 
        ? `/api/v1/attractions/${editingAttraction.id}`
        : '/api/v1/attractions';
      
      const method = editingAttraction ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
          isActive: true
        }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setShowAddModal(false);
        fetchAttractions();
        alert(editingAttraction ? '景点更新成功' : '景点添加成功');
      } else {
        alert('操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleToggleActive = async (attraction: Attraction) => {
    try {
      const response = await fetch(`/api/v1/attractions/${attraction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...attraction,
          isActive: !attraction.isActive
        }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchAttractions();
      } else {
        alert('操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleDeleteAttraction = async (attraction: Attraction) => {
    if (!confirm(`确定要删除景点 "${attraction.name}" 吗？`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/v1/attractions/${attraction.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchAttractions();
        alert('景点删除成功');
      } else {
        alert('删除失败: ' + result.message);
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    return city ? city.name : '未知城市';
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
        <h1>景点管理</h1>
        <div className={styles.actions}>
          <input
            type="text"
            placeholder="搜索景点..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <select
            value={selectedCity}
            onChange={handleCityFilter}
            className={styles.cityFilter}
          >
            <option value="">所有城市</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <button onClick={handleAddAttraction} className={styles.addButton}>
            添加景点
          </button>
        </div>
      </div>

      <div className={styles.attractionGrid}>
        {filteredAttractions.map(attraction => (
          <div key={attraction.id} className={styles.attractionCard}>
            <div className={styles.attractionImage}>
              {attraction.imageUrl ? (
                <img src={attraction.imageUrl} alt={attraction.name} />
              ) : (
                <div className={styles.noImage}>无图片</div>
              )}
            </div>
            <div className={styles.attractionInfo}>
              <h3>{attraction.name}</h3>
              <p className={styles.city}>{getCityName(attraction.cityId)}</p>
              <p className={styles.category}>{attraction.category}</p>
              <p className={styles.address}>{attraction.address}</p>
              <p className={styles.description}>{attraction.description}</p>
              <div className={styles.details}>
                <span className={styles.rating}>评分: {attraction.rating}</span>
                <span className={styles.price}>{attraction.ticketPrice}</span>
              </div>
              <div className={styles.status}>
                <span className={`${styles.statusBadge} ${attraction.isActive ? styles.active : styles.inactive}`}>
                  {attraction.isActive ? '启用' : '禁用'}
                </span>
              </div>
            </div>
            <div className={styles.attractionActions}>
              <button 
                onClick={() => handleEditAttraction(attraction)}
                className={styles.editButton}
              >
                编辑
              </button>
              <button 
                onClick={() => handleToggleActive(attraction)}
                className={`${styles.toggleButton} ${attraction.isActive ? styles.disable : styles.enable}`}
              >
                {attraction.isActive ? '禁用' : '启用'}
              </button>
              <button 
                onClick={() => handleDeleteAttraction(attraction)}
                className={styles.deleteButton}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAttractions.length === 0 && (
        <div className={styles.empty}>
          {searchTerm || selectedCity ? '没有找到匹配的景点' : '暂无景点数据'}
        </div>
      )}

      {/* 添加/编辑景点模态框 */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingAttraction ? '编辑景点' : '添加景点'}</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>景点名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>所属城市</label>
                  <select
                    value={formData.cityId}
                    onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                    required
                  >
                    <option value="">请选择城市</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>景点类别</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="如：历史文化、自然风光等"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>评分 (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>地址</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>开放时间</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    placeholder="如：09:00-17:00"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>门票价格</label>
                  <input
                    type="text"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    placeholder="如：50元"
                  />
                </div>
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
              <div className={styles.formGroup}>
                <label>标签 (用逗号分隔)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="如：历史,文化,必游"
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingAttraction ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionManagement;