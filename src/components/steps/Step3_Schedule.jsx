import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePharmacy } from '@/apiHooks/pharmacy/usePharmacy';
import { useAppointments } from '@/apiHooks/appointments/useAppointments';

const Step3Schedule = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
  toast,
  farmacias,
  medicamentos,
  setAppointmentResult
}) => {

  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const { getSchedulesPharmacyQuery } = usePharmacy(formData.farmacia, formData.fecha);

  const {
    data: schedulesPharmacy,
    isLoading,
    isError,
    refetch
  } = getSchedulesPharmacyQuery;

  const { appointmentMutation } = useAppointments();

  useEffect(() => {
    if (formData.fecha) {
      setFormData("hora", "");
      refetch();
    }
  }, [formData.fecha]);

  useEffect(() => {
    if (!isLoading && schedulesPharmacy?.data) {
      const horarios = schedulesPharmacy.data.map((h) => ({
        time: h.StartTime,
        turnNumber: h.TurnNumber,
        availableShift: h.AvailableShift
      }));
      setHorariosDisponibles(horarios);
    }
  }, [isLoading, schedulesPharmacy]);


  const validateStep = () => {
    if (!formData.fecha || !formData.hora) {
      toast({
        title: "Fecha y hora requeridas",
        description: "Por favor selecciona fecha y hora para tu cita.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  console.log("DATAA DE LAS FARMACIAS :::::::: ", formData);
  const handleNext = () => {

    if (validateStep()) {

      const appointment = {
        costCenter: formData.farmacia,
        company: "PHOLPHARMA UT",
        day: formData.fecha,
        windowNumber: "1",
        turnNumber: String(formData.turnNumber),
        patientId: formData.cedula,
        patientName: "NOMBRE GENERICO",
        prescription: formData.codigoFormula,
        processDate: formData.fechaCreacion || new Date().toISOString(),
        attentionDateTime: null,
        appointmentStatus: "A",
        statusReason: "Agendado",
        userName: null,
        attachment: null,
        city: formData.codigoCiudad
      };

      appointmentMutation.mutate(
        { ...appointment },
        {
          onSuccess: (data) => {
            setAppointmentResult(data);
            toast({
              title: "Cita creada",
              description: "Tu cita fue agendada correctamente",
            });
            nextStep();
          },
          onError: () => {
            toast({
              title: "Error",
              description: "No fue posible agendar la cita, intentelo mas tarde.",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >

      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Calendar className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Agende su Cita
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Seleccione la fecha y hora que mejor se adapte a su horario
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <Card className="glass-effect border-0 shadow-xl max-h-max">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Selecciona la Fecha</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData("fecha", e.target.value)}
              min={(() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split("T")[0];
              })()}
              className="h-12 text-lg"
            />

          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Horarios Disponibles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>

            {!formData.fecha && (
              <p className="text-gray-500 text-sm">Seleccione una fecha primero.</p>
            )}

            {formData.fecha && isLoading && <p className="text-sm">Cargando horarios...</p>}

            {isError && <p className="text-red-500 text-sm">Error al cargar horarios</p>}

            {formData.fecha && horariosDisponibles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {horariosDisponibles.map((h) => {
                  const isAvailable = h.availableShift === 1;
                  const isSelected = formData.hora === h.time;

                  return (
                    <motion.div
                      key={h.time}
                      whileTap={{ scale: isAvailable ? 0.97 : 1 }}
                      className="w-full"
                    >
                      <Button
                        disabled={!isAvailable}
                        variant="outline"
                        className={`
                          relative w-full h-11 text-sm font-medium rounded-lg
                          border transition-all duration-200

                          ${isAvailable && !isSelected ? `
                            border-gray-300 
                            hover:border-blue-500 hover:bg-blue-50 
                            text-gray-800
                          ` : ""}

                          ${isSelected ? `
                            bg-blue-600 text-white border-blue-700 
                            shadow-md ring-1 ring-blue-300
                          ` : ""}

                          ${!isAvailable ? `
                            bg-gray-100 border-gray-200 text-gray-400 
                            line-through cursor-not-allowed opacity-70
                          ` : ""}
                        `}
                        onClick={() => {
                          if (!isAvailable) return;
                          setFormData("hora", h.time);
                          setFormData("turnNumber", h.turnNumber);
                        }}
                      >
                        {h.time}

                        {!isAvailable && (
                          <span className="absolute bottom-1 right-2 text-[10px] text-gray-500 font-light">
                            Ocupado
                          </span>
                        )}

                        {isSelected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow"
                          />
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {formData.fecha && formData.hora && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mt-8 glass-effect border-0 shadow-xl bg-primary/10 dark:bg-primary/20">
            <CardHeader>
              <CardTitle className="text-primary dark:text-blue-300">Resumen de tu Cita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              <div className="flex justify-between">
                <span className="font-medium">Farmacia:</span>
                <span>
                  {
                    farmacias[formData.ciudad]?.find(
                      (f) => f.id.toString() === formData.farmacia
                    )?.nombre
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Fecha:</span>
                <span>
                  {new Date(formData.fecha).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Hora:</span>
                <span>{formData.hora}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Turno:</span>
                <span>{formData.turnNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Medicamentos:</span>
                <span>{medicamentos.length} medicamentos</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!formData.fecha || !formData.hora}
          className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
        >
          <span>Confirmar Cita</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step3Schedule;
