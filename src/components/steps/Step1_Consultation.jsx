import { motion } from 'framer-motion';
import { ArrowRight, User, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useValidatePresciptionPatient } from '@/apiHooks/prescription/useValidatePresciptionPatient';
import { useEffect } from 'react';

const Step1Consultation = ({ formData, setFormData, nextStep, toast }) => {

  const { validatePresciptionPatientQuery } = useValidatePresciptionPatient(
    formData.cedula,
    formData.codigoFormula
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isFetched,
  } = validatePresciptionPatientQuery;

  useEffect(() => {

    if (isFetched && data) {
      if (Array.isArray(data) && data.length > 0) {
        toast({
          title: "¡Fórmula Encontrada!",
          description: "Se ha validado la fórmula médica. Continuar con la dispensación.",
        });
        nextStep();
      } else if (Array.isArray(data) && data.length === 0) {

        toast({
          title: "¡Fórmula NO encontrada!",
          description: "No se encontró información, verifique que el número de identificación y número fórmula sean correctos.",
          variant: "destructive"
        });
      } else if (data) {
        toast({
          title: "¡Fórmula Encontrada!",
          description: "Se ha validado la fórmula médica. Continuar con la dispensación.",
        });
        nextStep();
      }
    }

    if (isError) {
      toast({
        title: "Error de Validación",
        description: "Fórmula o paciente no encontrado, o la fórmula no pertenece al paciente.",
        variant: "destructive"
      });
    }


  }, [data, isFetched, isError, error, nextStep, toast]);

  const validateFields = () => {
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

  const handleConsult = () => {
    if (validateFields()) {
      refetch();
    }
  };

  const isQuerying = isLoading || isFetching;

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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 pulse-blue"
        >
          <FileText className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Consulte su Fórmula Médica
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Ingrese sus datos para verificar fórmulas vigentes
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
              <span>Número de identificación</span>
            </Label>
            <Input
              id="cedula"
              type="text"
              placeholder="Ej: 12345678"
              value={formData.cedula}
              onChange={(e) => setFormData('cedula', e.target.value)}
              className="h-12 text-lg"
              disabled={isQuerying}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo" className="text-sm font-medium flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Número de Fórmula Médica</span>
            </Label>
            <Input
              id="codigo"
              type="text"
              value={formData.codigoFormula}
              onChange={(e) => setFormData('codigoFormula', e.target.value)}
              className="h-12 text-lg"
              disabled={isQuerying}
            />
            <span className="text-sm text-gray-500 pt-1">Ejemplo: 2510183369</span>
          </div>

          {/* Botón de Consulta con Estado de Carga */}
          <Button
            onClick={handleConsult}
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all duration-300"
            disabled={isQuerying}
          >
            {isQuerying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                Consultar Medicamentos
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Step1Consultation;