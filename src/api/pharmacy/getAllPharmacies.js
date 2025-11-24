import apiClient from "@/config/axios"

export const getAllPharmacies = async () => {
    const response = await apiClient.get("/pharmacies");
    return response.data
}