import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/* eslint-disable no-unused-vars */
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  loadFromLocalStorage: () => void;
}

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}
/* eslint-enable no-unused-vars */

export const useAuthStore = create<AuthStore>((set) => {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: (_user, _token) => {
      set({ user: _user, token: _token, isAuthenticated: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', _token);
        localStorage.setItem('auth-user', JSON.stringify(_user));
      }
    },
    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
      }
    },
    setUser: (_user) => {
      set({ user: _user });
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-user', JSON.stringify(_user));
      }
    },
    loadFromLocalStorage: () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        const user = localStorage.getItem('auth-user');
        if (token && user) {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      }
    },
  };
});

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (_tasks) => set({ tasks: _tasks }),
  addTask: (_task) =>
    set((state) => ({ tasks: [_task, ...state.tasks] })),
  updateTask: (_id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === _id ? { ...task, ...updatedTask } : task,
      ),
    })),
  deleteTask: (_id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== _id),
    })),
}));
