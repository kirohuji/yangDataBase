import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// 应用全局状态接口
interface AppState {
  // UI状态
  theme: 'light' | 'dark';
  language: 'en' | 'zh';
  sidebarOpen: boolean;
  
  // 加载状态
  isLoading: boolean;
  loadingMessage: string;
  
  // 错误状态
  error: string | null;
  
  // 通知状态
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: number;
  autoHide?: boolean;
}

interface AppActions {
  // UI操作
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'zh') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // 加载状态操作
  setLoading: (loading: boolean, message?: string) => void;
  
  // 错误处理操作
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 通知操作
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type AppStore = AppState & AppActions;

// 创建应用状态存储
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        theme: 'light',
        language: 'en',
        sidebarOpen: false,
        isLoading: false,
        loadingMessage: '',
        error: null,
        notifications: [],

        // UI操作
        setTheme: (theme) => {
          set({ theme }, false, 'setTheme');
        },

        setLanguage: (language) => {
          set({ language }, false, 'setLanguage');
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar');
        },

        setSidebarOpen: (open) => {
          set({ sidebarOpen: open }, false, 'setSidebarOpen');
        },

        // 加载状态操作
        setLoading: (loading, message = '') => {
          set({ isLoading: loading, loadingMessage: message }, false, 'setLoading');
        },

        // 错误处理操作
        setError: (error) => {
          set({ error }, false, 'setError');
        },

        clearError: () => {
          set({ error: null }, false, 'clearError');
        },

        // 通知操作
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          };

          set(
            (state) => ({
              notifications: [...state.notifications, newNotification],
            }),
            false,
            'addNotification'
          );

          // 自动隐藏通知
          if (notification.autoHide !== false) {
            setTimeout(() => {
              get().removeNotification(newNotification.id);
            }, 5000);
          }
        },

        removeNotification: (id) => {
          set(
            (state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            'removeNotification'
          );
        },

        clearNotifications: () => {
          set({ notifications: [] }, false, 'clearNotifications');
        },
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'AppStore',
    }
  )
);
