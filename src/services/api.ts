import axios from "axios";

import { AUTH_STORAGE_KEY, type AuthUser } from "@/contexts/authContext";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
        const user = JSON.parse(raw) as AuthUser;
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }

        const message =
            error.response?.data?.mensagem ??
            error.response?.data?.message ??
            error.response?.data?.error ??
            "Erro ao comunicar com o servidor.";

        return Promise.reject(new Error(message));
    },
);
