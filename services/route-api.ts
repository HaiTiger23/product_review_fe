export const routerApi = {
    auth : {
        login: "api/auth/login",
        register: "api/auth/register",
        logout: "api/auth/logout",
        getCurrentUser: "api/auth/me",
    },
    product: {
        getAll: "api/products",
        add: "api/products",
        getById: "api/products/:id",
    },
    review: {
        add: "api/product-reviews/:productId",
        get: "api/product-reviews/:productId",
        markHelpful: "api/reviews/:reviewId/helpful",
    },
    category: {
        getAll: "api/categories",
        getById: "api/categories/:id",
        create: "api/categories",
        update: "api/categories/:id",
        delete: "api/categories/:id",
    }
}
