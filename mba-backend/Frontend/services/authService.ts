
import { User } from '../types';

const API_URL = 'http://localhost:8080/api/auth';

export const loginUser = async (user: Partial<User>): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      const data = await response.json();
      // Backend trả về user object nếu thành công
      if (data) return data;
    }
    return null;
  } catch (error) {
    console.warn("Backend auth failed, using mock for testing.");
    // Mock login logic để bạn test giao diện nếu chưa chạy Backend
    if (user.username === 'admin' && user.password === '123') {
      return { username: 'admin', fullName: 'Quản Trị Viên', email: 'admin@mba.com', role: 'ADMIN' };
    }
    if (user.username === 'user' && user.password === '123') {
      return { username: 'user', fullName: 'Khách Hàng', email: 'user@gmail.com', role: 'USER' };
    }
    return null;
  }
};

export const registerUser = async (user: Partial<User>): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (response.ok) return await response.json();
    return null;
  } catch (error) {
    console.error("Register error", error);
    return null;
  }
};
