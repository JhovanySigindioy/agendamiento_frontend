import { motion } from 'framer-motion';
import { Moon, Sun, Pill, FileText, MapPin, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const steps = [
  { number: 1, title: 'Consulta', icon: FileText },
  { number: 2, title: 'Farmacia', icon: MapPin },
  { number: 3, title: 'Agenda', icon: Calendar },
  { number: 4, title: 'Confirma', icon: CheckCircle }
];

const Header = ({ darkMode, toggleDarkMode, currentStep }) => {
  const handleLogoClick = () => {
    toast({
      title: ' Redirección no implementada',
      description: 'En una aplicación real, esto te llevaría a la página de inicio. ¡Puedes solicitarlo en tu próximo mensaje! 🚀'
    });
  }

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleLogoClick}
        >
          {/* <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center shadow-lg">
            <Pill className="w-6 h-6 text-white" />
          </div> */}
          <div>
            <img src="/img/logoEticos.avif" alt="logo eticos" className="w-40 h-10" />
            <p className="text-xs text-muted-foreground">Compromiso y servicio farmacutico</p>
          </div>
        </motion.div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-gray-800 p-1 rounded-full">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentStep === step.number
                    ? 'bg-primary-gradient text-primary-foreground shadow-md'
                    : 'text-muted-foreground'
                } ${
                  currentStep > step.number
                    ? 'bg-primary-gradient/20 text-primary'
                    : ''
                }`}>
                  <step.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 mx-1 text-slate-300 dark:text-gray-600" />
                )}
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground/70 hover:text-foreground"
          >
            <Sun className="w-5 h-5 scale-100 dark:scale-0 transition-transform duration-300" />
            <Moon className="w-5 h-5 absolute scale-0 dark:scale-100 transition-transform duration-300" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;