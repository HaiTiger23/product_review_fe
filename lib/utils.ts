import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { BASE_URL } from "@/services/base-service";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function handleErrorApi(error: any) {
  const desc = error?.response?.data?.message || error?.response?.data?.error;
  switch (error?.status) {
    case 401:
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { description: desc });
      break;
    case 400:
      toast.error("Yêu cầu không hợp lệ.", { description: desc });
      break;
    case 404:
      toast.error("Không tìm thấy tài nguyên.", { description: desc });
      break;
    case 409:
      toast.error("Xung đột dữ liệu.", { description: desc });
      break;
    case 422:
      toast.error("Dữ liệu không hợp lệ hoặc không thể xử lý.", { description: desc });
      break;
    case 429:
      toast.error("Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau.", { description: desc });
      break;
    case 403:
      toast.error("Bạn không có quyền truy cập.", { description: desc });
      break;
    case 500:
      toast.error("Lỗi máy chủ. Vui lòng thử lại sau.", { description: desc });
      break;
    default:
      toast.error("Đã xảy ra lỗi không xác định.", { description: desc });
      break;
  }
}

export const getImgSrc = (url: string) => {
return BASE_URL + url
}    