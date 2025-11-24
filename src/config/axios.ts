import axios from "axios";
import { env } from "./env";

const apiClient = axios.create({
    baseURL: env.intranet.urlBase,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // "Authorization": `Bearer ${token}` 
    }
});

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Error en la respuesta de la API:", error);
        return Promise.reject(error);
    }
);

export default apiClient;