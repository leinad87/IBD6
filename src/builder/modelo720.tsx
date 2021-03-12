import { Position } from '../aforix/Position';
import IParser from '../parsers/IParser';

var _ = require('lodash');

export default class Builder720 {

    data: IParser[];
    DNI: string;
    total_value: number;
    forex: { [name: string]: number } = {};
    name: string;

    constructor(DNI: string, name: string, data: IParser[]) {
        this.DNI = DNI;
        this.data = data;
        this.total_value = 0.0;
        this.name = name;

        data.forEach(i => this.forex = _.merge(this.forex, i.forex));
    }


    build() {
        let positions = this.data.flatMap(i => i.open_positions
            .map((position) => this.reg_detail(position)))
            .join("\n")

        return ''.concat(
            this.reg_declarante(positions.length),
            "\n",
            positions
        );

    }

    reg_detail(position: Position) {
        let value_eur = position.value / this.forex[position.currency];
        this.total_value += value_eur;

        return ''.concat(
            '2',
            '720',
            '2020', // year
            this.DNI.padStart(9, '0'), //DNI
            this.DNI.padStart(9, '0'), //DNI
            '         ',
            this.name.padEnd(40, ' '),
            '1', // condicion declarante
            '                         ',
            'V',
            '1',
            '                         ',
            position.broker_country.padEnd(2, ' '), // country of broker
            '1',
            position.ISIN.padEnd(12, ' '), //ISIN
            ' ',
            ''.padEnd(11, ' '),//BIC
            ''.padEnd(34, ' '), //Account
            position.description.padEnd(41, ' '), // Identificacion de la identidad
            ''.padEnd(20, ' '), // Numero identificación fiscal
            ''.padEnd(162, ' '), // DOMICILIO DE LA ENTIDAD O UBICACIÓN DEL INMUEBLE
            position.ISIN.slice(0, 2).padEnd(2, ' '), // country of broker
            '00000000', // FECHA DE INCORPORACIÓN
            'A', // A o M: ORIGEN DEL BIEN O DERECHO
            '00000000', //424 - 431 Numérico  FECHA DE EXTINCIÓN
            // Valor 31 diciembre
            value_eur > 0 ? ' ' : 'N',
            Math.round(value_eur * 100).toString().padStart(14, '0'), // EUROS
            // Valor medio
            true ? ' ' : 'N',
            Math.round(0 * 100).toString().padStart(14, '0'), // EUROS
            'A', //CLAVE DE REPRESENTACIÓN DE VALORES
            Math.round(position.count * 100).toString().padStart(12, '0'), // NÚMERO DE VALORES
            ' ', //CLAVE TIPO DE BIEN INMUEBLE
            Math.round(100 * 100).toString().padStart(5, '0'), //PORCENTAJE DE PARTICIPACIÓN
            ''.padEnd(20, ' ') // white spaces
        );
    }

    reg_declarante(count: number) {
        return ''.concat(
            '1',
            '720',
            '2020', // year
            this.DNI.padStart(9, ' '), //DNI
            this.name.padEnd(40, ' '),
            'T',
            '666666666', //Phone,
            this.name.padEnd(40, ' '),
            '720'.padEnd(13, '0'),
            ' ', // Complementaria
            ' ', // Substitutiva
            ''.padEnd(13, '0'),
            count.toString().padStart(9, '0'), // Count
            // Valor 31 diciembre
            this.total_value > 0 ? ' ' : 'N',
            Math.round(this.total_value * 100).toString().padStart(17, '0'), // EUROS
            // Valor medio
            true ? ' ' : 'N',
            Math.round(0 * 100).toString().padStart(17, '0'), // EUROS
            ''.padEnd(320, ' ') // white spaces

        )
    }
}