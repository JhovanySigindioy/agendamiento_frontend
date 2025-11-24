import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { FileText, ChevronDown, ListOrdered } from 'lucide-react';
import { Badge } from './ui/badge';

const FormulaDetailCard = ({ formula }) => {
    return (
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={formula.prescription} className="border-b border-primary/20">
                    <AccordionTrigger className="p-4 flex justify-between items-center text-left hover:no-underline">
                        <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="font-bold text-gray-800 dark:text-gray-100">Fórmula: {formula.prescription}</span>
                        </div>
                        <Badge variant="secondary" className="hidden sm:inline-flex">
                            {formula.medications.length} Medicamento(s)
                        </Badge>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="space-y-3">
                            <div className="text-sm text-gray-500 dark:text-gray-400 border-b pb-2 mb-2">
                                <p>Fecha: <span className="font-medium">{formula.creationDate}</span></p>
                                <p>Profesional: <span className="font-medium">{formula.doctor}</span></p>
                            </div>
                            <h5 className="font-semibold text-primary/90 dark:text-blue-300 flex items-center space-x-2">
                                <ListOrdered className="w-4 h-4" />
                                <span>Detalle de Medicamentos:</span>
                            </h5>
                            <div className="space-y-2">
                                {formula.medications.map((med, idx) => (
                                    <div key={idx} className="border-l-4 border-primary/50 pl-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-sm">
                                        <p className="font-medium text-gray-900 dark:text-gray-50">{med.medicine}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            **Dosis:** {med.dosage}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Cantidad Requerida: **{med.quantity}**
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
}

export default FormulaDetailCard;