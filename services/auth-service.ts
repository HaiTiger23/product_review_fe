import api from "./base-service";
import { routerApi } from "./route-api";

export function register(payload: {name: string, email: string, password: string, confirmPassword: string}) {
    return api.post(routerApi.auth.register, payload)
}

export function login(payload: {email: string, password: string}) {
    return api.post(routerApi.auth.login, payload)
}

export async function  getUser() {
    return await api.get(routerApi.auth.getCurrentUser);
}
    