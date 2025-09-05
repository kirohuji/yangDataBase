import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getTheme } from '@/theme/theme';
import { useAppStore } from '@/stores/useAppStore';
import NotificationProvider from '@/components/common/NotificationProvider';
import ReactErrorBoundary from '@/components/common/ReactErrorBoundary';
import RouterErrorBoundary from '@/components/common/RouterErrorBoundary';
import Layout from '@/Layout';
import LoadingFallback from '@/components/common/LoadingFallback';

// 懒加载页面组件
const Home = React.lazy(() => import('@/pages/Home'));
const Phenotype = React.lazy(() => import('@/pages/Phenotype'));
const Tools = React.lazy(() => import('@/pages/Tools'));
const Download = React.lazy(() => import('@/pages/Download'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Home />
          </React.Suspense>
        ),
      },
      {
        path: 'phenotype',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Phenotype />
          </React.Suspense>
        ),
      },
      {
        path: 'tools',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Tools />
          </React.Suspense>
        ),
      },
      {
        path: 'download',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Download />
          </React.Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </React.Suspense>
        ),
      },
    ],
  },
]);

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const { language } = useAppStore();

  // 根据语言获取MUI主题
  const muiTheme = getTheme(language);

  // 同步语言变化
  React.useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <ReactErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </ThemeProvider>
        
        {/* React Query 开发工具 */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ReactErrorBoundary>
  );
};

export default App;
