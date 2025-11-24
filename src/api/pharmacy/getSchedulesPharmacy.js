import apiClient from "@/config/axios"

export const getSchedulesPharmacy = async (idPharmacy, dateSelected) => {
    const response = await apiClient.get(`/schedules/${idPharmacy}/${dateSelected}`);
    return response.data;
}