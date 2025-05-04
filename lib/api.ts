/**
 * API Client cho hệ thống đánh giá sản phẩm
 *
 * Lưu ý: Đây là các hàm mẫu, không gọi API thực tế
 * Thay thế các hàm này bằng các lệnh gọi API thực khi phát triển backend
 */

// Cấu hình API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Tiện ích để xử lý lỗi API
const handleApiError = (error: any) => {
  console.error("API Error:", error)

  // Xử lý lỗi 401 (Unauthorized)
  if (error.status === 401) {
    // Đăng xuất người dùng nếu token hết hạn
    localStorage.removeItem("auth_token")
    window.location.href = "/login"
  }

  return {
    error: true,
    message: error.message || "Đã xảy ra lỗi khi kết nối đến máy chủ",
    status: error.status || 500,
  }
}

// Hàm tiện ích để gọi API
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Thêm token xác thực nếu có
    const token = localStorage.getItem("auth_token")
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Kiểm tra nếu response không thành công
    if (!response.ok) {
      throw {
        status: response.status,
        message: `API Error: ${response.status} ${response.statusText}`,
      }
    }

    // Parse JSON response
    const data = await response.json()
    return data
  } catch (error) {
    return handleApiError(error)
  }
}

// ===== API XÁC THỰC =====

/**
 * Đăng nhập người dùng
 */
export const loginUser = async (email: string, password: string) => {
  // Giả lập API đăng nhập
  console.log("Gọi API đăng nhập với:", { email, password })

  // Giả lập phản hồi thành công
  return {
    user: {
      id: "123",
      name: "Nguyễn Văn A",
      email: email,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    token: "sample_jwt_token_would_be_here",
  }
}

/**
 * Đăng ký người dùng mới
 */
export const registerUser = async (name: string, email: string, password: string) => {
  // Giả lập API đăng ký
  console.log("Gọi API đăng ký với:", { name, email, password })

  // Giả lập phản hồi thành công
  return {
    user: {
      id: "123",
      name: name,
      email: email,
      avatar: null,
    },
    token: "sample_jwt_token_would_be_here",
  }
}

/**
 * Đăng xuất người dùng
 */
export const logoutUser = async () => {
  // Giả lập API đăng xuất
  console.log("Gọi API đăng xuất")

  // Xóa token khỏi localStorage
  localStorage.removeItem("auth_token")

  return { success: true }
}

/**
 * Lấy thông tin người dùng hiện tại
 */
export const getCurrentUser = async () => {
  // Giả lập API lấy thông tin người dùng
  console.log("Gọi API lấy thông tin người dùng hiện tại")

  // Giả lập phản hồi thành công
  return {
    id: "123",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "01/01/2023",
    reviewCount: 12,
    bookmarkCount: 24,
  }
}

/**
 * Yêu cầu đặt lại mật khẩu
 */
export const requestPasswordReset = async (email: string) => {
  // Giả lập API yêu cầu đặt lại mật khẩu
  console.log("Gọi API yêu cầu đặt lại mật khẩu với:", { email })

  return { success: true, message: "Email đặt lại mật khẩu đã được gửi" }
}

// ===== API SẢN PHẨM =====

/**
 * Lấy danh sách sản phẩm
 */
export const getProducts = async (params: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
}) => {
  // Giả lập API lấy danh sách sản phẩm
  console.log("Gọi API lấy danh sách sản phẩm với:", params)

  // Giả lập phản hồi thành công
  return {
    products: [
      {
        id: 1,
        name: "Điện thoại thông minh Galaxy S23",
        description: "Điện thoại thông minh cao cấp với camera 108MP và màn hình AMOLED 6.8 inch",
        category: "Điện thoại",
        rating: 4.7,
        reviewCount: 128,
        price: "22.990.000 ₫",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 2,
        name: "Laptop UltraBook Pro X1",
        description: "Laptop mỏng nhẹ với CPU Intel i7 thế hệ 12, RAM 16GB và SSD 1TB",
        category: "Máy tính",
        rating: 4.5,
        reviewCount: 86,
        price: "32.490.000 ₫",
        image: "/placeholder.svg?height=200&width=200",
      },
      // Thêm các sản phẩm khác...
    ],
    pagination: {
      total: 100,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 10,
    },
  }
}

/**
 * Lấy chi tiết sản phẩm
 */
export const getProductById = async (id: string | number) => {
  // Giả lập API lấy chi tiết sản phẩm
  console.log("Gọi API lấy chi tiết sản phẩm với ID:", id)

  // Giả lập phản hồi thành công
  return {
    id: id,
    name: "Điện thoại thông minh Galaxy S23",
    description:
      "Điện thoại thông minh cao cấp với camera 108MP và màn hình AMOLED 6.8 inch. Sản phẩm được trang bị chip Snapdragon 8 Gen 2, RAM 12GB và bộ nhớ trong 256GB. Pin 5000mAh với sạc nhanh 45W và sạc không dây 15W. Hỗ trợ kháng nước và bụi chuẩn IP68.",
    category: "Điện thoại",
    rating: 4.7,
    reviewCount: 128,
    price: "22.990.000 ₫",
    specs: [
      "Màn hình: 6.8 inch, AMOLED, 120Hz",
      "CPU: Snapdragon 8 Gen 2",
      "RAM: 12GB",
      "Bộ nhớ: 256GB",
      "Camera: 108MP + 12MP + 10MP",
      "Pin: 5000mAh",
    ],
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    isBookmarked: false,
  }
}

/**
 * Thêm sản phẩm mới
 */
export const addProduct = async (productData: FormData) => {
  // Giả lập API thêm sản phẩm
  console.log("Gọi API thêm sản phẩm với dữ liệu:", productData)

  // Giả lập phản hồi thành công
  return {
    id: 999,
    name: productData.get("name"),
    message: "Sản phẩm đã được thêm thành công",
  }
}

/**
 * Cập nhật sản phẩm
 */
export const updateProduct = async (id: string | number, productData: FormData) => {
  // Giả lập API cập nhật sản phẩm
  console.log("Gọi API cập nhật sản phẩm với ID:", id, "và dữ liệu:", productData)

  // Giả lập phản hồi thành công
  return {
    id: id,
    name: productData.get("name"),
    message: "Sản phẩm đã được cập nhật thành công",
  }
}

/**
 * Xóa sản phẩm
 */
export const deleteProduct = async (id: string | number) => {
  // Giả lập API xóa sản phẩm
  console.log("Gọi API xóa sản phẩm với ID:", id)

  // Giả lập phản hồi thành công
  return {
    success: true,
    message: "Sản phẩm đã được xóa thành công",
  }
}

// ===== API ĐÁNH GIÁ =====

/**
 * Lấy danh sách đánh giá của sản phẩm
 */
export const getProductReviews = async (
  productId: string | number,
  params: {
    page?: number
    limit?: number
    sort?: string
  },
) => {
  // Giả lập API lấy danh sách đánh giá
  console.log("Gọi API lấy danh sách đánh giá của sản phẩm với ID:", productId, "và tham số:", params)

  // Giả lập phản hồi thành công
  return {
    reviews: [
      {
        id: 1,
        user: {
          id: 101,
          name: "Nguyễn Văn A",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        rating: 5,
        date: "15/04/2023",
        content:
          "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu. Màn hình hiển thị sắc nét, độ sáng cao. Rất hài lòng với sản phẩm này!",
        helpfulCount: 24,
        isHelpful: false,
      },
      {
        id: 2,
        user: {
          id: 102,
          name: "Trần Thị B",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        rating: 4,
        date: "02/05/2023",
        content:
          "Điện thoại chạy rất mượt, thiết kế đẹp. Tuy nhiên pin hơi nóng khi chơi game nặng. Camera chụp đêm rất tốt.",
        helpfulCount: 18,
        isHelpful: true,
      },
      // Thêm các đánh giá khác...
    ],
    pagination: {
      total: 128,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 13,
    },
  }
}

/**
 * Thêm đánh giá mới
 */
export const addReview = async (
  productId: string | number,
  reviewData: {
    rating: number
    content: string
  },
) => {
  // Giả lập API thêm đánh giá
  console.log("Gọi API thêm đánh giá cho sản phẩm với ID:", productId, "và dữ liệu:", reviewData)

  // Giả lập phản hồi thành công
  return {
    id: 999,
    rating: reviewData.rating,
    content: reviewData.content,
    date: new Date().toLocaleDateString("vi-VN"),
    message: "Đánh giá của bạn đã được gửi thành công",
  }
}

/**
 * Cập nhật đánh giá
 */
export const updateReview = async (
  reviewId: string | number,
  reviewData: {
    rating?: number
    content?: string
  },
) => {
  // Giả lập API cập nhật đánh giá
  console.log("Gọi API cập nhật đánh giá với ID:", reviewId, "và dữ liệu:", reviewData)

  // Giả lập phản hồi thành công
  return {
    id: reviewId,
    message: "Đánh giá đã được cập nhật thành công",
  }
}

/**
 * Xóa đánh giá
 */
export const deleteReview = async (reviewId: string | number) => {
  // Giả lập API xóa đánh giá
  console.log("Gọi API xóa đánh giá với ID:", reviewId)

  // Giả lập phản hồi thành công
  return {
    success: true,
    message: "Đánh giá đã được xóa thành công",
  }
}

/**
 * Đánh dấu đánh giá là hữu ích
 */
export const markReviewHelpful = async (reviewId: string | number, isHelpful: boolean) => {
  // Giả lập API đánh dấu đánh giá là hữu ích
  console.log("Gọi API đánh dấu đánh giá với ID:", reviewId, "là hữu ích:", isHelpful)

  // Giả lập phản hồi thành công
  return {
    id: reviewId,
    helpfulCount: 25, // Số lượng đánh giá hữu ích mới
    isHelpful: isHelpful,
  }
}

// ===== API BOOKMARK =====

/**
 * Lấy danh sách sản phẩm đã đánh dấu
 */
export const getBookmarks = async (params: {
  page?: number
  limit?: number
}) => {
  // Giả lập API lấy danh sách bookmark
  console.log("Gọi API lấy danh sách bookmark với tham số:", params)

  // Giả lập phản hồi thành công
  return {
    bookmarks: [
      {
        id: 1,
        product: {
          id: 1,
          name: "Điện thoại thông minh Galaxy S23",
          image: "/placeholder.svg?height=80&width=80",
          category: "Điện thoại",
          price: "22.990.000 ₫",
        },
      },
      {
        id: 2,
        product: {
          id: 2,
          name: "Laptop UltraBook Pro X1",
          image: "/placeholder.svg?height=80&width=80",
          category: "Máy tính",
          price: "32.490.000 ₫",
        },
      },
      // Thêm các bookmark khác...
    ],
    pagination: {
      total: 24,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 3,
    },
  }
}

/**
 * Thêm sản phẩm vào bookmark
 */
export const addBookmark = async (productId: string | number) => {
  // Giả lập API thêm bookmark
  console.log("Gọi API thêm bookmark cho sản phẩm với ID:", productId)

  // Giả lập phản hồi thành công
  return {
    id: 999,
    productId: productId,
    message: "Sản phẩm đã được thêm vào danh sách đã lưu",
  }
}

/**
 * Xóa sản phẩm khỏi bookmark
 */
export const removeBookmark = async (productId: string | number) => {
  // Giả lập API xóa bookmark
  console.log("Gọi API xóa bookmark cho sản phẩm với ID:", productId)

  // Giả lập phản hồi thành công
  return {
    success: true,
    message: "Sản phẩm đã được xóa khỏi danh sách đã lưu",
  }
}

// ===== API NGƯỜI DÙNG =====

/**
 * Lấy thông tin người dùng
 */
export const getUserProfile = async (userId: string | number) => {
  // Giả lập API lấy thông tin người dùng
  console.log("Gọi API lấy thông tin người dùng với ID:", userId)

  // Giả lập phản hồi thành công
  return {
    id: userId,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "01/01/2023",
    reviewCount: 12,
    bookmarkCount: 24,
  }
}

/**
 * Cập nhật thông tin người dùng
 */
export const updateUserProfile = async (userData: {
  name?: string
  email?: string
  avatar?: File
}) => {
  // Giả lập API cập nhật thông tin người dùng
  console.log("Gọi API cập nhật thông tin người dùng với dữ liệu:", userData)

  // Giả lập phản hồi thành công
  return {
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar ? URL.createObjectURL(userData.avatar) : "/placeholder.svg?height=100&width=100",
    message: "Thông tin người dùng đã được cập nhật thành công",
  }
}

/**
 * Lấy danh sách đánh giá của người dùng
 */
export const getUserReviews = async (params: {
  page?: number
  limit?: number
}) => {
  // Giả lập API lấy danh sách đánh giá của người dùng
  console.log("Gọi API lấy danh sách đánh giá của người dùng với tham số:", params)

  // Giả lập phản hồi thành công
  return {
    reviews: [
      {
        id: 1,
        productId: 1,
        productName: "Điện thoại thông minh Galaxy S23",
        productImage: "/placeholder.svg?height=80&width=80",
        rating: 5,
        date: "15/04/2023",
        content: "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu.",
      },
      {
        id: 2,
        productId: 2,
        productName: "Laptop UltraBook Pro X1",
        productImage: "/placeholder.svg?height=80&width=80",
        rating: 4,
        date: "02/05/2023",
        content: "Máy chạy rất mượt, thiết kế đẹp. Tuy nhiên pin hơi nóng khi chơi game nặng.",
      },
      // Thêm các đánh giá khác...
    ],
    pagination: {
      total: 12,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 2,
    },
  }
}

/**
 * Thay đổi mật khẩu
 */
export const changePassword = async (passwordData: {
  currentPassword: string
  newPassword: string
}) => {
  // Giả lập API thay đổi mật khẩu
  console.log("Gọi API thay đổi mật khẩu với dữ liệu:", passwordData)

  // Giả lập phản hồi thành công
  return {
    success: true,
    message: "Mật khẩu đã được thay đổi thành công",
  }
}
