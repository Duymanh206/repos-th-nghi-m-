import { getJson } from './api';

export interface HealthResponse {
  status: string;
}

/**
 * Gọi API kiểm tra sức khỏe của Backend.
 * @returns true nếu status là 'UP', false nếu không phản hồi hoặc lỗi.
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const data = (await getJson('/health')) as HealthResponse;
    return data.status === 'UP';
  } catch (error) {
    console.error('Lỗi khi kết nối Backend:', error);
    return false;
  }
};
