
import { GoogleGenAI } from "@google/genai";
import { fetchProducts } from "./productService";
import { Product } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found via process.env.API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Xin lỗi, tôi chưa được cấu hình API Key. Vui lòng kiểm tra lại code.";

  try {
    const products = await fetchProducts();
    
    // Sử dụng return rõ ràng để tránh lỗi cú pháp khi biên dịch
    const productContext = products.map(p => {
      return `- ${p.name} (${p.category} - ${p.brand}): ${p.price.toLocaleString()} VND. 
       Cấu hình: CPU ${p.specs?.cpu || 'N/A'}, RAM ${p.specs?.ram || 'N/A'}, GPU ${p.specs?.gpu || 'N/A'}.
       Mô tả: ${p.description}`;
    }).join('\n');

    const systemInstruction = `
      Bạn là trợ lý ảo AI chuyên nghiệp của MbaEvolutionAI.
      Dưới đây là danh sách sản phẩm HIỆN CÓ:
      ${productContext}

      Nhiệm vụ: Tư vấn ngắn gọn, thân thiện, dùng emoji.
      Nếu khách hỏi sản phẩm không có trong danh sách, hãy gợi ý sản phẩm tương tự trong danh sách.
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Xin lỗi, em đang suy nghĩ một chút, anh/chị hỏi lại được không ạ?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hệ thống AI đang bận hoặc gặp sự cố kết nối.";
  }
};

// --- HÀM SO SÁNH SẢN PHẨM ---
export const compareProductsAI = async (p1: Product, p2: Product): Promise<string> => {
  const client = getClient();
  if (!client) return "Chưa cấu hình API Key.";

  try {
    // Thêm kiểm tra an toàn (?. và ||) cho các trường specs để tránh lỗi crash
    const prompt = `
      Hãy đóng vai chuyên gia công nghệ, so sánh chi tiết 2 sản phẩm sau cho khách hàng:
      
      SẢN PHẨM 1: ${p1.name}
         - Giá: ${p1.price.toLocaleString()} VNĐ
         - CPU: ${p1.specs?.cpu || 'Không rõ'}, RAM: ${p1.specs?.ram || 'Không rõ'}
         - GPU: ${p1.specs?.gpu || 'Không rõ'}, Màn hình: ${p1.specs?.screen || 'Không rõ'}
      
      SẢN PHẨM 2: ${p2.name}
         - Giá: ${p2.price.toLocaleString()} VNĐ
         - CPU: ${p2.specs?.cpu || 'Không rõ'}, RAM: ${p2.specs?.ram || 'Không rõ'}
         - GPU: ${p2.specs?.gpu || 'Không rõ'}, Màn hình: ${p2.specs?.screen || 'Không rõ'}

      YÊU CẦU PHÂN TÍCH:
      1. So sánh hiệu năng (CPU/GPU) ai mạnh hơn?
      2. So sánh mức giá / hiệu năng (P/P) con nào hời hơn?
      3. KẾT LUẬN: Ai nên mua con nào? (Ví dụ: Game thủ hardcore nên chọn A, Sinh viên kinh tế chọn B).
      
      Trình bày: Ngắn gọn, gạch đầu dòng, dùng emoji.
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Không thể phân tích lúc này.";
  } catch (error) {
    console.error("Comparison Error:", error);
    return "Lỗi kết nối đến AI. Vui lòng thử lại sau.";
  }
};
