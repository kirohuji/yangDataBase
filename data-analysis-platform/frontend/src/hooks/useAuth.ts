import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/authService';
import { useAppStore } from '@/stores/useAppStore';
import { useNavigate } from 'react-router-dom';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '@/types/api';

// ============================================================================
// 查询键常量
// ============================================================================

export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_QUERY_KEYS.all, 'user'] as const,
  profile: () => [...AUTH_QUERY_KEYS.all, 'profile'] as const,
};

// ============================================================================
// 认证查询 Hooks
// ============================================================================

// 获取当前用户信息
export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile(),
    queryFn: () => AuthService.getCurrentUser(),
    enabled: enabled && AuthService.isAuthenticated(),
    staleTime: 10 * 60 * 1000, // 10分钟
    retry: (failureCount, error: any) => {
      // 如果是401错误，不重试
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    onError: (error: any) => {
      // 如果获取用户信息失败且是401错误，清除认证信息
      if (error?.response?.status === 401) {
        AuthService.clearAuth();
      }
    },
  });
};

// ============================================================================
// 认证变更 Hooks
// ============================================================================

// 用户登录
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // 设置用户信息到缓存
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile(), data.user);
      
      // 根据用户偏好设置语言（如果有的话）
      // if (data.user.preferences?.language) {
      //   setLanguage(data.user.preferences.language);
      // }
      
      addNotification({
        type: 'success',
        title: 'Welcome Back!',
        message: `Hello ${data.user.name || data.user.username}, you have successfully logged in.`,
      });

      // 跳转到首页或之前访问的页面
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
      navigate(redirectTo, { replace: true });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: error.response?.data?.message || 'Invalid email or password.',
      });
    },
  });
};

// 用户注册
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
    onSuccess: (data: AuthResponse) => {
      // 设置用户信息到缓存
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile(), data.user);
      
      addNotification({
        type: 'success',
        title: 'Welcome!',
        message: `Account created successfully. Welcome ${data.user.name || data.user.username}!`,
      });

      // 跳转到首页
      navigate('/', { replace: true });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message,
      });
    },
  });
};

// 用户登出
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // 清除所有缓存
      queryClient.clear();
      
      addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
      });

      // 跳转到登录页
      navigate('/login', { replace: true });
    },
    onError: () => {
      // 即使登出API失败，也要清除本地状态
      queryClient.clear();
      
      addNotification({
        type: 'warning',
        title: 'Logout Warning',
        message: 'Logout completed but there was an issue with the server.',
      });

      navigate('/login', { replace: true });
    },
  });
};

// 刷新令牌
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: () => AuthService.refreshToken(),
    onSuccess: (data: AuthResponse) => {
      // 更新用户信息缓存
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile(), data.user);
      
      addNotification({
        type: 'success',
        title: 'Session Refreshed',
        message: 'Your session has been refreshed successfully.',
      });
    },
    onError: () => {
      // 刷新失败，清除认证信息
      AuthService.clearAuth();
      queryClient.clear();
      
      addNotification({
        type: 'error',
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.',
      });

      // 跳转到登录页
      window.location.href = '/login';
    },
  });
};

// 更新用户资料
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (updates: Partial<User>) => AuthService.updateProfile(updates),
    onSuccess: (data: User) => {
      // 更新缓存
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile(), data);
      
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update profile.',
      });
    },
  });
};

// 修改密码
export const useChangePassword = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => 
      AuthService.changePassword(data),
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been changed successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Password Change Failed',
        message: error.response?.data?.message || 'Failed to change password.',
      });
    },
  });
};

// 忘记密码
export const useForgotPassword = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Reset Email Sent',
        message: 'A password reset link has been sent to your email address.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Reset Request Failed',
        message: error.response?.data?.message || 'Failed to send reset email.',
      });
    },
  });
};

// 重置密码
export const useResetPassword = () => {
  const navigate = useNavigate();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (data: { token: string; password: string }) => 
      AuthService.resetPassword(data),
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Password Reset',
        message: 'Your password has been reset successfully. Please log in with your new password.',
      });

      // 跳转到登录页
      navigate('/login', { replace: true });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Reset Failed',
        message: error.response?.data?.message || 'Failed to reset password.',
      });
    },
  });
};

// ============================================================================
// 认证状态 Hooks
// ============================================================================

// 检查是否已认证
export const useIsAuthenticated = () => {
  return AuthService.isAuthenticated();
};

// 检查用户角色
export const useUserRole = () => {
  const { data: user } = useCurrentUser();
  return user?.role || AuthService.getUserRole();
};

// 检查用户权限
export const useHasPermission = (requiredRole: string) => {
  // const userRole = useUserRole();
  return AuthService.hasPermission(requiredRole);
};

// 检查是否为管理员
export const useIsAdmin = () => {
  const userRole = useUserRole();
  return userRole === 'ADMIN';
};

// 检查是否为分析师
export const useIsAnalyst = () => {
  const userRole = useUserRole();
  return userRole === 'ANALYST' || userRole === 'ADMIN';
};

// ============================================================================
// 自动刷新令牌 Hook
// ============================================================================

export const useAutoRefreshToken = () => {
  const refreshTokenMutation = useRefreshToken();

  React.useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      return;
    }

    const checkTokenExpiration = () => {
      if (AuthService.isTokenExpired()) {
        refreshTokenMutation.mutate();
      }
    };

    // 立即检查一次
    checkTokenExpiration();

    // 每5分钟检查一次
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshTokenMutation]);
};

// ============================================================================
// 路由保护 Hook
// ============================================================================

export const useRequireAuth = (requiredRole?: string) => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const hasPermission = useHasPermission(requiredRole || 'USER');

  React.useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
      return;
    }

    if (requiredRole && !hasPermission) {
      navigate('/unauthorized', { replace: true });
      return;
    }
  }, [isAuthenticated, hasPermission, navigate, requiredRole]);

  return { isAuthenticated, hasPermission };
};

export default {
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
  useRefreshToken,
  useUpdateProfile,
  useChangePassword,
  useForgotPassword,
  useResetPassword,
  useIsAuthenticated,
  useUserRole,
  useHasPermission,
  useIsAdmin,
  useIsAnalyst,
  useAutoRefreshToken,
  useRequireAuth,
};
