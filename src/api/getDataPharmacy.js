import axios from "axios";
import { urlBase } from "../config/globalConfig";

export async function getDataPharmacy() {
    try {
        const response = await axios.get(`${urlBase}/pharmacies`);
        return response.data;
    } catch (error) {
        console.error("Error al traer data de farmacias:", error);
        throw error;
    }
}