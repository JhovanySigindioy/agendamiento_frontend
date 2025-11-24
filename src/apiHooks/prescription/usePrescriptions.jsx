import { getPrescriptions } from "@/api/prescription/getPrescriptions";
import { useQuery } from "@tanstack/react-query";

export const usePrescriptions = (identification) => {
    const getPrescriptionsQuery = useQuery({
        queryKey: ["getPrescriptions", identification],
        queryFn: () => getPrescriptions(identification),
        staleTime: 1000 * 60 * 60 // 30 mins
    });

    return {
        getPrescriptionsQuery,
    };
}