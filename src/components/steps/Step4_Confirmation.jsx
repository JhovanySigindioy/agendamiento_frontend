import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, User, MapPin, Calendar, Clock, Pill, Download, Mail, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';

const Step4Confirmation = ({ formData, farmacias, medicamentos, resetApp, cancelAppointment, rescheduleAppointment }) => {

  useEffect(() => {
    const appointmentData = {
      ...formData,
      medicamentos,
      farmaciaSeleccionada: farmacias[formData.ciudad]?.find(f => f.id.toString() === formData.farmacia),
      fechaCreacion: new Date().toISOString()
    };
    localStorage.setItem('cita-medicamentos', JSON.stringify(appointmentData));
    toast({
      title: "¡Cita confirmada!",
      description: "Tu cita ha sido agendada exitosamente."
    });
  }, [formData, farmacias, medicamentos]);

  const downloadReceipt = () => {
    toast({
      title: "🚧 Esta función no está implementada aún",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
    });
  };

  const sendEmail = () => {
    toast({
      title: "🚧 Esta función no está implementada aún",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
    });
  };

  const farmaciaSeleccionada = farmacias[formData.ciudad]?.find(f => f.id.toString() === formData.farmacia);

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        ¡Cita Confirmada!
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Tu cita ha sido agendada exitosamente
      </p>

      <Card className="glass-effect border-0 shadow-xl mb-8 text-left">
        <CardHeader>
          <CardTitle className="text-primary">Detalles de tu Cita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Paciente</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">C.C. {formData.cedula}</p>
                </div>
              </div>
              {farmaciaSeleccionada &&
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{farmaciaSeleccionada.nombre}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{farmaciaSeleccionada.direccion}</p>
                  </div>
                </div>
              }
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Fecha</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(formData.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Hora</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formData.hora}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-3 flex items-center space-x-2 text-primary">
              <Pill className="w-5 h-5" />
              <span>Medicamentos a Reclamar</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {medicamentos.map((med, index) => (
                <div key={index} className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
                  <p className="font-medium text-primary/90 dark:text-blue-300">{med.nombre}</p>
                  <p className="text-sm text-primary/80 dark:text-blue-400">{med.cantidad}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={downloadReceipt}
          className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Comprobante</span>
        </Button>
        <Button
          onClick={sendEmail}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Mail className="w-4 h-4" />
          <span>Enviar por Email</span>
        </Button>
        <Button
          onClick={rescheduleAppointment}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reprogramar</span>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center space-x-2">
              <XCircle className="w-4 h-4" />
              <span>Cancelar Cita</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro que deseas cancelar tu cita?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Perderás tu turno y deberás
                agendar una nueva cita si aún necesitas reclamar tus medicamentos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Volver</AlertDialogCancel>
              <AlertDialogAction onClick={cancelAppointment}>Sí, cancelar cita</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-left">
        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Recordatorio Importante</h4>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Por favor llega 10 minutos antes de tu cita y trae tu documento de identidad original.
          Si necesitas cancelar o reprogramar, hazlo con al menos 2 horas de anticipación.
        </p>
      </div>

      <Button
        onClick={resetApp}
        variant="outline"
        className="mt-6"
      >
        Agendar Nueva Cita
      </Button>
    </motion.div>
  );
};

export default Step4Confirmation;