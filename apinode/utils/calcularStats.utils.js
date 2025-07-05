function calcularStat(base, iv, ev, naturaleza, stat) {
    const aumento = naturaleza.aumenta;
    const disminuye = naturaleza.disminuye;

    let modificador = 1.0;
    if (stat === aumento) modificador = 1.1;
    else if (stat === disminuye) modificador = 0.9;

    return Math.floor(
        (Math.floor((2 * base + iv + Math.floor(ev / 4)) * 100 / 100) + 5) * modificador
    );
}

function calcularHP(base, iv, ev) {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * 100) / 100) + 100 + 10;
}

function calcularTodosLosStats(pokemonBase, personalizado, naturaleza) {
    return {
        hp: calcularHP(pokemonBase.hp, personalizado.iv_hp, personalizado.ev_hp),
        atk: calcularStat(pokemonBase.atk, personalizado.iv_atk, personalizado.ev_atk, naturaleza, "atk"),
        def: calcularStat(pokemonBase.def, personalizado.iv_def, personalizado.ev_def, naturaleza, "def"),
        spa: calcularStat(pokemonBase.spa, personalizado.iv_spa, personalizado.ev_spa, naturaleza, "spa"),
        spd: calcularStat(pokemonBase.spd, personalizado.iv_spd, personalizado.ev_spd, naturaleza, "spd"),
        spe: calcularStat(pokemonBase.spe, personalizado.iv_spe, personalizado.ev_spe, naturaleza, "spe")
    };
}

module.exports = { calcularTodosLosStats };
