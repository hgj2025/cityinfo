import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_home from '../pages/p-home';
import P_city_detail from '../pages/p-city_detail';
import P_attraction_detail from '../pages/p-attraction_detail';
import P_food_detail from '../pages/p-food_detail';
import P_accommodation_detail from '../pages/p-accommodation_detail';
import P_traffic_guide from '../pages/p-traffic_guide';
import P_collection_my from '../pages/p-collection_my';
import P_search_result from '../pages/p-search_result';
import P_map_view from '../pages/p-map_view';
import LoginPage from '../pages/p-auth/LoginPage';
import RegisterPage from '../pages/p-auth/RegisterPage';
import SurveyPage from '../pages/SurveyPage';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

// 管理后台相关页面
import AdminLayout from '../pages/p-admin';
import AdminDashboard from '../pages/p-admin/components/AdminDashboard';
import DataCollection from '../pages/p-admin/components/DataCollection';
import TaskDetails from '../pages/p-admin/components/TaskDetails';
import CityManagement from '../pages/p-admin/components/CityManagement';
import AttractionManagement from '../pages/p-admin/components/AttractionManagement';
import FoodManagement from '../pages/p-admin/components/FoodManagement';
import ReviewQueue from '../pages/p-admin/components/ReviewQueue';

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/home' replace={true} />,
  },
  {
    path: '/home',
    element: (
      <ErrorBoundary>
        <P_home />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/city-detail',
    element: (
      <ErrorBoundary>
        <P_city_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/city-detail/:id',
    element: (
      <ErrorBoundary>
        <P_city_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/attraction-detail',
    element: (
      <ErrorBoundary>
        <P_attraction_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/food-detail',
    element: (
      <ErrorBoundary>
        <P_food_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/accommodation-detail',
    element: (
      <ErrorBoundary>
        <P_accommodation_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/traffic-guide',
    element: (
      <ErrorBoundary>
        <P_traffic_guide />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/collection-my',
    element: (
      <ErrorBoundary>
        <P_collection_my />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/search-result',
    element: (
      <ErrorBoundary>
        <P_search_result />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/map-view',
    element: (
      <ErrorBoundary>
        <P_map_view />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        <LoginPage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: (
      <ErrorBoundary>
        <RegisterPage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/survey',
    element: (
      <ErrorBoundary>
        <SurveyPage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin',
    element: (
      <ErrorBoundary>
        <AdminLayout />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to='/admin/dashboard' replace={true} />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'data-collection',
        element: <DataCollection />,
      },
      {
        path: 'cities',
        element: <CityManagement />,
      },
      {
        path: 'attractions',
        element: <AttractionManagement />,
      },
      {
        path: 'foods',
        element: <FoodManagement />,
      },
      {
        path: 'reviews',
        element: <ReviewQueue />,
      },
    ],
  },
  {
    path: '/p-admin',
    element: (
      <ErrorBoundary>
        <AdminLayout />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to='/p-admin/dashboard' replace={true} />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'data-collection',
        element: <DataCollection />,
      },
      {
        path: 'tasks/:taskId/details',
        element: <TaskDetails />,
      },
      {
        path: 'cities',
        element: <CityManagement />,
      },
      {
        path: 'attractions',
        element: <AttractionManagement />,
      },
      {
        path: 'foods',
        element: <FoodManagement />,
      },
      {
        path: 'reviews',
        element: <ReviewQueue />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;