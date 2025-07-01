const { DataTypes, STRING } = require("sequelize");

module.exports = (sequelize) => {
    const Movimiento = sequelize.define("Movimiento", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false, 
            unique: true,
            validate: {
                len: [1, 50]
            }
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [[
                'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma', 'Fuego',
                'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca',
                'Siniestro', 'Tierra', 'Veneno', 'Volador']]
            }
        },
        potencia: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 250
            }
        },
        precision: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 100
            }
        }
    });

    return Movimiento;
}