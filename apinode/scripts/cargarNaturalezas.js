const { sequelize, naturaleza } = require("../models");

const naturalezas = [
    { nombre: "Activa", aumenta: "velocidad", disminuye: "defensa" },
    { nombre: "Afable", aumenta: "defensa", disminuye: "ataque" },
    { nombre: "Agitada", aumenta: "velocidad", disminuye: "defensa_especial" },
    { nombre: "Alegre", aumenta: "velocidad", disminuye: "ataque_especial" },
    { nombre: "Alocada", aumenta: "ataque_especial", disminuye: "defensa" },
    { nombre: "Amable", aumenta: "defensa_especial", disminuye: "ataque" },
    { nombre: "Audaz", aumenta: "ataque", disminuye: "velocidad" },
    { nombre: "Cauta", aumenta: "defensa_especial", disminuye: "ataque_especial" },
    { nombre: "Dócil", aumenta: "defensa", disminuye: "defensa" },
    { nombre: "Firme", aumenta: "ataque", disminuye: "ataque_especial" },
    { nombre: "Floja", aumenta: "defensa", disminuye: "velocidad" },
    { nombre: "Fuerte", aumenta: "ataque", disminuye: "ataque" },
    { nombre: "Grosera", aumenta: "ataque", disminuye: "defensa_especial" },
    { nombre: "Huraña", aumenta: "defensa", disminuye: "ataque_especial" },
    { nombre: "Ingenua", aumenta: "velocidad", disminuye: "defensa_especial" },
    { nombre: "Mansa", aumenta: "ataque_especial", disminuye: "ataque" },
    { nombre: "Miedosa", aumenta: "velocidad", disminuye: "ataque" },
    { nombre: "Modesta", aumenta: "ataque_especial", disminuye: "ataque" },
    { nombre: "Osada", aumenta: "defensa", disminuye: "velocidad" },
    { nombre: "Pícara", aumenta: "ataque", disminuye: "defensa" },
    { nombre: "Plácida", aumenta: "defensa", disminuye: "velocidad" },
    { nombre: "Rara", aumenta: "defensa_especial", disminuye: "defensa_especial" },
    { nombre: "Serena", aumenta: "defensa_especial", disminuye: "velocidad" },
    { nombre: "Seria", aumenta: "velocidad", disminuye: "velocidad" },
    { nombre: "Tímida", aumenta: "velocidad", disminuye: "ataque" }
];

async function cargarNaturalezas() {
    try {
        await sequelize.sync();
        await naturaleza.bulkCreate(naturalezas, { ignoreDuplicates: true });
        console.log("Naturalezas cargadas correctamente");
    } catch (error) {
        console.error("Error al cargar naturalezas: ", error);
    } finally {
        await sequelize.close();
    }
}

cargarNaturalezas();