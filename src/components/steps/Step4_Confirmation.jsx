import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, User, MapPin, Calendar, Clock,
  Pill, Download, Mail, XCircle, RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';
import { usePrescriptions } from "@/apiHooks/prescription/usePrescriptions";
import { useQueryClient } from "@tanstack/react-query";
import FormulaDetailCard from "../FormulaDetailCard";
import { downloadAppointmentPDF } from '@/helpers/generateAppointmentReceipt';


const Step4Confirmation = ({ formData, resetApp, cancelAppointment, rescheduleAppointment, appointmentResult }) => {

  const queryClient = useQueryClient();

  //  Recuperar lista de farmacias desde CACHE
  const pharmaciesCache = queryClient.getQueryData(["getAllPharmacies"]);
  const pharmaciesList = pharmaciesCache?.data || [];

  //  Buscar farmacia por ID
  const farmaciaSeleccionada = pharmaciesList.find(
    (f) => f.IdPharmacy.toString() === formData.farmacia
  );

  const appointmentData = appointmentResult.data;
  const ventanilla = appointmentData?.windowNumber || formData.ventanilla || 1;
  const turno = appointmentData?.turnNumber || formData.turnNumber;
  const appointmentId = appointmentData?.id;

  //  Obtener fórmulas desde cache
  const { getPrescriptionsQuery } = usePrescriptions(formData.cedula);
  const formulas = getPrescriptionsQuery.data?.data || [];

  useEffect(() => {
    toast({
      title: "¡Cita confirmada!",
      description: "Tu cita ha sido agendada exitosamente."
    });
    // downloadAppointmentPDF(
    //   appointmentData,
    //   formulas,
    //   farmaciaSeleccionada
    // )
  }, []);


  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto"
    >


      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-3"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-2">
        ¡Cita Confirmada!
      </h2>

      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8">
        Gracias, hemos registrado exitosamente su programación.
      </p>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="glass-effect shadow-xl rounded-2xl backdrop-blur-md border border-white/20 self-start">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary text-xl flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ventanilla y Turno
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-4 pb-7 flex flex-col items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Reclame sus medicamentos en:
            </p>

            <div className="flex items-center justify-center gap-4">
              <div
                className="
                  w-28 h-24 
                  rounded-xl shadow-md border border-primary/30
                  bg-primary/10 dark:bg-primary/20
                  flex flex-col items-center justify-center
                "
              >
                <span className="text-[14px] text-primary/70 font-bold uppercase tracking-wide">
                  Ventanilla
                </span>
                <span className="text-3xl font-extrabold text-primary">
                  {ventanilla}
                </span>
              </div>


              <div
                className="
          w-28 h-24 
          rounded-xl shadow-md border border-primary/30
          bg-primary/10 dark:bg-primary/20
          flex flex-col items-center justify-center
        "
              >
                <span className="text-[14px] text-primary/70 font-bold uppercase tracking-wide">
                  Turno
                </span>
                <span className="text-3xl font-extrabold text-primary">
                  {turno}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Presente su documento de identidad.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect shadow-xl rounded-2xl backdrop-blur-md border border-white/20 lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-primary text-xl flex items-center gap-2">
              <User className="w-5 h-5" />
              Detalles de su Cita
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Paciente</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">C.C. {formData.cedula}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre Paciente</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{formData.nombre ?? "Nombre del paciente"}</p>
                  </div>
                </div>

                {farmaciaSeleccionada && (
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Punto de Retiro</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                        {farmaciaSeleccionada.Name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 text-pretty">
                        {farmaciaSeleccionada.Address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/10 flex flex-col justify-between">
                <div className="space-y-4 self-start">
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fecha Programada</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                        {(() => {
                          const [y, m, d] = formData.fecha.split("-");
                          const fechaLocal = new Date(y, m - 1, d);
                          return fechaLocal.toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                          });
                        })()}

                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(formData.fecha).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-px bg-primary/10"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Hora</p>
                        <p className="text-2xl font-bold text-primary">
                          {formData.hora}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300/30 pt-6">
              <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Fórmulas a Reclamar
              </h4>
              {formulas.length > 0 ? (
                <div className="space-y-4">
                  {formulas.map((formula, index) => (
                    <FormulaDetailCard key={index} formula={formula} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay fórmulas registradas.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="flex flex-wrap gap-5 justify-center mt-10">

        <Button
          className="bg-primary gap-2"
          onClick={() =>
            downloadAppointmentPDF(
              appointmentData,
              formulas,
              farmaciaSeleccionada
            )
          }
        >
          <Download className="w-4 h-4" />
          Descargar Comprobante
        </Button>

        <Button
          onClick={resetApp}
          variant="outline"
          className="border border-blue-400 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
        >
          Agendar Nueva Cita
        </Button>


        {/* <Button variant="outline" className="gap-2">
          <Mail className="w-4 h-4" />
          Enviar por Email
        </Button>
        <Button variant="outline" className="gap-2" onClick={rescheduleAppointment}>
          <RefreshCw className="w-4 h-4" />
          Reprogramar
        </Button> */}
        {/* <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <XCircle className="w-4 h-4" />
              Cancelar Cita
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Desea cancelar esta cita?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Volver</AlertDialogCancel>
              <AlertDialogAction onClick={cancelAppointment}>
                Cancelar Cita
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
      <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-300/40 max-w-3xl mx-auto text-left">
        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
          Recordatorio Importante
        </h4>
        <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
          Llegue 10 minutos antes de su cita y traiga su documento de identidad original.
          Si necesita cancelar o reprogramar, hágalo con al menos 2 horas de anticipación.
        </p>
      </div>

    </motion.div>
  );
};

export default Step4Confirmation;
