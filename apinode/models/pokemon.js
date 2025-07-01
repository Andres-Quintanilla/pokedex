const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Pokemon = sequelize.define("Pokemon", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1, 50]
            }
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo1: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [[
                'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma', 'Fuego',
                'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca',
                'Siniestro', 'Tierra', 'Veneno', 'Volador']]
            }
        },
        tipo2: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIn: [[
                'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma', 'Fuego',
                'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca',
                'Siniestro', 'Tierra', 'Veneno', 'Volador']]
            }
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        atk: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        def: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        spa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        spd: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        },
        spe: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 255
            }
        }
    });

    return Pokemon;
};