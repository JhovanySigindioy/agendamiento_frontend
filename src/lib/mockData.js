export const ciudades = [
    { id: 1, nombre: 'Bogotá', farmacias: 3 },
    { id: 2, nombre: 'Medellín', farmacias: 2 },
    { id: 3, nombre: 'Cali', farmacias: 1 },
    { id: 4, nombre: 'Barranquilla', farmacias: 1 },
];

export const farmacias = {
    'Bogotá': [
        { id: 1, nombre: 'Farmacia Eticos - Sede Chapinero', direccion: 'Calle 72 #10-34', medicamentosDisponibles: 3, totalMedicamentos: 3, disponibilidad: 'completa' },
        { id: 2, nombre: 'Farmacia Eticos - Sede Usaquén', direccion: 'Carrera 7 #119-10', medicamentosDisponibles: 2, totalMedicamentos: 3, disponibilidad: 'parcial' },
        { id: 3, nombre: 'Farmacia Eticos - Sede Suba', direccion: 'Calle 145 #91-58', medicamentosDisponibles: 3, totalMedicamentos: 3, disponibilidad: 'completa' }
    ],
    'Medellín': [
        { id: 4, nombre: 'Farmacia Eticos - Sede Poblado', direccion: 'Carrera 43A #5-33', medicamentosDisponibles: 1, totalMedicamentos: 3, disponibilidad: 'parcial' },
        { id: 5, nombre: 'Farmacia Eticos - Sede Laureles', direccion: 'Circular 73 #45-28', medicamentosDisponibles: 3, totalMedicamentos: 3, disponibilidad: 'completa' }
    ],
    'Cali': [
        { id: 6, nombre: 'Farmacia Eticos - Sede Sur', direccion: 'Calle 5 # 66-10', medicamentosDisponibles: 3, totalMedicamentos: 3, disponibilidad: 'completa' }
    ],
    'Barranquilla': [
        { id: 7, nombre: 'Farmacia Eticos - Sede Norte', direccion: 'Carrera 53 # 80-45', medicamentosDisponibles: 2, totalMedicamentos: 3, disponibilidad: 'parcial' }
    ]
};

export const medicamentos = [
    { nombre: 'Atorvastatina 20mg', cantidad: '30 tabletas' },
    { nombre: 'Amlodipino 5mg', cantidad: '30 cápsulas' },
    { nombre: 'Metformina 850mg', cantidad: '30 tabletas' }
];

export const horariosDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];