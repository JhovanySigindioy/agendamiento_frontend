import apiClient from "@/config/axios";

export const validatePresciptionPatient = async (identification, prescription) => {
    try {
        const response = await apiClient.get(`validate/${identification}/${prescription}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};