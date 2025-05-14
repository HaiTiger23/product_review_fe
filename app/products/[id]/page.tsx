"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Star, ThumbsUp, MessageSquare, Loader2 } from "lucide-react"
import Image from "next/image"
import ReviewForm from "@/components/review-form"

import { addBookmark, getProductById } from "@/services/product-service"
import React from "react"
import { Product } from "../page"
import { getImgSrc } from "@/lib/utils"
import { getProductReviews, markReviewHelpful } from "@/services/review-service"
import { useAuth } from "@/app/provider/AuthContext"
import { toast } from "sonner"

// Kiểu dữ liệu cho response từ API
interface ProductDetailResponse {
  product: ProductDetail;
}

interface ReviewsResponse {
  data: {
    reviews: any[];
    pagination: {
      totalPages: number;
    }
  }
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  price: string;
  reviewCount: number;
  images?: string[];
  isReviewed: boolean;
  isBookmarked: boolean;
  specs?: string[];
}
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  // Doraemon thêm state cho modal full màn hình ảnh nè!
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageSrc, setFullImageSrc] = useState("");

  const {user} = useAuth()

  // --- Dùng useQuery để lấy dữ liệu sản phẩm ---
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError
  } = useQuery<ProductDetailResponse>({
    queryKey: ["product", resolvedParams.id],
    queryFn: () => getProductById(resolvedParams.id),
    staleTime: 1000 * 60
  });

  // Xử lý dữ liệu product khi có kết quả
  useEffect(() => {
    if (productData?.product) {
      setProduct(productData.product as ProductDetail);
      setSelectedImage(productData.product.images?.[0] || null);
    }
  }, [productData]);

  // --- Dùng useQuery để lấy reviews ---
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: reviewsError
  } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", resolvedParams.id, currentPage],
    queryFn: () => getProductReviews(resolvedParams.id, { page: currentPage, limit: 3, sort: "helpful_desc" }),
    staleTime: 1000 * 60,
    enabled: !!productData
  });

  // Xử lý dữ liệu reviews khi có kết quả
  useEffect(() => {
    if (reviewsData?.data) {
      setReviews(reviewsData.data.reviews);
      setTotalPages(reviewsData.data.pagination.totalPages);
    }
  }, [reviewsData]);

  // --- Loading tổng hợp ---
  const isLoading = isProductLoading || isReviewsLoading;

  const handleLoadMoreReviews = async () => {
    if (currentPage >= totalPages) return

    setIsLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const reviewsData = await getProductReviews(resolvedParams.id, { page: nextPage, limit: 3 })
      setReviews([...reviews, ...reviewsData.data.reviews])
      setCurrentPage(nextPage)
    } catch (error) {
      console.error("Lỗi khi tải thêm đánh giá:", error)
      toast.error("Lỗi khi tải thêm đánh giá")
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleAddBookmark = async () => {
    try {
      await addBookmark(resolvedParams.id)
      toast.success("Đã thêm sản phẩm vào danh sách đã lưu")
      setIsBookmarked(true)
    } catch (error: any) {
      console.log(error)
      if(error.response?.data?.error) {
        toast.error(error.response.data.error)
        return;
      }
      console.error("Lỗi khi lưu sản phẩm:", error)
      toast.error("Lỗi khi lưu sản phẩm")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Không tìm thấy sản phẩm.</p>
      </div>
    )
  }

  const handleMarkReviewHelpful = async (reviewId: string | number, helpful: boolean) => {
    try {
      const review = reviews.find((review) => review.id === reviewId)
      if(review?.isHelpful) {
        toast.warning("Bạn đã đánh dấu đánh giá này là hữu ích");
        return;
      }
      const response =await markReviewHelpful(reviewId, helpful)
      if(response.data?.error) {
        toast.error("Lỗi: "+response.data.error)
        return;
      }
      const updatedReviews = reviews.map((review) =>
        review.id === reviewId ? { ...review, helpfulCount: review.helpfulCount + (helpful ? 1 : -1), isHelpful: true } : review
      )
      setReviews(updatedReviews)
      
      toast.success("Đánh giá hữu ích thành công");
    } catch (error) {
      console.error("Lỗi khi đánh dấu đánh giá hữu ích:", error)
      toast.error("Đánh dấu đánh giá hữu ích thất bại");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-center mb-6">
              <Image
                src={selectedImage ? getImgSrc(selectedImage) : getImgSrc(product.images?.[0] || "")}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain cursor-pointer"
                onClick={() => {
                  const imgSrc = selectedImage ? getImgSrc(selectedImage) : getImgSrc(product.images?.[0] || "");
                  setFullImageSrc(imgSrc);
                  setShowFullImage(true);
                }}
              />

      {/* Doraemon modal full màn hình ảnh nè! */}
      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={fullImageSrc}
            alt="Full"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            onClick={() => setShowFullImage(false)}
          >
            &times;
          </button>
        </div>
      )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((image, i) => (
                <div key={i} className="border rounded-md p-2 cursor-pointer hover:border-primary">
                  <Image
                    src={getImgSrc(image)}
                    onClick={() => {
                      setSelectedImage(image)
                    }}
                    alt={`${product.name} - Ảnh ${i}`}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge>{product.category}</Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 mr-2">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewCount} đánh giá)</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mb-4">{product.price}</p>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Thông số kỹ thuật:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {product.specs && product.specs.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 mb-6">
              {/* <Button className="flex-1">Mua ngay</Button> */}
              
                {isBookmarked || productData?.product.isBookmarked ? (
                  <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAddBookmark()}
                >
                  <Bookmark className="mr-2 h-4 w-4 text-blue-500 fill-blue-500" /> Đã lưu
                </Button>
                ) : (
                  <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAddBookmark()}
                >
                  <Bookmark className="mr-2 h-4 w-4" /> Lưu sản phẩm
                </Button>
                )}
            </div>
          </div>

          <Tabs defaultValue="reviews">
            <TabsList className="w-full">
              <TabsTrigger value="reviews" className="flex-1">
                Đánh giá ({product.reviewCount})
              </TabsTrigger>
              {user && !productData?.product.isReviewed && (
                <TabsTrigger value="write-review" className="flex-1">
                  Viết đánh giá
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={review.user.avatar || "/placeholder.svg"}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <CardTitle className="text-base">{review.user.name}</CardTitle>
                            <CardDescription>{review.date}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p>{review.content}</p>
                    </CardContent>
                    <CardContent className="pt-0 flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={async () => {
                          try {
                            await handleMarkReviewHelpful(review.id, true);
                          } catch (error) {
                            console.error("Lỗi khi đánh dấu đánh giá:", error)
                          }
                        }}
                      >
                        {review.isHelpful ? (
                          <ThumbsUp className="mr-1 h-4 w-4 fill-blue-500 text-blue-500" />
                        ) : (
                          <ThumbsUp className="mr-1 h-4 w-4" />
                        )}
                        Hữu ích ({review.helpfulCount})
                      </Button>
                      {user?.id !== review.user.id && (
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MessageSquare className="mr-1 h-4 w-4" /> Bình luận
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {currentPage < totalPages && (
                  <Button variant="outline" className="w-full" onClick={handleLoadMoreReviews} disabled={isLoadingMore}>
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Xem thêm đánh giá"
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="write-review" className="pt-4">
              <ReviewForm productId={resolvedParams.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
