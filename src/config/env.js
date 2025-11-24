//src/config/env.js
export const env = {
    intranet: {
        urlBase: import.meta.env.VITE_URL_BASE || "http://localhost:3000/api",
    }
}