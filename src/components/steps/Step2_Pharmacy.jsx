import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, MapPin, Pill, FileText, ChevronDown, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// Importamos los componentes Select para mejorar la usabilidad
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Datos de Ejemplo (Mantengo los mismos para la demostración) ---
const mockFormulas = [
  {
    formula: 'FORM-001',
    fechaEvolucion: '2025-10-01',
    loginProfesional: 'DR-JSMITH',
    medicamentos: [
      { codigoMolecula: 'MOL001', descripcionInsumos: 'Amoxicilina 500mg', detalleDosis: '1 tableta cada 8 horas por 7 días', cantidad: 21 },
      { codigoMolecula: 'MOL002', descripcionInsumos: 'Ibuprofeno 400mg', detalleDosis: '1 tableta cada 6 horas PRN (Según necesidad)', cantidad: 10 },
    ],
  },
  {
    formula: 'FORM-002',
    fechaEvolucion: '2025-10-15',
    loginProfesional: 'DRA-LPEEZ',
    medicamentos: [
      { codigoMolecula: 'MOL003', descripcionInsumos: 'Losartán 50mg', detalleDosis: '1 tableta diaria', cantidad: 30 },
    ],
  },
  {
    formula: 'FORM-003',
    fechaEvolucion: '2025-11-05',
    loginProfesional: 'DR-RROJAS',
    medicamentos: [
      { codigoMolecula: 'MOL004', descripcionInsumos: 'Loratadina 10mg', detalleDosis: '1 tableta cada 24 horas', cantidad: 14 },
      { codigoMolecula: 'MOL005', descripcionInsumos: 'Prednisolona 5mg', detalleDosis: '1 tableta cada 12 horas por 5 días', cantidad: 10 },
    ],
  },
];

const FormulaDetailCard = ({ formula }) => (
  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={formula.formula} className="border-b border-primary/20">
        <AccordionTrigger className="p-4 flex justify-between items-center text-left hover:no-underline">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-bold text-gray-800 dark:text-gray-100">Fórmula: {formula.formula}</span>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {formula.medicamentos.length} Medicamento(s)
          </Badge>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="text-sm text-gray-500 dark:text-gray-400 border-b pb-2 mb-2">
              <p>Fecha: <span className="font-medium">{formula.fechaEvolucion}</span></p>
              <p>Profesional: <span className="font-medium">{formula.loginProfesional}</span></p>
            </div>
            <h5 className="font-semibold text-primary/90 dark:text-blue-300 flex items-center space-x-2">
              <ListOrdered className="w-4 h-4" />
              <span>Detalle de Medicamentos:</span>
            </h5>
            <div className="space-y-2">
              {formula.medicamentos.map((med, idx) => (
                <div key={idx} className="border-l-4 border-primary/50 pl-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-50">{med.descripcionInsumos}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    **Dosis:** {med.detalleDosis}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cantidad Requerida: **{med.cantidad}**
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
);

const Step2Pharmacy = ({ formData, setFormData, nextStep, prevStep, toast, ciudades, farmacias }) => {

  const formulas = mockFormulas;

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

  // Helper para buscar el nombre de la farmacia por ID (necesario para SelectValue)
  const getFarmaciaNameById = (id) => {
    const ciudadFarmacias = farmacias[formData.ciudad] || [];
    const farmacia = ciudadFarmacias.find(f => f.id.toString() === id);
    return farmacia ? farmacia.nombre : 'Selecciona una farmacia';
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
          Elige la ubicación de recogida y revisa tus fórmulas médicas.
        </p>
      </div>

      {/* Sección de Selectores (Arriba) */}
      <Card className="mb-4 border-2 border-primary/30 shadow-xl">
        <CardHeader className="bg-primary/5 dark:bg-primary/10 p-4 rounded-t-lg">
          <CardTitle className="text-lg flex items-center space-x-2 text-primary">
            <MapPin className="w-5 h-5" />
            <span>Farmacias</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de Ciudad */}
          <div>
            <label htmlFor="select-ciudad" className="text-sm font-medium leading-none mb-2 block">
              Selecciona tu Ciudad
            </label>
            <Select
              id="select-ciudad"
              value={formData.ciudad}
              onValueChange={(value) => {
                setFormData('ciudad', value);
                setFormData('farmacia', ''); // Resetear farmacia al cambiar
              }}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Elige una ciudad" />
              </SelectTrigger>
              <SelectContent>
                {ciudades.map((ciudad) => (
                  <SelectItem key={ciudad.id} value={ciudad.nombre}>
                    {ciudad.nombre} ({ciudad.farmacias})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selector de Farmacia */}
          <div>
            <label htmlFor="select-farmacia" className="text-sm font-medium leading-none mb-2 block">
              Farmacia Disponible
            </label>
            <Select
              id="select-farmacia"
              value={formData.farmacia}
              onValueChange={(value) => setFormData('farmacia', value)}
              disabled={!formData.ciudad || !farmacias[formData.ciudad]}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder={formData.ciudad ? "Selecciona una farmacia" : "Selecciona una ciudad primero"} />
              </SelectTrigger>
              <SelectContent>
                {formData.ciudad && farmacias[formData.ciudad] && farmacias[formData.ciudad].map((farmacia) => (
                  <SelectItem key={farmacia.id} value={farmacia.id.toString()}>
                    <div className="flex justify-between items-center w-full">
                      <span>{farmacia.nombre}</span>
                      <Badge variant="secondary" className="ml-2">
                        {farmacia.medicamentosDisponibles}/{farmacia.totalMedicamentos}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
                {formData.ciudad && (!farmacias[formData.ciudad] || farmacias[formData.ciudad].length === 0) && (
                  <SelectItem value="" disabled>
                    No hay farmacias disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Fin Sección de Selectores */}

      {/* Sección de Fórmulas (Debajo) */}
      <Card className="mb-8 border-2 shadow-2xl">
        <CardHeader className="bg-secondary/10 dark:bg-secondary/20 p-4 rounded-t-xl">
          <CardTitle className="text-primary flex items-center space-x-2">
            <FileText className="w-6 h-6" />
            <span className="text-[1.125rem]">Fórmulas Médicas a Dispensar ({formulas.length})</span>
          </CardTitle>
          <CardDescription>
            Toca cada fórmula para ver el detalle de medicamentos, dosis y cantidad requerida.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          {formulas.map((formula) => (
            <FormulaDetailCard key={formula.formula} formula={formula} />
          ))}
        </CardContent>
      </Card>
      {/* Fin Sección Fórmulas */}


      {/* Navegación */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>
        <Button
          onClick={handleNext}
          className="flex items-center space-x-2 px-8"
          disabled={!formData.ciudad || !formData.farmacia} // Deshabilitar si no ha seleccionado
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step2Pharmacy;