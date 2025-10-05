import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, RegisterData } from '../../services/auth';
import styles from './RegisterPage.module.css';

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
  agreeToTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nationality: '',
    languagePreference: 'zh',
    ageGroup: '',
    phoneNumber: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ageGroups = [
    { value: '18-25', label: '18-25岁' },
    { value: '26-35', label: '26-35岁' },
    { value: '36-45', label: '36-45岁' },
    { value: '46-55', label: '46-55岁' },
    { value: '56+', label: '56岁以上' }
  ];

  const languages = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    if (!formData.nationality?.trim()) {
      newErrors.nationality = '请输入国籍';
    }

    if (!formData.ageGroup) {
      newErrors.ageGroup = '请选择年龄段';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '请同意服务条款和隐私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, agreeToTerms, ...registerData } = formData;
      const response = await authService.register(registerData);
      
      if (response.status === 'success') {
        // 注册成功，跳转到登录页面
        navigate('/login', { 
          state: { 
            message: '注册成功！请使用您的邮箱和密码登录。' 
          }
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '注册失败，请稍后重试';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>创建账户</h1>
          <p className={styles.subtitle}>加入我们，开始您的旅行探索之旅</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.submit && (
            <div className={styles.errorMessage}>
              <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.submit}
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                姓名 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="请输入您的姓名"
                autoComplete="name"
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                邮箱地址 *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="请输入您的邮箱地址"
                autoComplete="email"
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                密码 *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="请输入密码（至少6个字符）"
                autoComplete="new-password"
              />
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                确认密码 *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                placeholder="请再次输入密码"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="nationality" className={styles.label}>
                国籍 *
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.nationality ? styles.inputError : ''}`}
                placeholder="请输入您的国籍"
                autoComplete="country"
              />
              {errors.nationality && <span className={styles.fieldError}>{errors.nationality}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="ageGroup" className={styles.label}>
                年龄段 *
              </label>
              <select
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.ageGroup ? styles.inputError : ''}`}
              >
                <option value="">请选择年龄段</option>
                {ageGroups.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
              {errors.ageGroup && <span className={styles.fieldError}>{errors.ageGroup}</span>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="languagePreference" className={styles.label}>
                语言偏好
              </label>
              <select
                id="languagePreference"
                name="languagePreference"
                value={formData.languagePreference}
                onChange={handleInputChange}
                className={styles.select}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                手机号码
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="请输入您的手机号码（可选）"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                我同意
                <Link to="/terms" className={styles.link}>服务条款</Link>
                和
                <Link to="/privacy" className={styles.link}>隐私政策</Link>
              </span>
            </label>
            {errors.agreeToTerms && <span className={styles.fieldError}>{errors.agreeToTerms}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? (
              <>
                <svg className={styles.spinner} viewBox="0 0 24 24">
                  <circle
                    className={styles.spinnerCircle}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                注册中...
              </>
            ) : (
              '创建账户'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            已有账户？
            <Link to="/login" className={styles.loginLink}>
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;