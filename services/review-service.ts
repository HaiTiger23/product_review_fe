import api from "./base-service"
import { routerApi } from "./route-api"


export const addReview = async (productId: string | number, reviewData: {
    rating: number
    content: string
}) => {
    return api.post(routerApi.review.add.replace(":productId", String(productId)), reviewData)
}

export const getProductReviews = async (
    productId: string | number,
    params: {
        page?: number
        limit?: number
        sort?: string
    } = { page: 1, limit: 10, sort: "helpful_desc" },
) => {
    return api.get(routerApi.review.get.replace(":productId", String(productId)), { params })
}

export const markReviewHelpful = async (reviewId: string | number, helpful: boolean) => {
    return api.post(routerApi.review.markHelpful.replace(":reviewId", String(reviewId)), { helpful })
}