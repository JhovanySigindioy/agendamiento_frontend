import { motion } from 'framer-motion';
import { ArrowRight, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Step1Consultation = ({ formData, setFormData, nextStep, toast }) => {

  const validateStep = () => {
    if (!formData.cedula || !formData.codigoFormula) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos para continuar.",
        variant: "destructive"
      });
      return false;
    }
    if (formData.cedula.length < 5) {
      toast({
        title: "Cédula inválida",
        description: "La cédula debe tener al menos 5 dígitos.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      toast({
        title: "¡Fórmula encontrada!",
        description: "Hemos encontrado tus medicamentos. Continúa para seleccionar farmacia."
      });
      nextStep();
    }
  };

  return (

    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >


      <div className="text-center mb-8">
        {/* <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 pulse-blue"
        >
          <FileText className="w-10 h-10 text-primary-foreground" />
        </motion.div> */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Consulta tu Fórmula Médica
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Ingresa tus datos para verificar los medicamentos disponibles
        </p>
      </div>

      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-primary text-xl">Información del Paciente</CardTitle>
          <CardDescription>Completa los siguientes campos para continuar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cedula" className="text-sm font-medium flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Número de Cédula</span>
            </Label>
            <Input
              id="cedula"
              type="text"
              placeholder="Ej: 12345678"
              value={formData.cedula}
              onChange={(e) => setFormData('cedula', e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo" className="text-sm font-medium flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Código de Fórmula Médica</span>
            </Label>
            <Input
              id="codigo"
              type="text"
              placeholder="Ej: CODFORM-2024-001234"
              value={formData.codigoFormula}
              onChange={(e) => setFormData('codigoFormula', e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <Button

            className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            Consultar Medicamentos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Step1Consultation;