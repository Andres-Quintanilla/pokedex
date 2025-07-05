const db = require("../models");
const { calcularTodosLosStats } = require("../utils/calcularStats.utils");

exports.crear = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const {
        apodo,
        pokemonId,
        equipoId,
        itemId,
        habilidadId,
        naturalezaId,
        movimientos,
        ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe,
        iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe
    } = req.body;

    if (!pokemonId || !equipoId || !naturalezaId || !itemId || !habilidadId) {
        return res.status(400).send({ message: "Faltan campos obligatorios." });
    }

    if (!Array.isArray(movimientos) || movimientos.length < 1 || movimientos.length > 4) {
        return res.status(400).send({ movimientos: "Debe seleccionar entre 1 y 4 movimientos." });
    }

    const evs = [ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe];
    const ivs = [iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe];

    for (let ev of evs) {
        if (isNaN(ev) || ev < 0 || ev > 252) {
            return res.status(400).send({ evs: "Cada EV debe estar entre 0 y 252." });
        }
    }

    for (let ev of evs) {
        if (!Number.isInteger(ev) || ev < 0 || ev > 252) {
            return res.status(400).send({ evs: "Los EVs deben ser números enteros entre 0 y 252." });
        }
    }

    const totalEVs = evs.reduce((acc, val) => acc + val, 0);
    if (totalEVs > 508) {
        return res.status(400).send({ evs: "La suma total de EVs no puede superar 508." });
    }

    for (let iv of ivs) {
        if (isNaN(iv) || iv < 0 || iv > 31) {
            return res.status(400).send({ ivs: "Cada IV debe estar entre 0 y 31." });
        }
    }

    for (let iv of ivs) {
        if (!Number.isInteger(iv) || iv < 0 || iv > 31) {
            return res.status(400).send({ ivs: "Los IVs deben ser números enteros entre 0 y 31." });
        }
    }


    try {
        const [pokemon, naturaleza, item, habilidad, equipo] = await Promise.all([
            db.pokemon.findByPk(pokemonId),
            db.naturaleza.findByPk(naturalezaId),
            db.item.findByPk(itemId),
            db.habilidad.findByPk(habilidadId),
            db.equipo.findByPk(equipoId)
        ]);

        if (!pokemon || !naturaleza || !item || !habilidad || !equipo) {
            return res.status(404).send({ message: "Recurso relacionado no encontrado." });
        }

        if (equipo.usuarioId !== usuarioId) {
            return res.status(403).send({ message: "No puedes agregar Pokémon a equipos de otro usuario." });
        }

        const stats = calcularTodosLosStats(pokemon, {
            iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe,
            ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe
        }, naturaleza);

        const movimientosExistentes = await db.movimiento.findAll({
            where: { id: movimientos }
        });

        if (movimientosExistentes.length !== movimientos.length) {
            return res.status(400).send({ movimientos: "Uno o más movimientos no existen." });
        }

        const movimientosSet = new Set(movimientos);
        if (movimientosSet.size !== movimientos.length) {
            return res.status(400).send({ movimientos: "No se pueden repetir movimientos." });
        }

        const apodoExistente = await db.pokemonPersonalizado.findOne({
            where: {
                equipoId,
                apodo
            }
        });

        if (apodoExistente) {
            return res.status(400).send({ apodo: "Ya existe un Pokémon con ese apodo en este equipo." });
        }

        const repetido = await db.pokemonPersonalizado.findOne({
            where: {
                equipoId,
                pokemonId
            }
        });

        if (repetido) {
            return res.status(400).send({ message: "Ese Pokémon ya está en este equipo." });
        }

        const cantidadEnEquipo = await db.pokemonPersonalizado.count({
            where: { equipoId }
        });

        if (cantidadEnEquipo >= 6) {
            return res.status(400).send({ message: "No puedes agregar más de 6 Pokémon al equipo." });
        }


        const nuevoPokemonPersonalizado = await db.pokemonPersonalizado.create({
            apodo,
            pokemonId,
            equipoId,
            itemId,
            habilidadId,
            naturalezaId,
            ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe,
            iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe,
            stat_hp: stats.hp,
            stat_ataque: stats.atk,
            stat_defensa: stats.def,
            stat_ataque_especial: stats.spa,
            stat_defensa_especial: stats.spd,
            stat_velocidad: stats.spe
        });

        await nuevoPokemonPersonalizado.setMovimientos(movimientos);

        res.status(201).send(nuevoPokemonPersonalizado);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error al crear el Pokémon personalizado." });
    }
};

exports.listar = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario.id;

        const pokemonPersonalizado = await db.pokemonPersonalizado.findAll({
            include: [
                {
                    model: db.equipo,
                    as: "equipo",
                    where: {usuarioId},
                    attributes: ["id", "nombre"]
                },
                {
                    model: db.pokemon,
                    as: "pokemon",
                    attributes: ["id", "nombre", "imagen", "hp", "atk", "def", "spa", "spd", "spe"]
                },
                {
                    model: db.item,
                    attributes: ["id", "nombre"]
                },
                {
                    model: db.habilidad,
                    attributes: ["id", "nombre"]
                },
                {
                    model: db.naturaleza,
                    as: "naturaleza",
                    attributes: ["id", "nombre", "aumenta", "disminuye"]
                },
                {
                    model: db.movimiento,
                    attributes: ["id", "nombre"],
                    through: { attributes: [] }
                }
            ]
        });

        const resultado = pokemonPersonalizado.map(p => {
            const datos = p.toJSON();

            if (!datos.pokemon) {
                console.log("Error: datos.pokemon está vacío en ID:", datos.id);
            }

            if (!datos.naturaleza) {
                console.log("Error: datos.naturaleza está vacío en ID:", datos.id);
            }

            const statsFinales = calcularTodosLosStats(
                datos.pokemon,
                datos,
                datos.naturaleza
            );

            return {
                ...datos,
                statsFinales
            };
        });

        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send({message: "Error al obtener los pokemones personalizados"});
    }
};

exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemonPersonalizado = await db.pokemonPersonalizado.findByPk(id, {
            include: [
                {
                    model: db.pokemon,
                    as: "pokemon",
                    attributes: ["nombre", "imagen"]
                },
                {
                    model: db.item,
                    attributes: ["nombre"]
                },
                {
                    model: db.habilidad,
                    attributes: ["nombre"]
                },
                {
                    model: db.naturaleza,
                    as: "naturaleza",
                    attributes: ["nombre", "aumenta", "disminuye"]
                },
                { 
                    model: db.movimiento, 
                    attributes: ["nombre"], 
                    through: { attributes: [] } 
                },
                { 
                    model: db.equipo, 
                    as: "equipo",
                    attributes: ["usuarioId"] 
                }
            ]
        });

        if(!pokemonPersonalizado){
            return res.status(404).send({message: "Pokemon personalizado no encontrado"});
        }

        if(pokemonPersonalizado.equipo.usuarioId !== res.locals.usuario.id){
            return res.status(403).send({message: "No tienes permiso para acceder a ese recurso"});
        }

        const statsBase = await db.pokemon.findByPk(pokemonPersonalizado.pokemonId, {
            attributes: ["hp", "atk", "def", "spa", "spd", "spe"]
        });

        const naturaleza = pokemonPersonalizado.naturaleza;

        const statsFinales = calcularTodosLosStats(
            statsBase,
            pokemonPersonalizado,
            naturaleza
        );

        const resultado = pokemonPersonalizado.toJSON();

        resultado.statsFinales = statsFinales;

        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send({message: "Error al obtener el pokemon personalizado"});
    }
};

exports.actualizarTodo = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const { id } = req.params;

    const {
        apodo,
        pokemonId,
        equipoId,
        itemId,
        habilidadId,
        naturalezaId,
        movimientos,
        ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe,
        iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe
    } = req.body;

    if (!pokemonId || !equipoId || !naturalezaId || !itemId || !habilidadId) {
        return res.status(400).send({ message: "Faltan campos obligatorios." });
    }

    if (!Array.isArray(movimientos) || movimientos.length < 1 || movimientos.length > 4) {
        return res.status(400).send({ movimientos: "Debe seleccionar entre 1 y 4 movimientos." });
    }

    const evs = [ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe];
    const ivs = [iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe];

    for (let ev of evs) {
        if (!Number.isInteger(ev) || ev < 0 || ev > 252) {
            return res.status(400).send({ evs: "Cada EV debe ser un número entero entre 0 y 252." });
        }
    }

    const totalEVs = evs.reduce((acc, val) => acc + val, 0);
    if (totalEVs > 508) {
        return res.status(400).send({ evs: "La suma total de EVs no puede superar 508." });
    }

    for (let iv of ivs) {
        if (!Number.isInteger(iv) || iv < 0 || iv > 31) {
            return res.status(400).send({ ivs: "Cada IV debe ser un número entero entre 0 y 31." });
        }
    }

    try {
        const pokemonPersonalizado = await db.pokemonPersonalizado.findByPk(id);
        if (!pokemonPersonalizado) {
            return res.status(404).send({ message: "Pokémon personalizado no encontrado." });
        }

        const equipo = await db.equipo.findByPk(equipoId);
        if (!equipo || equipo.usuarioId !== usuarioId) {
            return res.status(403).send({ message: "No tienes permiso para modificar este Pokémon." });
        }

        const [pokemon, naturaleza, item, habilidad] = await Promise.all([
            db.pokemon.findByPk(pokemonId),
            db.naturaleza.findByPk(naturalezaId),
            db.item.findByPk(itemId),
            db.habilidad.findByPk(habilidadId)
        ]);

        if (!pokemon || !naturaleza || !item || !habilidad) {
            return res.status(404).send({ message: "Recurso relacionado no encontrado." });
        }

        const movimientosExistentes = await db.movimiento.findAll({
            where: { id: movimientos }
        });
        if (movimientosExistentes.length !== movimientos.length) {
            return res.status(400).send({ movimientos: "Uno o más movimientos no existen." });
        }

        const movimientosSet = new Set(movimientos);
        if (movimientosSet.size !== movimientos.length) {
            return res.status(400).send({ movimientos: "No se pueden repetir movimientos." });
        }

        const apodoExistente = await db.pokemonPersonalizado.findOne({
            where: {
                equipoId,
                apodo,
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if (apodoExistente) {
            return res.status(400).send({ apodo: "Ya existe un Pokémon con ese apodo en este equipo." });
        }

        const repetido = await db.pokemonPersonalizado.findOne({
            where: {
                equipoId,
                pokemonId,
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if (repetido) {
            return res.status(400).send({ message: "Ese Pokémon ya está en este equipo." });
        }

        const cantidadEnEquipo = await db.pokemonPersonalizado.count({
            where: {
                equipoId,
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if (cantidadEnEquipo >= 6) {
            return res.status(400).send({ message: "No puedes tener más de 6 Pokémon en el equipo." });
        }

        const stats = calcularTodosLosStats(pokemon, {
            iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe,
            ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe
        }, naturaleza);

        await pokemonPersonalizado.update({
            apodo,
            pokemonId,
            equipoId,
            itemId,
            habilidadId,
            naturalezaId,
            ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe,
            iv_hp, iv_atk, iv_def, iv_spa, iv_spd, iv_spe,
            stat_hp: stats.hp,
            stat_ataque: stats.atk,
            stat_defensa: stats.def,
            stat_ataque_especial: stats.spa,
            stat_defensa_especial: stats.spd,
            stat_velocidad: stats.spe
        });

        await pokemonPersonalizado.setMovimientos(movimientos);

        res.status(200).send(pokemonPersonalizado);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error al actualizar el Pokémon personalizado." });
    }
};

exports.actualizarUnoPorUno = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const { id } = req.params;
    const datos = req.body;

    try {
        const pokemonPersonalizado = await db.pokemonPersonalizado.findByPk(id);
        if (!pokemonPersonalizado) {
            return res.status(404).send({ message: "Pokémon personalizado no encontrado." });
        }

        const equipo = await db.equipo.findByPk(pokemonPersonalizado.equipoId);
        if (!equipo || equipo.usuarioId !== usuarioId) {
            return res.status(403).send({ message: "No tienes permiso para modificar este Pokémon." });
        }

        if (datos.apodo) {
            const apodoDuplicado = await db.pokemonPersonalizado.findOne({
                where: {
                    equipoId: pokemonPersonalizado.equipoId,
                    apodo: datos.apodo,
                    id: { [db.Sequelize.Op.ne]: id }
                }
            });
            if (apodoDuplicado) {
                return res.status(400).send({ apodo: "Ya existe un Pokémon con ese apodo en este equipo." });
            }
        }

        if (datos.pokemonId && datos.pokemonId !== pokemonPersonalizado.pokemonId) {
            const repetido = await db.pokemonPersonalizado.findOne({
                where: {
                    equipoId: pokemonPersonalizado.equipoId,
                    pokemonId: datos.pokemonId,
                    id: { [db.Sequelize.Op.ne]: id }
                }
            });
            if (repetido) {
                return res.status(400).send({ message: "Ese Pokémon ya está en este equipo." });
            }
        }

        if (datos.movimientos) {
            if (!Array.isArray(datos.movimientos) || datos.movimientos.length < 1 || datos.movimientos.length > 4) {
                return res.status(400).send({ movimientos: "Debe seleccionar entre 1 y 4 movimientos." });
            }

            const set = new Set(datos.movimientos);
            if (set.size !== datos.movimientos.length) {
                return res.status(400).send({ movimientos: "No se pueden repetir movimientos." });
            }

            const encontrados = await db.movimiento.findAll({ where: { id: datos.movimientos } });
            if (encontrados.length !== datos.movimientos.length) {
                return res.status(400).send({ movimientos: "Uno o más movimientos no existen." });
            }

            await pokemonPersonalizado.setMovimientos(datos.movimientos);
        }

        const evs = ['ev_hp', 'ev_atk', 'ev_def', 'ev_spa', 'ev_spd', 'ev_spe'];
        let totalEVs = 0;
        for (let campo of evs) {
            if (campo in datos) {
                const val = datos[campo];
                if (!Number.isInteger(val) || val < 0 || val > 252) {
                    return res.status(400).send({ evs: "Cada EV debe ser un número entero entre 0 y 252." });
                }
            }
        }

        const ivs = ['iv_hp', 'iv_atk', 'iv_def', 'iv_spa', 'iv_spd', 'iv_spe'];
        for (let campo of ivs) {
            if (campo in datos) {
                const val = datos[campo];
                if (!Number.isInteger(val) || val < 0 || val > 31) {
                    return res.status(400).send({ ivs: "Cada IV debe ser un número entero entre 0 y 31." });
                }
            }
        }

        const relaciones = [
            ['pokemonId', db.pokemon],
            ['itemId', db.item],
            ['habilidadId', db.habilidad],
            ['naturalezaId', db.naturaleza]
        ];

        for (let [campo, modelo] of relaciones) {
            if (campo in datos) {
                const existe = await modelo.findByPk(datos[campo]);
                if (!existe) {
                    return res.status(404).send({ message: `El recurso para ${campo} no existe.` });
                }
            }
        }

        const necesitaRecalcular =
            evs.some(campo => campo in datos) ||
            ivs.some(campo => campo in datos) ||
            datos.pokemonId || datos.naturalezaId;

        if (necesitaRecalcular) {
            const stats = calcularTodosLosStats(
                datos.pokemonId ? await db.pokemon.findByPk(datos.pokemonId) : await db.pokemon.findByPk(pokemonPersonalizado.pokemonId),
                {
                    iv_hp: datos.iv_hp ?? pokemonPersonalizado.iv_hp,
                    iv_atk: datos.iv_atk ?? pokemonPersonalizado.iv_atk,
                    iv_def: datos.iv_def ?? pokemonPersonalizado.iv_def,
                    iv_spa: datos.iv_spa ?? pokemonPersonalizado.iv_spa,
                    iv_spd: datos.iv_spd ?? pokemonPersonalizado.iv_spd,
                    iv_spe: datos.iv_spe ?? pokemonPersonalizado.iv_spe,
                    ev_hp: datos.ev_hp ?? pokemonPersonalizado.ev_hp,
                    ev_atk: datos.ev_atk ?? pokemonPersonalizado.ev_atk,
                    ev_def: datos.ev_def ?? pokemonPersonalizado.ev_def,
                    ev_spa: datos.ev_spa ?? pokemonPersonalizado.ev_spa,
                    ev_spd: datos.ev_spd ?? pokemonPersonalizado.ev_spd,
                    ev_spe: datos.ev_spe ?? pokemonPersonalizado.ev_spe
                },
                datos.naturalezaId
                    ? await db.naturaleza.findByPk(datos.naturalezaId)
                    : await db.naturaleza.findByPk(pokemonPersonalizado.naturalezaId)
            );

            datos.stat_hp = stats.hp;
            datos.stat_ataque = stats.atk;
            datos.stat_defensa = stats.def;
            datos.stat_ataque_especial = stats.spa;
            datos.stat_defensa_especial = stats.spd;
            datos.stat_velocidad = stats.spe;
        }

        await pokemonPersonalizado.update(datos);

        res.status(200).send(pokemonPersonalizado);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error al actualizar parcialmente el Pokémon personalizado." });
    }
};


exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = res.locals.usuario.id;

        const pokemon = await db.pokemonPersonalizado.findByPk(id, {
            include: { model: db.equipo, as: "equipo", attributes: ["usuarioId"] }
        });

        if (!pokemon) return res.status(404).send({ message: "Pokémon personalizado no encontrado" });
        if (pokemon.equipo.usuarioId !== usuarioId) return res.status(403).send({ message: "No tienes permiso para eliminar este Pokémon" });

        await pokemon.destroy();
        res.status(200).send({ message: "Pokémon personalizado eliminado con éxito" });
    } catch (error) {
        res.status(500).send({ message: "Error al eliminar el Pokémon personalizado" });
    }
};

