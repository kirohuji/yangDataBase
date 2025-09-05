import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/Layout';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// 懒加载页面组件
const Home = React.lazy(() => import('@/pages/Home'));
const Phenotype = React.lazy(() => import('@/pages/Phenotype'));
const Tools = React.lazy(() => import('@/pages/Tools'));
const Download = React.lazy(() => import('@/pages/Download'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="phenotype"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Phenotype />
              </Suspense>
            }
          />
          <Route
            path="tools"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Tools />
              </Suspense>
            }
          />
          <Route
            path="download"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Download />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
