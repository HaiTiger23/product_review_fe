import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background flex justify-center">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ReviewHub</h3>
            <p className="text-sm text-muted-foreground">Nền tảng đánh giá sản phẩm tiêu dùng hàng đầu Việt Nam.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-muted-foreground hover:text-foreground">
                  Tài liệu API
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Pháp lý</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Chính sách cookie
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Email: contact@reviewhub.vn</li>
              <li className="text-muted-foreground">Điện thoại: (84) 123 456 789</li>
              <li className="text-muted-foreground">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2023 ReviewHub. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
