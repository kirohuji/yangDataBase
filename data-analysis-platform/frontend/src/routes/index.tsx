import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from '@components/layout/Layout';
import ErrorBoundary from '@components/common/ErrorBoundary';

// 懒加载页面组件
const Home = React.lazy(() => import('@pages/Home'));
const Phenotype = React.lazy(() => import('@pages/Phenotype'));
const Tools = React.lazy(() => import('@pages/Tools'));
const Download = React.lazy(() => import('@pages/Download'));

// 加载中组件
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <CircularProgress size={40} />
    <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
      Loading...
    </Box>
  </Box>
);

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'phenotype',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Phenotype />
          </Suspense>
        ),
      },
      {
        path: 'tools',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Tools />
          </Suspense>
        ),
      },
      {
        path: 'download',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Download />
          </Suspense>
        ),
      },
    ],
  },
]);

// 路由提供者组件
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
