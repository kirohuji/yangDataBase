import { api } from './api';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '@/types/api';

// ============================================================================
// 认证服务
// ============================================================================

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  // 用户登录
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // 存储认证信息
    this.setToken(response.token);
    this.setUser(response.user);
    
    return response;
  }

  // 用户注册
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    // 存储认证信息
    this.setToken(response.token);
    this.setUser(response.user);
    
    return response;
  }

  // 用户登出
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // 即使API调用失败，也要清除本地存储
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  // 刷新令牌
  static async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    
    // 更新认证信息
    this.setToken(response.token);
    this.setUser(response.user);
    
    return response;
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<User> {
    return await api.get<User>('/auth/profile');
  }

  // 更新用户资料
  static async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await api.put<User>('/auth/profile', updates);
    
    // 更新本地存储的用户信息
    this.setUser(response);
    
    return response;
  }

  // 修改密码
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await api.post('/auth/change-password', data);
  }

  // 忘记密码
  static async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  // 重置密码
  static async resetPassword(data: {
    token: string;
    password: string;
  }): Promise<void> {
    await api.post('/auth/reset-password', data);
  }

  // ============================================================================
  // 本地存储管理
  // ============================================================================

  // 设置认证令牌
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // 获取认证令牌
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 设置用户信息
  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // 获取用户信息
  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // 清除认证信息
  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // 检查是否已认证
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // 检查令牌是否过期
  static isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // 解析JWT令牌
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.warn('Failed to parse token:', error);
      return true;
    }
  }

  // 获取用户角色
  static getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  // 检查用户权限
  static hasPermission(requiredRole: string): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    // 角色权限层级：ADMIN > ANALYST > USER
    const roleHierarchy: Record<string, number> = {
      USER: 1,
      ANALYST: 2,
      ADMIN: 3,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  // 检查是否为管理员
  static isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  // 检查是否为分析师
  static isAnalyst(): boolean {
    const role = this.getUserRole();
    return role === 'ANALYST' || role === 'ADMIN';
  }
}

export default AuthService;
