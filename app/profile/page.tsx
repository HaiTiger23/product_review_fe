"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, EyeOff, Loader2, Pencil, Save } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { updateReview } from "@/services/review-service"
import Image from "next/image"
import { useAuth } from "../provider/AuthContext"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getReviewByUser } from "@/services/review-service"
import { getImgSrc, handleErrorApi } from '../../lib/utils';
import { useRouter } from 'next/navigation'
import ReviewUpdateModal from "./review-update-modal"
import ReviewDeleteModal from "./review-delete-modal"
import { updateUserProfile } from "@/services/auth-service"
import { toast } from "sonner"
import { log } from "node:console"
import { addBookmark, getBookmarkByUser } from "@/services/product-service"

// Dữ liệu mẫu
// const user = {
//   name: "Nguyễn Văn A",
//   email: "nguyenvana@example.com",
//   avatar: "/placeholder.svg?height=100&width=100",
//   joinDate: "01/01/2023",
//   reviewCount: 12,
//   bookmarkCount: 24,
// }

interface ReviewByUserProps {
  id: number
  productId: number
  userId: number
  rating: number
  content: string
  helpfulCount: number
  createdAt: string
  updatedAt: string
  product: {
    reviewCount: string
    price: string
    image?: string
    name: string
    rating: string
    slug: string
  }
}
interface ProductByUserProps {
  id: number
  name: string
  slug: string
  image: string
  price: string
  category_id: number
  description: string
  created_at: string
  updated_at: string
  bookmark_date: string
}
interface Paginate {
  page: number
  limit: number
  total: number
  totalPages: number
}



export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const {user} = useAuth()
  const queryClient = useQueryClient()
  const [userData, setUserData] = useState({
    name: user?.name,
    email: user?.email,
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  })
  const [reviewUpdate, setReviewUpdate] = useState({
    id: 0,
    rating: 0,
    content: "",
  })
  const [showReviewDelete, setShowReviewDelete] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null)
  const [showReviewUpdate, setShowReviewUpdate] = useState(false)
  const [totalReview, setTotalReview] = useState(0)
  const [totalBookmark, setTotalBookmark] = useState(0)


  const router = useRouter()

  useEffect(() => {
   
    setUserData({
      name: user?.name,
      email: user?.email,
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
    })
  }, [user])

  const handleSave = async () => {
    setIsSaving(true)
   try {
    if (!userData.name || !userData.password || !userData.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }
    // Xử lý lưu thông tin người dùng
    let userUpdateData = {
      name: userData.name,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    }
    await updateUserProfile(userUpdateData)
    toast.success("Cập nhật thông tin thành công")
    setIsEditing(false)
   } catch (error) {
    console.log(error)
    handleErrorApi(error)
    setIsEditing(true)
   } finally {
    setIsSaving(false)
   }
  }
  const handleUpdateReviewModal = (review: ReviewByUserProps) => {
    setReviewUpdate({
      id: review.id,
      rating: review.rating,
      content: review.content,
    })
    setShowReviewUpdate(true)
  }

  const handleReviewUpdated = () => {
    setShowReviewUpdate(false)
    queryClient.invalidateQueries({ queryKey: ["reviews", user?.id] })
  }

  const handleDeleteReview = (reviewId: number) => {
    setReviewToDelete(reviewId)
    setShowReviewDelete(true)
  }

  const handleReviewDeleted = () => {
    setShowReviewDelete(false)
    queryClient.invalidateQueries({ queryKey: ["reviews", user?.id] })
  }
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    error: reviewsError
  } = useQuery<{data: {review: ReviewByUserProps[], pagination: Paginate}}>({
    queryKey: ["reviews", user?.id],
    queryFn: () => getReviewByUser(),
    staleTime: 1000 * 60
  });

  const {
    data: bookmarks,
    isLoading: isBookmarksLoading,
    error: bookmarksError
  } = useQuery<{products: ProductByUserProps[], pagination: {totalItems: number}}>({
    queryKey: ["bookmarks", user?.id],
    queryFn: () => getBookmarkByUser(),
    staleTime: 1000 * 60
  });

  useEffect(() => {
    if (reviewsError) {
      console.log(reviewsError)
      handleErrorApi(reviewsError)
    }
  }, [reviewsError])

  useEffect(() => {
    if (reviews) {
      console.log(reviews)
      setTotalReview(reviews?.data.pagination.total)
    }
  }, [reviews])
    
  useEffect(() => {
    if (bookmarks) {
      
      setTotalBookmark(bookmarks.pagination.totalItems)
    }
  }, [bookmarks])

  const handleDeleteBookmark = async (productId: number) => {
    try {
      await addBookmark(productId)
      toast.success("Đã xóa sản phẩm khỏi danh sách lưu")
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] })
    } catch (error) {
      console.log(error)
      handleErrorApi(error)
    }
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
                  <AvatarImage alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {/* {isEditing && (
                  <Button variant="outline" size="sm">
                    Thay đổi ảnh đại diện
                  </Button>
                )} */}
                <div className="text-center">
                  <h3 className="font-medium text-lg">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  {/* <p className="text-sm text-muted-foreground">Tham gia từ: {user?.joinDate}</p> */}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalReview}</p>
                  <p className="text-sm text-muted-foreground">Đánh giá</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalBookmark}</p>
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
                    <Label htmlFor="name">Username</Label>
                    <Input
                      id="name"
                      autoComplete="off"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="off"
                      readOnly
                      value={user?.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={userData.showPassword ? "text" : "password"}
                        autoComplete="off"
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setUserData({ ...userData, showPassword: !userData.showPassword })}
                      >
                        {userData.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={userData.showConfirmPassword ? "text" : "password"}
                        autoComplete="off"
                        onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setUserData({ ...userData, showConfirmPassword: !userData.showConfirmPassword })
                        }
                      >
                        {userData.showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving} className="flex-1">
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
                {isReviewsLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : reviews?.data?.reviews?.map((review: ReviewByUserProps) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Image
                          src={review.product.image  ? getImgSrc(review.product.image) : "/placeholder.svg"}
                          alt={review.product.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{review.product.name}</h3>
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
                          <p className="text-sm text-muted-foreground mb-2">Đánh giá ngày: {review.createdAt}</p>
                          <p>Nội dung: {review.content}</p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => handleUpdateReviewModal(review)}>
                              Chỉnh sửa
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteReview(review.id)}>
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
                {isBookmarksLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : bookmarks?.products?.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium line-clamp-1">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                              <p className="font-semibold text-primary">{product.price}</p>
                            </div>
                            <Button variant="ghost" onClick={() => handleDeleteBookmark(product.id)} size="sm" className="text-destructive h-8 w-8 p-0">
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
                            <Button variant="outline" onClick={() => router.push(`/products/${product.id}`)} size="sm" className="w-full">
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
          <ReviewUpdateModal
            review={reviewUpdate}
            isOpen={showReviewUpdate}
            onOpenChange={setShowReviewUpdate}
            onReviewUpdated={handleReviewUpdated}
          />
          <ReviewDeleteModal
            reviewId={reviewToDelete || 0}
            isOpen={showReviewDelete}
            onOpenChange={setShowReviewDelete}
            onReviewDeleted={handleReviewDeleted}
          />
        </div>
      </div>
    </div>
  )
}
