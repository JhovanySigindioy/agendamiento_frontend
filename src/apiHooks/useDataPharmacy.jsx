import { useQuery } from "@tanstack/react-query";
import { urlBase } from "../config/globalConfig";

export function useDataPharmacy() {
    const pharmacyQuery = useQuery({
        queryKey: ['pharmacies'],
        queryFn: async () => {
            const response = await fetch(`${urlBase}/farmacies`)
        }
    });

    return {
        pharmacyQuery,
    };
}