import { getAllPharmacies } from "@/api/pharmacy/getAllPharmacies";
import { getCountPharmaciesByCity } from "@/api/pharmacy/getCountPharmaciesByCity";
import { getSchedulesPharmacy } from "@/api/pharmacy/getSchedulesPharmacy";
import { useQuery } from "@tanstack/react-query";

export const usePharmacy = (idPharmacy, dateSelected) => {
    const getCountPharmaciesQuery = useQuery({
        queryKey: ["getPharmacyByCity"],
        queryFn: () => getCountPharmaciesByCity(),
        staleTime: 1000 * 60 * 60 // 30 mins
    });

    const getAllPharmaciesQuery = useQuery({
        queryKey: ["getAllPharmacies"],
        queryFn: () => getAllPharmacies(),
        staleTime: 1000 * 60 * 60 // 30 mins
    });

    const getSchedulesPharmacyQuery = useQuery({
        queryKey: ["getSchedulesPharmacy", idPharmacy, dateSelected],
        queryFn: () => getSchedulesPharmacy(idPharmacy, dateSelected),
        staleTime: 1000 * 60 * 60, // 30 mins
        enabled: Boolean(idPharmacy),
    });

    return {
        getCountPharmaciesQuery,
        getAllPharmaciesQuery,
        getSchedulesPharmacyQuery,
    };
}