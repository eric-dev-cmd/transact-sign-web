import { TEST_CREDENTIALS } from "@/constants/testCredentials";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// This is a mock API call - appropriate for a technical test
const loginApi = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For a technical test, we'll accept the predefined credentials
      if (
        email === TEST_CREDENTIALS.email &&
        password === TEST_CREDENTIALS.password
      ) {
        resolve({
          user: {
            id: "1",
            email,
            name: "Eric",
            role: "admin",
          },
          token: "mock-jwt-token-for-technical-test",
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 800); // Reduced delay for testing
  });
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const { user, token } = await loginApi(email, password);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "transactsign-auth", // name of the item in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
