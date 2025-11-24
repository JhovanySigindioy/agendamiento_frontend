import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePrescriptions } from '@/apiHooks/prescription/usePrescriptions';
import { Laoding } from '../Laoding';
import FormulaDetailCard from '../FormulaDetailCard';
import { usePharmacy } from '@/apiHooks/pharmacy/usePharmacy';
import { use } from 'react';

const Step2Pharmacy = ({ formData, setFormData, nextStep, prevStep, toast }) => {
  const { getCountPharmaciesQuery, getAllPharmaciesQuery } = usePharmacy();
  const { getPrescriptionsQuery } = usePrescriptions(formData.cedula);

  const {
    data: formulasResponse,
    isLoading,
    isError,
  } = getPrescriptionsQuery;

  const formulas = formulasResponse?.data || [];
  const formulasCount = formulas.length;

  useEffect(() => {
    if (!formulas || formulas.length === 0) return;

    const prescriptions = formulas.map(f => f.prescription);
    setFormData("codigoFormula", prescriptions.join(", "));
  }, [formulas]);

  const allPharmacies = getAllPharmaciesQuery.data?.data || [];

  const farmaciasFiltradas = React.useMemo(() => {
    if (!formData.ciudad) return [];
    return allPharmacies.filter(
      (f) =>
        f.City.trim().toLowerCase() === formData.ciudad.trim().toLowerCase() &&
        f.Name.trim().toLowerCase().indexOf("cirugia") === -1
    );
  }, [formData.ciudad, allPharmacies]);

  const validateStep = () => {
    if (!formData.ciudad || !formData.farmacia) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona una ciudad y farmacia.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) nextStep();
  };

  const handlesetFormData = (field, value) => {
    alert(field, value);
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <MapPin className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Farmacias
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Porfavor Elija la ubicación de recogida y verifique sus fórmulas médicas.
        </p>
      </div>

      <Card className="mb-4 border-2 border-primary/30 shadow-xl">
        <CardHeader className="bg-primary/5 dark:bg-primary/10 p-4 rounded-t-lg">
          <CardTitle className="text-lg flex items-center space-x-2 text-primary">
            <MapPin className="w-5 h-5" />
            <span>Farmacias</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              Selecciona tu Ciudad
            </label>
            <Select
              value={formData.ciudad}
              onValueChange={(value) => {
                setFormData("ciudad", value);
                setFormData("farmacia", "");
              }}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Elige una ciudad" />
              </SelectTrigger>

              <SelectContent className="max-h-80 overflow-y-auto">
                {getCountPharmaciesQuery.data?.data.map((ciudad, idx) => (
                  <SelectItem key={idx} value={ciudad.city}>
                    {ciudad.city} {/*({ciudad.pharmacyCount}) */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              Farmacia Disponible
            </label>

            <Select
              value={formData.farmacia}
              onValueChange={(value) => {
                setFormData("farmacia", value);

                const farmaciaSeleccionada = farmaciasFiltradas.find(
                  (f) => f.IdPharmacy === value
                );

                if (farmaciaSeleccionada) {
                  setFormData("codigoCiudad", farmaciaSeleccionada.CityCode);
                }
              }}
              disabled={!formData.ciudad || farmaciasFiltradas.length === 0}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue
                  placeholder={
                    formData.ciudad
                      ? "Selecciona una farmacia"
                      : "Selecciona una ciudad"
                  }
                />
              </SelectTrigger>

              <SelectContent className="max-h-80 overflow-y-auto">
                {farmaciasFiltradas.length > 0 ? (
                  farmaciasFiltradas.map((farmacia) => (
                    <SelectItem key={farmacia.IdPharmacy} value={farmacia.IdPharmacy}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{farmacia.Address}</span>
                        <span className="text-xs text-gray-600">{farmacia.Name}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No hay farmacias disponibles
                  </div>
                )}
              </SelectContent>
            </Select>

          </div>
        </CardContent>
      </Card>


      {isLoading ? (
        <div className="my-8">
          <Laoding />
        </div>
      ) : isError ? (
        <Card className="mb-8 border-2 border-red-400 shadow-2xl">
          <CardHeader className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-t-xl">
            <CardTitle className="text-red-600 flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <span>Error al Cargar Fórmulas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-red-700 dark:text-red-300">
            No pudimos obtener las fórmulas médicas. Intenta más tarde.
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-2 shadow-2xl">
          <CardHeader className="bg-secondary/10 dark:bg-secondary/20 p-4 rounded-t-xl">
            <CardTitle className="text-primary flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>Cantidad de Fórmulas Médicas Vigentes ({formulasCount})</span>
            </CardTitle>
            <CardDescription>
              Toca cada fórmula para ver los detalles.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            {formulasCount > 0 ? (
              formulas.map((formula) => (
                <FormulaDetailCard key={formula.formula} formula={formula} />
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                No se encontraron fórmulas activas.
              </div>
            )}
          </CardContent>
        </Card>
      )}


      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>

        <Button
          onClick={handleNext}
          className="flex items-center space-x-2 px-8"
          disabled={!formData.ciudad || !formData.farmacia}
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step2Pharmacy;
