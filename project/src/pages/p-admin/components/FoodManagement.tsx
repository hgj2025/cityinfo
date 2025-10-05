import React, { useState, useEffect } from 'react';
import styles from './FoodManagement.module.css';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  cityId: string;
  cityName?: string;
  coordinates?: string;
  openingHours: string;
  priceRange: string;
  rating: number;
  imageUrl: string;
  phone?: string;
  tags?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface City {
  id: string;
  name: string;
}

const FoodManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: '',
    cityId: '',
    openingHours: '',
    priceRange: '',
    rating: 0,
    imageUrl: '',
    phone: '',
    tags: ''
  });

  const cuisineTypes = [
    '川菜', '粤菜', '鲁菜', '苏菜', '浙菜', '闽菜', '湘菜', '徽菜',
    '西餐', '日料', '韩料', '东南亚菜', '火锅', '烧烤', '小吃', '甜品',
    '咖啡', '茶饮', '其他'
  ];

  useEffect(() => {
    fetchRestaurants();
    fetchCities();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/restaurants');
      const result = await response.json();
      
      if (result.status === 'success') {
        setRestaurants(result.data);
      } else {
        console.error('获取餐厅列表失败:', result.message);
      }
    } catch (error) {
      console.error('获取餐厅列表失败:', error);
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

  const handleCuisineFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCuisine(e.target.value);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || restaurant.cityId === selectedCity;
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCity && matchesCuisine;
  });

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setFormData({
      name: '',
      description: '',
      cuisine: '',
      address: '',
      cityId: '',
      openingHours: '',
      priceRange: '',
      rating: 0,
      imageUrl: '',
      phone: '',
      tags: ''
    });
    setShowAddModal(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      cityId: restaurant.cityId,
      openingHours: restaurant.openingHours,
      priceRange: restaurant.priceRange,
      rating: restaurant.rating,
      imageUrl: restaurant.imageUrl,
      phone: restaurant.phone || '',
      tags: restaurant.tags || ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingRestaurant 
        ? `/api/v1/restaurants/${editingRestaurant.id}`
        : '/api/v1/restaurants';
      
      const method = editingRestaurant ? 'PUT' : 'POST';
      
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
        fetchRestaurants();
        alert(editingRestaurant ? '餐厅更新成功' : '餐厅添加成功');
      } else {
        alert('操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleToggleActive = async (restaurant: Restaurant) => {
    try {
      const response = await fetch(`/api/v1/restaurants/${restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...restaurant,
          isActive: !restaurant.isActive
        }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchRestaurants();
      } else {
        alert('操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleDeleteRestaurant = async (restaurant: Restaurant) => {
    if (!confirm(`确定要删除餐厅 "${restaurant.name}" 吗？`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/v1/restaurants/${restaurant.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchRestaurants();
        alert('餐厅删除成功');
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
        <h1>美食管理</h1>
        <div className={styles.actions}>
          <input
            type="text"
            placeholder="搜索餐厅..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <select
            value={selectedCity}
            onChange={handleCityFilter}
            className={styles.filter}
          >
            <option value="">所有城市</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <select
            value={selectedCuisine}
            onChange={handleCuisineFilter}
            className={styles.filter}
          >
            <option value="">所有菜系</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
          <button onClick={handleAddRestaurant} className={styles.addButton}>
            添加餐厅
          </button>
        </div>
      </div>

      <div className={styles.restaurantGrid}>
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant.id} className={styles.restaurantCard}>
            <div className={styles.restaurantImage}>
              {restaurant.imageUrl ? (
                <img src={restaurant.imageUrl} alt={restaurant.name} />
              ) : (
                <div className={styles.noImage}>无图片</div>
              )}
            </div>
            <div className={styles.restaurantInfo}>
              <h3>{restaurant.name}</h3>
              <p className={styles.city}>{getCityName(restaurant.cityId)}</p>
              <p className={styles.cuisine}>{restaurant.cuisine}</p>
              <p className={styles.address}>{restaurant.address}</p>
              <p className={styles.description}>{restaurant.description}</p>
              <div className={styles.details}>
                <span className={styles.rating}>评分: {restaurant.rating}</span>
                <span className={styles.price}>{restaurant.priceRange}</span>
              </div>
              {restaurant.phone && (
                <p className={styles.phone}>电话: {restaurant.phone}</p>
              )}
              <div className={styles.status}>
                <span className={`${styles.statusBadge} ${restaurant.isActive ? styles.active : styles.inactive}`}>
                  {restaurant.isActive ? '营业中' : '暂停营业'}
                </span>
              </div>
            </div>
            <div className={styles.restaurantActions}>
              <button 
                onClick={() => handleEditRestaurant(restaurant)}
                className={styles.editButton}
              >
                编辑
              </button>
              <button 
                onClick={() => handleToggleActive(restaurant)}
                className={`${styles.toggleButton} ${restaurant.isActive ? styles.disable : styles.enable}`}
              >
                {restaurant.isActive ? '暂停' : '启用'}
              </button>
              <button 
                onClick={() => handleDeleteRestaurant(restaurant)}
                className={styles.deleteButton}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className={styles.empty}>
          {searchTerm || selectedCity || selectedCuisine ? '没有找到匹配的餐厅' : '暂无餐厅数据'}
        </div>
      )}

      {/* 添加/编辑餐厅模态框 */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingRestaurant ? '编辑餐厅' : '添加餐厅'}</h2>
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
                  <label>餐厅名称</label>
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
                  <label>菜系类型</label>
                  <select
                    value={formData.cuisine}
                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    required
                  >
                    <option value="">请选择菜系</option>
                    {cuisineTypes.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
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
                  <label>营业时间</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    placeholder="如：10:00-22:00"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>价格区间</label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    placeholder="如：50-100元/人"
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>联系电话</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="如：010-12345678"
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
              </div>
              <div className={styles.formGroup}>
                <label>标签 (用逗号分隔)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="如：网红店,环境好,服务佳"
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingRestaurant ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManagement;