# Tài liệu API - Hệ thống đánh giá sản phẩm

## Giới thiệu

Tài liệu này mô tả các API endpoints cho hệ thống đánh giá sản phẩm tiêu dùng. API được thiết kế theo kiến trúc RESTful và sử dụng JSON làm định dạng dữ liệu chính.

## Cấu trúc cơ bản

- **Base URL**: `https://api.reviewhub.vn` (hoặc URL được cấu hình trong biến môi trường NEXT_PUBLIC_API_URL)
- **Xác thực**: Sử dụng JWT (JSON Web Token) trong header Authorization
- **Định dạng dữ liệu**: JSON

## Xác thực

Tất cả các API yêu cầu xác thực đều cần có token JWT trong header Authorization:

\`\`\`
Authorization: Bearer <token>
\`\`\`

### Đăng nhập

- **URL**: `/auth/login`
- **Method**: `POST`
- **Yêu cầu xác thực**: Không
- **Body**:
  \`\`\`json
  {
    "email": "example@email.com",
    "password": "password123"
  }
  \`\`\`
- **Phản hồi thành công**:
  \`\`\`json
  {
    "user": {
      "id": "123",
      "name": "Nguyễn Văn A",
      "email": "example@email.com",
      "avatar": "/images/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `401 Unauthorized`: Email hoặc mật khẩu không đúng

### Đăng ký

- **URL**: `/auth/register`
- **Method**: `POST`
- **Yêu cầu xác thực**: Không
- **Body**:
  \`\`\`json
  {
    "name": "Nguyễn Văn A",
    "email": "example@email.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  \`\`\`
- **Phản hồi thành công**:
  \`\`\`json
  {
    "user": {
      "id": "123",
      "name": "Nguyễn Văn A",
      "email": "example@email.com",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ hoặc mật khẩu không khớp
  - `409 Conflict`: Email đã tồn tại

### Đăng xuất

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Phản hồi thành công**:
  \`\`\`json
  {
    "success": true
  }
  \`\`\`

### Lấy thông tin người dùng hiện tại

- **URL**: `/auth/me`
- **Method**: `GET`
- **Yêu cầu xác thực**: Có
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": "123",
    "name": "Nguyễn Văn A",
    "email": "example@email.com",
    "avatar": "/images/avatar.jpg",
    "joinDate": "01/01/2023",
    "reviewCount": 12,
    "bookmarkCount": 24
  }
  \`\`\`
- **Mã lỗi**:
  - `401 Unauthorized`: Token không hợp lệ hoặc hết hạn

### Yêu cầu đặt lại mật khẩu

- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Yêu cầu xác thực**: Không
- **Body**:
  \`\`\`json
  {
    "email": "example@email.com"
  }
  \`\`\`
- **Phản hồi thành công**:
  \`\`\`json
  {
    "success": true,
    "message": "Email đặt lại mật khẩu đã được gửi"
  }
  \`\`\`

## Sản phẩm

### Lấy danh sách sản phẩm

- **URL**: `/products`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng sản phẩm trên mỗi trang (mặc định: 10)
  - `category`: Lọc theo danh mục
  - `search`: Tìm kiếm theo từ khóa
  - `sort`: Sắp xếp (ví dụ: "price_asc", "price_desc", "rating_desc")
- **Phản hồi thành công**:
  \`\`\`json
  {
    "products": [
      {
        "id": 1,
        "name": "Điện thoại thông minh Galaxy S23",
        "description": "Điện thoại thông minh cao cấp với camera 108MP...",
        "category": "Điện thoại",
        "rating": 4.7,
        "reviewCount": 128,
        "price": "22.990.000 ₫",
        "image": "/images/products/galaxy-s23.jpg"
      },
      // ...
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
  \`\`\`

### Lấy chi tiết sản phẩm

- **URL**: `/products/:id`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không (Nếu đã xác thực, sẽ trả về thông tin isBookmarked)
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": 1,
    "name": "Điện thoại thông minh Galaxy S23",
    "description": "Điện thoại thông minh cao cấp với camera 108MP...",
    "category": "Điện thoại",
    "rating": 4.7,
    "reviewCount": 128,
    "price": "22.990.000 ₫",
    "specs": [
      "Màn hình: 6.8 inch, AMOLED, 120Hz",
      "CPU: Snapdragon 8 Gen 2",
      "RAM: 12GB",
      "Bộ nhớ: 256GB",
      "Camera: 108MP + 12MP + 10MP",
      "Pin: 5000mAh"
    ],
    "images": [
      "/images/products/galaxy-s23-1.jpg",
      "/images/products/galaxy-s23-2.jpg",
      "/images/products/galaxy-s23-3.jpg",
      "/images/products/galaxy-s23-4.jpg"
    ],
    "isBookmarked": false
  }
  \`\`\`
- **Mã lỗi**:
  - `404 Not Found`: Sản phẩm không tồn tại

### Thêm sản phẩm mới

- **URL**: `/products`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name`: Tên sản phẩm
  - `category`: Danh mục
  - `price`: Giá sản phẩm
  - `description`: Mô tả sản phẩm
  - `specifications`: JSON string của mảng thông số kỹ thuật
  - `image_0`, `image_1`, ...: Các file hình ảnh
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": 999,
    "name": "Tên sản phẩm",
    "message": "Sản phẩm đã được thêm thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `401 Unauthorized`: Không có quyền thêm sản phẩm

### Cập nhật sản phẩm

- **URL**: `/products/:id`
- **Method**: `PUT`
- **Yêu cầu xác thực**: Có
- **Content-Type**: `multipart/form-data`
- **Body**: (Tương tự như thêm sản phẩm)
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": 1,
    "name": "Tên sản phẩm đã cập nhật",
    "message": "Sản phẩm đã được cập nhật thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `401 Unauthorized`: Không có quyền cập nhật sản phẩm
  - `404 Not Found`: Sản phẩm không tồn tại

### Xóa sản phẩm

- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Yêu cầu xác thực**: Có
- **Phản hồi thành công**:
  \`\`\`json
  {
    "success": true,
    "message": "Sản phẩm đã được xóa thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `401 Unauthorized`: Không có quyền xóa sản phẩm
  - `404 Not Found`: Sản phẩm không tồn tại

## Đánh giá

### Lấy danh sách đánh giá của sản phẩm

- **URL**: `/products/:productId/reviews`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không (Nếu đã xác thực, sẽ trả về thông tin isHelpful)
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng đánh giá trên mỗi trang (mặc định: 10)
  - `sort`: Sắp xếp (ví dụ: "date_desc", "rating_desc", "helpful_desc")
- **Phản hồi thành công**:
  \`\`\`json
  {
    "reviews": [
      {
        "id": 1,
        "user": {
          "id": 101,
          "name": "Nguyễn Văn A",
          "avatar": "/images/avatars/user-101.jpg"
        },
        "rating": 5,
        "date": "15/04/2023",
        "content": "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu...",
        "helpfulCount": 24,
        "isHelpful": false
      },
      // ...
    ],
    "pagination": {
      "total": 128,
      "page": 1,
      "limit": 10,
      "totalPages": 13
    }
  }
  \`\`\`

### Thêm đánh giá mới

- **URL**: `/products/:productId/reviews`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Body**:
  \`\`\`json
  {
    "rating": 5,
    "content": "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu..."
  }
  \`\`\`
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": 999,
    "rating": 5,
    "content": "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu...",
    "date": "01/06/2023",
    "message": "Đánh giá của bạn đã được gửi thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `401 Unauthorized`: Chưa đăng nhập
  - `404 Not Found`: Sản phẩm không tồn tại
  - `409 Conflict`: Người dùng đã đánh giá sản phẩm này

### Cập nhật đánh giá

- **URL**: `/reviews/:id`

- **Method**: `PUT`
- **Yêu cầu xác thực**: Có
- **Body**:
  \`\`\`json
  {
    "rating": 4,
    "content": "Nội dung đánh giá đã cập nhật..."
  }
  \`\`\`
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": 1,
    "message": "Đánh giá đã được cập nhật thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `401 Unauthorized`: Không có quyền cập nhật đánh giá này
  - `404 Not Found`: Đánh giá không tồn tại

### Xóa đánh giá

- **URL**: `/reviews/:id`
- **Method**: `DELETE`
- **Yêu cầu xác thực**: Có
- **Phản hồi thành công**:
  \`\`\`json
  {
    "success": true,
    "message": "Đánh giá đã được xóa thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `401 Unauthorized`: Không có quyền xóa đánh giá này
  - `404 Not Found`: Đánh giá không tồn tại

### Đánh dấu đánh giá là hữu ích

- **URL**: `/reviews/:id/helpful`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Body**:
  \`\`\`json
  {
    "isHelpful": true
  }
  \`\`\`
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": 1,
    "helpfulCount": 25,
    "isHelpful": true
  }
  \`\`\`
- **Mã lỗi**:
  - `401 Unauthorized`: Chưa đăng nhập
  - `404 Not Found`: Đánh giá không tồn tại

## Bookmark

### Lấy danh sách sản phẩm đã đánh dấu

- **URL**: `/bookmarks`
- **Method**: `GET`
- **Yêu cầu xác thực**: Có
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng bookmark trên mỗi trang (mặc định: 10)
- **Phản hồi thành công**:
  \`\`\`json
  {
    "bookmarks": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Điện thoại thông minh Galaxy S23",
          "image": "/images/products/galaxy-s23.jpg",
          "category": "Điện thoại",
          "price": "22.990.000 ₫"
        }
      },
      // ...
    ],
    "pagination": {
      "total": 24,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
  \`\`\`

### Thêm sản phẩm vào bookmark

- **URL**: `/products/bookmark/:productId`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": 999,
    "productId": 1,
    "message": "Sản phẩm đã được thêm vào danh sách đã lưu"
  }
  \`\`\`
- **Mã lỗi**:
  - `401 Unauthorized`: Chưa đăng nhập
  - `404 Not Found`: Sản phẩm không tồn tại
  - `409 Conflict`: Sản phẩm đã được đánh dấu

### Xóa sản phẩm khỏi bookmark

- **URL**: `/products/:productId/bookmark`
- **Method**: `DELETE`
- **Yêu cầu xác thực**: Có
- **Phản hồi thành công**:
  \`\`\`json
  {
    "success": true,
    "message": "Sản phẩm đã được xóa khỏi danh sách đã lưu"
  }
  \`\`\`
- **Mã lỗi**:
  - `401 Unauthorized`: Chưa đăng nhập
  - `404 Not Found`: Bookmark không tồn tại

## Người dùng

### Lấy thông tin người dùng

- **URL**: `/users/:id`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không
- **Phản hồi thành công**:
  \`\`\`json
  {
    "id": "123",
    "name": "Nguyễn Văn A",
    "avatar": "/images/avatars/user-123.jpg",
    "joinDate": "01/01/2023",
    "reviewCount": 12
  }
  \`\`\`
- **Mã lỗi**:
  - `404 Not Found`: Người dùng không tồn tại

### Cập nhật thông tin người dùng

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Yêu cầu xác thực**: Có
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name`: Tên người dùng
  - `email`: Email
  - `avatar`: File hình ảnh đại diện
- **Phản hồi thành công**:
  \`\`\`json
  {
    "name": "Nguyễn Văn A",
    "email": "example@email.com",
    "avatar": "/images/avatars/user-123.jpg",
    "message": "Thông tin người dùng đã được cập nhật thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `401 Unauthorized`: Chưa đăng nhập

### Lấy danh sách đánh giá của người dùng

- **URL**: `/users/reviews`
- **Method**: `GET`
- **Yêu cầu xác thực**: Có
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng đánh giá trên mỗi trang (mặc định: 10)
- **Phản hồi thành công**:
  \`\`\`json
  {
    "reviews": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Điện thoại thông minh Galaxy S23",
        "productImage": "/images/products/galaxy-s23.jpg",
        "rating": 5,
        "date": "15/04/2023",
        "content": "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu..."
      },
      // ...
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
  \`\`\`

### Thay đổi mật khẩu

- **URL**: `/users/change-password`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Body**:
  \`\`\`json
  {
    "currentPassword": "password123",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
  }
  \`\`\`
- **Phản hồi thành công**:
  \`\`\`json
  {
    "success": true,
    "message": "Mật khẩu đã được thay đổi thành công"
  }
  \`\`\`
- **Mã lỗi**:
  - `400 Bad Request`: Dữ liệu không hợp lệ hoặc mật khẩu không khớp
  - `401 Unauthorized`: Mật khẩu hiện tại không đúng

## Danh mục

### Lấy danh sách danh mục

- **URL**: `/categories`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không
- **Phản hồi thành công**:
  \`\`\`json
  {
    "categories": [
      {
        "id": "dien-thoai",
        "name": "Điện thoại",
        "count": 42
      },
      {
        "id": "laptop",
        "name": "Laptop",
        "count": 35
      },
      // ...
    ]
  }
  \`\`\`

## Mã lỗi chung

- `400 Bad Request`: Yêu cầu không hợp lệ
- `401 Unauthorized`: Không có quyền truy cập
- `403 Forbidden`: Bị cấm truy cập
- `404 Not Found`: Không tìm thấy tài nguyên
- `409 Conflict`: Xung đột dữ liệu
- `422 Unprocessable Entity`: Dữ liệu không thể xử lý
- `429 Too Many Requests`: Quá nhiều yêu cầu
- `500 Internal Server Error`: Lỗi máy chủ

## Phân trang

Các API trả về danh sách đều hỗ trợ phân trang với cấu trúc phản hồi như sau:

\`\`\`json
{
  "items": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
\`\`\`

## Ví dụ sử dụng API

### Đăng nhập và lấy thông tin người dùng

\`\`\`javascript
// Đăng nhập
const loginResponse = await fetch('https://api.reviewhub.vn/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'example@email.com',
    password: 'password123'
  })
});

const { token, user } = await loginResponse.json();

// Lưu token
localStorage.setItem('auth_token', token);

// Lấy thông tin người dùng
const userResponse = await fetch('https://api.reviewhub.vn/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const userData = await userResponse.json();
\`\`\`

### Lấy danh sách sản phẩm và chi tiết sản phẩm

\`\`\`javascript
// Lấy danh sách sản phẩm
const productsResponse = await fetch('https://api.reviewhub.vn/products?page=1&limit=10&category=dien-thoai');
const productsData = await productsResponse.json();

// Lấy chi tiết sản phẩm
const productId = productsData.products[0].id;
const productResponse = await fetch(`https://api.reviewhub.vn/products/${productId}`);
const productData = await productResponse.json();
\`\`\`

### Thêm đánh giá mới

\`\`\`javascript
const token = localStorage.getItem('auth_token');
const productId = 1;

const reviewResponse = await fetch(`https://api.reviewhub.vn/products/${productId}/reviews`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    rating: 5,
    content: 'Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu...'
  })
});

const reviewData = await reviewResponse.json();
