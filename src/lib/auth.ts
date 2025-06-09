export interface User {
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = 'hsu_auth_token';
const USER_KEY = 'hsu_auth_user';

export const authService = {
  login: (email: string, password: string): Promise<{ user: User; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Use hardcoded demo credentials for the deployed version
        const validUsername = 'admin@harleystreetultrasound.com';
        const validPassword = 'HSU2024!Portal';

        if (email === validUsername && password === validPassword) {
          const user: User = {
            email,
            name: 'Dr. Sarah Collins',
            avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          };
          
          const token = `mock_jwt_token_${Date.now()}`;
          
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          
          resolve({ user, token });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};