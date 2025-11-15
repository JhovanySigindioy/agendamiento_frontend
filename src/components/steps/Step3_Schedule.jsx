// import { motion } from 'framer-motion';

// const Step3Schedule = ({  }) => {


//   return (
//     <motion.div
//       key="step3"
//       initial={{ opacity: 0, x: 50 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -50 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-4xl mx-auto"
//     >
     

     

 
//     </motion.div>
//   );
// };

// export default Step3Schedule;

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Step3Schedule = ({ formData, setFormData, nextStep, prevStep, toast, farmacias, medicamentos, horariosDisponibles }) => {

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
  
  const handleNext = () => {
    if (validateStep()) {
      nextStep();
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
          Agenda tu Cita
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Selecciona la fecha y hora que mejor se adapte a tu horario
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-effect border-0 shadow-xl">
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
              onChange={(e) => setFormData('fecha', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
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
            <div className="grid grid-cols-3 gap-3">
              {horariosDisponibles.map((hora) => (
                <Button
                  key={hora}
                  variant={formData.hora === hora ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setFormData('hora', hora)}
                >
                  {hora}
                </Button>
              ))}
            </div>
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
                <span>{farmacias[formData.ciudad]?.find(f => f.id.toString() === formData.farmacia)?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha:</span>
                <span>{new Date(formData.fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hora:</span>
                <span>{formData.hora}</span>
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