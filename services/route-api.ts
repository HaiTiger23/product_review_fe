export const routerApi = {
    auth : {
        login: "api/auth/login",
        register: "api/auth/register",
        logout: "api/auth/logout",
        getCurrentUser: "api/auth/me",
        updateUserProfile: "api/auth/update-profile",
    },
    product: {
        getAll: "api/products",
        add: "api/products",
        getById: "api/products/:id",
        bookmark: "api/products/bookmark/:productId",
        bookmarkByUser: "api/products/bookmark-user",
    },
    review: {
        add: "api/product-reviews/:productId",
        get: "api/product-reviews/:productId",
        markHelpful: "api/reviews/:reviewId/helpful",
        getByUser: "api/reviews/user",
        update: "/api/user/:reviewId",
        delete: "/api/user/:reviewId",
        
    },
    category: {
        getAll: "api/categories",
        getById: "api/categories/:id",
        create: "api/categories",
        update: "api/categories/:id",
        delete: "api/categories/:id",
    }
}
