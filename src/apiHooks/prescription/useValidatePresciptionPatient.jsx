import { validatePresciptionPatient } from "@/api/prescription/validatePresciption";
import { useQuery } from "@tanstack/react-query";

export const useValidatePresciptionPatient = (identification, prescription) => {
    const validatePresciptionPatientQuery = useQuery({
        queryKey: ["validatePresciptionPatient", identification, prescription],
        queryFn: () => validatePresciptionPatient(identification, prescription),
        retry: false,
        enabled: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60, // 30 mins
    });

    return {
        validatePresciptionPatientQuery,
    };
};
