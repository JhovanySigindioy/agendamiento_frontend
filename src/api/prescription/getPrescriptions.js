
import apiClient from "@/config/axios"

export const getPrescriptions = async (identification) => {
    const response = await apiClient.get(`prescriptions/${identification}`);
    return response.data;
}