import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const API_URL = 'http://localhost:8080/api/products';
const IMAGE_API_URL = 'http://localhost:8080/api/images/upload';

export const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(IMAGE_API_URL, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            return await response.text(); 
        }
        return null;
    } catch (error) {
        console.error("Upload image failed", error);
        return null;
    }
};

const buildJsonPayload = (product: Partial<Product>) => {
    return {
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      image: product.image,
      description: product.description,
      cpu: product.specs?.cpu,
      ram: product.specs?.ram,
      storage: product.specs?.storage,
      gpu: product.specs?.gpu,
      screen: product.specs?.screen
    };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.warn("API did not return an array, using mock data.");
      return MOCK_PRODUCTS;
    }

    return data.map((item: any) => ({
      id: item.id || Math.random(),
      name: item.name || "Sản phẩm chưa đặt tên",
      price: item.price || 0,
      originalPrice: item.originalPrice || null,
      category: item.category || 'Laptop',
      brand: item.brand || "Generic",
      image: item.image || "https://picsum.photos/seed/tech/400/400",
      rating: item.rating || 5,
      reviewsCount: item.reviewsCount || 0,
      description: item.description || "Đang cập nhật...",
      specs: {
        cpu: item.cpu || "N/A",
        ram: item.ram || "N/A",
        storage: item.storage || "N/A",
        gpu: item.gpu || "N/A",
        screen: item.screen || "N/A"
      }
    }));
  } catch (error) {
    console.warn("Backend error or offline, using mock data.", error);
    return MOCK_PRODUCTS;
  }
};

export const createProduct = async (product: Partial<Product>): Promise<boolean> => {
  try {
    const payload = buildJsonPayload(product);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) 
    });
    return response.ok;
  } catch (error) {
    console.error("Create product failed", error);
    return false;
  }
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<boolean> => {
  try {
    const payload = buildJsonPayload(product);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (error) {
    console.error("Update product failed", error);
    return false;
  }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error("Delete product failed", error);
    return false;
  }
};