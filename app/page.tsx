import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Chào mừng đến với Hệ Thống Đánh Giá Sản Phẩm
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Chia sẻ và khám phá đánh giá về các sản phẩm tiêu dùng từ cộng đồng người dùng thực tế.
              </p>
            </div>
            <div className="space-x-4">
           
              <Button asChild variant="outline">
                <Link href="/products">
                  Xem danh sách sản phẩm <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
