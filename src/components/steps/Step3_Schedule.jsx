import { motion } from 'framer-motion';

const Step3Schedule = ({  }) => {


  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
     

     

 
    </motion.div>
  );
};

export default Step3Schedule;