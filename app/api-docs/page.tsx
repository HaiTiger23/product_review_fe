import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tài liệu API</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Giới thiệu</CardTitle>
            <CardDescription>Tài liệu API cho hệ thống đánh giá sản phẩm tiêu dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Tài liệu này mô tả các API endpoints cho hệ thống đánh giá sản phẩm tiêu dùng. API được thiết kế theo kiến
              trúc RESTful và sử dụng JSON làm định dạng dữ liệu chính.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Base URL:</strong> <code>{process.env.NEXT_PUBLIC_API_URL || "https://api.reviewhub.vn"}</code>
              </p>
              <p>
                <strong>Xác thực:</strong> Sử dụng JWT (JSON Web Token) trong header Authorization
              </p>
              <p>
                <strong>Định dạng dữ liệu:</strong> JSON
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Xác thực</CardTitle>
              <CardDescription>Các API liên quan đến đăng nhập, đăng ký và quản lý tài khoản</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>POST /auth/login</code> - Đăng nhập
                </li>
                <li>
                  <code>POST /auth/register</code> - Đăng ký
                </li>
                <li>
                  <code>POST /auth/logout</code> - Đăng xuất
                </li>
                <li>
                  <code>GET /auth/me</code> - Lấy thông tin người dùng hiện tại
                </li>
                <li>
                  <code>POST /auth/forgot-password</code> - Yêu cầu đặt lại mật khẩu
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm</CardTitle>
              <CardDescription>Các API liên quan đến quản lý sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>GET /products</code> - Lấy danh sách sản phẩm
                </li>
                <li>
                  <code>GET /products/:id</code> - Lấy chi tiết sản phẩm
                </li>
                <li>
                  <code>POST /products</code> - Thêm sản phẩm mới
                </li>
                <li>
                  <code>PUT /products/:id</code> - Cập nhật sản phẩm
                </li>
                <li>
                  <code>DELETE /products/:id</code> - Xóa sản phẩm
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đánh giá</CardTitle>
              <CardDescription>Các API liên quan đến quản lý đánh giá sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>GET /products/:productId/reviews</code> - Lấy danh sách đánh giá của sản phẩm
                </li>
                <li>
                  <code>POST /products/:productId/reviews</code> - Thêm đánh giá mới
                </li>
                <li>
                  <code>PUT /reviews/:id</code> - Cập nhật đánh giá
                </li>
                <li>
                  <code>DELETE /reviews/:id</code> - Xóa đánh giá
                </li>
                <li>
                  <code>POST /reviews/:id/helpful</code> - Đánh dấu đánh giá là hữu ích
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookmark</CardTitle>
              <CardDescription>Các API liên quan đến quản lý bookmark</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>GET /bookmarks</code> - Lấy danh sách sản phẩm đã đánh dấu
                </li>
                <li>
                  <code>POST /products/:productId/bookmark</code> - Thêm sản phẩm vào bookmark
                </li>
                <li>
                  <code>DELETE /products/:productId/bookmark</code> - Xóa sản phẩm khỏi bookmark
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tài liệu chi tiết</CardTitle>
            <CardDescription>Xem tài liệu API đầy đủ</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Để xem tài liệu API đầy đủ với các ví dụ và mô tả chi tiết, vui lòng tham khảo tệp Markdown trong thư mục
              docs:
            </p>
            <div className="bg-gray-100 p-4 rounded-md">
              <code>docs/api-documentation.md</code>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/products" className="text-primary hover:underline">
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
