import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle} from 'lucide-react';

import { toast } from '@/components/ui/use-toast';

const Step4Confirmation = ({ formData}) => {
  
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


    </motion.div>
  );
};

export default Step4Confirmation;