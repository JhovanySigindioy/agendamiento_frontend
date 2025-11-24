import { saveAppointment } from "@/api/appointments/saveAppointment";
import { useMutation } from "@tanstack/react-query";

export const useAppointments = () => {
    const appointmentMutation = useMutation({
        mutationFn: (appointment) => saveAppointment(appointment),
    });

    return {
        appointmentMutation,
    };
};
