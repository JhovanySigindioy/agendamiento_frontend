import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, MapPin, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Step2Pharmacy = ({ formData, setFormData, nextStep, prevStep, toast, ciudades, farmacias, medicamentos }) => {

  const validateStep = () => {
    if (!formData.ciudad || !formData.farmacia) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona una ciudad y farmacia.",
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

  const getBadgeVariant = (disponibilidad) => {
    switch (disponibilidad) {
      case 'completa': return 'success';
      case 'parcial': return 'secondary';
      default: return 'destructive';
    }
  }

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <MapPin className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Selecciona tu Farmacia
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Elige la ciudad y farmacia donde deseas reclamar tus medicamentos
        </p>
      </div>

      <Card className="mb-8 glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Pill className="w-5 h-5" />
            <span>Medicamentos Formulados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medicamentos.map((med, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30"
              >
                <h4 className="font-semibold text-primary dark:text-blue-300">{med.nombre}</h4>
                <p className="text-sm text-primary/80 dark:text-blue-400">{med.cantidad}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Selecciona tu Ciudad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ciudades.map((ciudad) => (
              <motion.div
                key={ciudad.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={formData.ciudad === ciudad.nombre ? "default" : "outline"}
                  className="w-full justify-between h-12"
                  onClick={() => {
                    setFormData('ciudad', ciudad.nombre);
                    setFormData('farmacia', '');
                  }}
                >
                  <span>{ciudad.nombre}</span>
                  <Badge variant="secondary">{ciudad.farmacias} farmacias</Badge>
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Farmacias Disponibles</CardTitle>
            <CardDescription>
              {formData.ciudad ? `Farmacias en ${formData.ciudad}` : 'Selecciona una ciudad primero'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 h-[300px] overflow-y-auto pr-2">
            {formData.ciudad && farmacias[formData.ciudad] ? (
              farmacias[formData.ciudad].map((farmacia) => (
                <motion.div
                  key={farmacia.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={formData.farmacia === farmacia.id.toString() ? "default" : "outline"}
                    className="w-full text-left h-auto p-4"
                    onClick={() => setFormData('farmacia', farmacia.id.toString())}
                  >
                    <div className="flex flex-col items-start space-y-1 w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold">{farmacia.nombre}</span>
                        <Badge variant={getBadgeVariant(farmacia.disponibilidad)}>
                          {farmacia.medicamentosDisponibles}/{farmacia.totalMedicamentos} disponibles
                        </Badge>
                      </div>
                      <span className="text-sm opacity-75">{farmacia.direccion}</span>
                    </div>
                  </Button>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Selecciona una ciudad para ver las farmacias disponibles
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>
        <Button variant="outline" onClick={handleNext} className="flex items-center space-x-2">
          <span>Siguiente</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

      </div>
    </motion.div>
  );
};

export default Step2Pharmacy;