import apiClient from "@/config/axios"

export const getCountPharmaciesByCity = async () => {
    const response = await apiClient.get(`/pharmacies/count`);
    return response.data;
}