"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Save } from "lucide-react"
import Image from "next/image"

// Dữ liệu mẫu
const user = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  joinDate: "01/01/2023",
  reviewCount: 12,
  bookmarkCount: 24,
}

const reviews = [
  {
    id: 1,
    productName: "Điện thoại thông minh Galaxy S23",
    productImage: "/placeholder.svg?height=80&width=80",
    rating: 5,
    date: "15/04/2023",
    content: "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu.",
  },
  {
    id: 2,
    productName: "Laptop UltraBook Pro X1",
    productImage: "/placeholder.svg?height=80&width=80",
    rating: 4,
    date: "02/05/2023",
    content: "Máy chạy rất mượt, thiết kế đẹp. Tuy nhiên pin hơi nóng khi chơi game nặng.",
  },
  {
    id: 3,
    productName: "Tai nghe không dây SoundMax",
    productImage: "/placeholder.svg?height=80&width=80",
    rating: 5,
    date: "20/05/2023",
    content: "Âm thanh tuyệt vời, chống ồn hiệu quả. Pin dùng được cả tuần.",
  },
]

const bookmarks = [
  {
    id: 1,
    name: "Điện thoại thông minh Galaxy S23",
    image: "/placeholder.svg?height=80&width=80",
    category: "Điện thoại",
    price: "22.990.000 ₫",
  },
  {
    id: 2,
    name: "Laptop UltraBook Pro X1",
    image: "/placeholder.svg?height=80&width=80",
    category: "Máy tính",
    price: "32.490.000 ₫",
  },
  {
    id: 3,
    name: "Máy ảnh mirrorless Alpha 7",
    image: "/placeholder.svg?height=80&width=80",
    category: "Máy ảnh",
    price: "42.990.000 ₫",
  },
  {
    id: 4,
    name: "Đồng hồ thông minh FitTrack Pro",
    image: "/placeholder.svg?height=80&width=80",
    category: "Đồng hồ",
    price: "4.990.000 ₫",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(user)

  const handleSave = () => {
    setIsEditing(false)
    // Xử lý lưu thông tin người dùng
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Thay đổi ảnh đại diện
                  </Button>
                )}
                <div className="text-center">
                  <h3 className="font-medium text-lg">{userData.name}</h3>
                  <p className="text-muted-foreground">{userData.email}</p>
                  <p className="text-sm text-muted-foreground">Tham gia từ: {userData.joinDate}</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{userData.reviewCount}</p>
                  <p className="text-sm text-muted-foreground">Đánh giá</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userData.bookmarkCount}</p>
                  <p className="text-sm text-muted-foreground">Đã lưu</p>
                </div>
              </div>

              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="reviews">
            <TabsList className="w-full">
              <TabsTrigger value="reviews" className="flex-1">
                Đánh giá của tôi
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex-1">
                Sản phẩm đã lưu
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Image
                          src={review.productImage || "/placeholder.svg"}
                          alt={review.productName}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{review.productName}</h3>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Đánh giá ngày: {review.date}</p>
                          <p>{review.content}</p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              Chỉnh sửa
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="bookmarks" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((bookmark) => (
                  <Card key={bookmark.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Image
                          src={bookmark.image || "/placeholder.svg"}
                          alt={bookmark.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium line-clamp-1">{bookmark.name}</h3>
                              <p className="text-sm text-muted-foreground">{bookmark.category}</p>
                              <p className="font-semibold text-primary">{bookmark.price}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Button variant="outline" size="sm" className="w-full">
                              Xem sản phẩm
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
