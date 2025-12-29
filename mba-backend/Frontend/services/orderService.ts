
import { Order } from '../types';

const API_URL = 'http://localhost:8080/api/orders';

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return [];
  }
};

export const fetchOrdersByUser = async (username: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/user/${username}`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch user orders", error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to update order status", error);
    return false;
  }
};
