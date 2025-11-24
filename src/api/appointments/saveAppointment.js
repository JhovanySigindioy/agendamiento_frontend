import apiClient from "@/config/axios";

export const saveAppointment = async (appointment) => {
    try {
        const response = await apiClient.post("/appointment", appointment);
        console.log("DATOS RECIBIDOS AL CREAR LA CITA ::::: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error agendando la cita: ", error);
        throw error;
    }
};