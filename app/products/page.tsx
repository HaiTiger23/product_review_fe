"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllProducts } from "@/services/product-service"
import { useState,useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getImgSrc } from "@/lib/utils"

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  images?: string[];
}
// Dữ liệu mẫu
// const products = [
//   {
//     id: 1,
//     name: "Điện thoại thông minh Galaxy S23",
//     description: "Điện thoại thông minh cao cấp với camera 108MP và màn hình AMOLED 6.8 inch",
//     category: "Điện thoại",
//     rating: 4.7,
//     reviewCount: 128,
//     image: "/placeholder.svg?height=200&width=200",
//   },
//   {
//     id: 2,
//     name: "Laptop UltraBook Pro X1",
//     description: "Laptop mỏng nhẹ với CPU Intel i7 thế hệ 12, RAM 16GB và SSD 1TB",
//     category: "Máy tính",
//     rating: 4.5,
//     reviewCount: 86,
//     image: "/placeholder.svg?height=200&width=200",
//   },
//   {
//     id: 3,
//     name: "Tai nghe không dây SoundMax",
//     description: "Tai nghe bluetooth với chống ồn chủ động và thời lượng pin 30 giờ",
//     category: "Âm thanh",
//     rating: 4.3,
//     reviewCount: 215,
//     image: "/placeholder.svg?height=200&width=200",
//   },
//   {
//     id: 4,
//     name: "Máy ảnh mirrorless Alpha 7",
//     description: "Máy ảnh không gương lật với cảm biến full-frame 42MP và quay video 4K",
//     category: "Máy ảnh",
//     rating: 4.8,
//     reviewCount: 64,
//     image: "/placeholder.svg?height=200&width=200",
//   },
//   {
//     id: 5,
//     name: "Đồng hồ thông minh FitTrack Pro",
//     description: "Đồng hồ thông minh với theo dõi sức khỏe 24/7 và thời lượng pin 14 ngày",
//     category: "Đồng hồ",
//     rating: 4.2,
//     reviewCount: 173,
//     image: "/placeholder.svg?height=200&width=200",
//   },
//   {
//     id: 6,
//     name: "Máy lọc không khí PureAir",
//     description: "Máy lọc không khí với bộ lọc HEPA H13 và cảm biến chất lượng không khí",
//     category: "Gia dụng",
//     rating: 4.6,
//     reviewCount: 92,
//     image: "/placeholder.svg?height=200&width=200",
//   },
// ]

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const query = useQuery({ queryKey: ['products'], queryFn: () => getAllProducts({search: searchQuery}) })
  useEffect(() => {
    if (query.data) {
      setProducts(query.data.products)
    }
  }, [query.data])
  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ['products'] })
  }, [searchQuery])
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
   
   
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Tìm kiếm sản phẩm..." className="w-full pl-8" onChange={handleSearch} />
          </div>
          <Button asChild>
            <Link href="/products/add">
              <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
            </Link>
          </Button>
        </div>
      </div>
      {query.isLoading && <div>
        <Skeleton className="h-[200px] w-full" />
        
        </div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        { products && products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge>{product.category}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-center mb-4">
                  <Image
                    src={product.images ? getImgSrc(product.images[0]) : "/placeholder.svg"}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-contain h-[150px]"
                  />
                </div>
                <CardTitle className="text-xl mb-2 line-clamp-1">{product.name}</CardTitle>
                <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">{product.reviewCount} đánh giá</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
