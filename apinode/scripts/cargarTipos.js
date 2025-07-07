const db = require("../models"); 

const TIPOS = [
    'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma', 'Fuego',
    'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca',
    'Siniestro', 'Tierra', 'Veneno', 'Volador'
];

async function cargarTipos() {
    try {
        await db.sequelize.sync(); 
        for (const Tipo of TIPOS) {
        await db.tipo.findOrCreate({ where: { nombre: Tipo } });
        }
        console.log("Tipos insertados correctamente");
        process.exit(0);
    } catch (error) {
        console.error("Error al insertar tipos:", error);
        process.exit(1);
    }
}

cargarTipos();
