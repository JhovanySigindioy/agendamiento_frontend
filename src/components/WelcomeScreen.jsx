
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeScreen = () => {
  const logoUrl = '/img/logo_polpharma.png';

  const containerVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: 'easeInOut' }
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="flex flex-col items-center text-center p-8"
        variants={itemVariants}
      >
        <motion.img
          src={logoUrl}
          alt="Logo de la empresa"
          className="w-auto h-30 mb-6"
          variants={itemVariants}
        />
        <motion.h1
          className="text-2xl md:text-4xl font-extrabold text-gradient mb-2"
          variants={itemVariants}
        >
          Le da la bienvenida
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground"
          variants={itemVariants}
        >
          Sistema de gestión de citas para reclamar sus medicamentos.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
