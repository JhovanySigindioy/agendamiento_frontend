
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Step1Consultation from '@/components/steps/Step1_Consultation';
import Step2Pharmacy from '@/components/steps/Step2_Pharmacy';
import Step3Schedule from '@/components/steps/Step3_Schedule';
import Step4Confirmation from '@/components/steps/Step4_Confirmation';
import WelcomeScreen from '@/components/WelcomeScreen';

import { farmacias, medicamentos, horariosDisponibles, ciudades } from '@/lib/mockData';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    cedula: '',
    codigoFormula: '',
    ciudad: '',
    farmacia: '',
    fecha: '',
    hora: '',
    email: ''
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetApp = () => {
    setCurrentStep(1);
    setFormData({
      cedula: '',
      codigoFormula: '',
      ciudad: '',
      farmacia: '',
      fecha: '',
      hora: '',
      email: ''
    });
    localStorage.removeItem('cita-medicamentos');
  };

  const cancelAppointment = () => {
    resetApp();
    toast({
      title: "Cita Cancelada",
      description: "Tu cita ha sido cancelada exitosamente."
    });
  };

  const rescheduleAppointment = () => {
    setCurrentStep(3);
    toast({
      title: "Reprogramar Cita",
      description: "Por favor, selecciona una nueva fecha y hora."
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    const stepProps = {
      formData,
      setFormData: handleInputChange,
      nextStep,
      prevStep,
      toast
    };

    switch (currentStep) {
      case 1:
        return <Step1Consultation {...stepProps} />;
      case 2:
        return <Step2Pharmacy {...stepProps} ciudades={ciudades} farmacias={farmacias} medicamentos={medicamentos} />;
      case 3:
        return <Step3Schedule {...stepProps} farmacias={farmacias} medicamentos={medicamentos} horariosDisponibles={horariosDisponibles} />;
      case 4:
        return <Step4Confirmation
          formData={formData}
          farmacias={farmacias}
          medicamentos={medicamentos}
          resetApp={resetApp}
          cancelAppointment={cancelAppointment}
          rescheduleAppointment={rescheduleAppointment}
        />;
      default:
        return <Step1Consultation {...stepProps} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Eticos Citas</title>
        <meta name="description" content="Agenda tu cita para reclamar medicamentos formulados. Evita filas y organiza tu tiempo de manera eficiente." />
      </Helmet>

      <AnimatePresence>
        {isLoading && <WelcomeScreen />}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen antialiased fade-in">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} currentStep={currentStep} />
          {/* <div className="text-center">
            <img src="/img/banner-interno-agenda-cita.webp" alt="" className="w-full h-[8rem] md:h-auto" />
          </div> */}
          <main className="container mx-auto px-4 py-3 md:py-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </main>
          <Toaster />
        </div>
      )}

    </>
  );
}

export default App;
