import { Position } from '../aforix/Position';
import InteractiveBrokersActivity from '../parsers/IBactivity'

export default class Builder720 {

    data: InteractiveBrokersActivity;
    DNI: string;
    total_value: number;
    broker_country: string;

    constructor(DNI: string, broker_country:string, data: InteractiveBrokersActivity) {
        this.DNI = DNI;
        this.data = data;
        this.total_value = 0.0;
        this.broker_country = broker_country;
    }


    build() {
        let positions = this.data.open_positions
            .map((position) => this.reg_detail(position))
            .join("\n")

        return ''.concat(
            this.reg_declarante(positions.length),
            "\n",
            positions
        );

    }

    reg_detail(position: Position) {
        let value_eur = position.value / this.data.forex[position.currency];
        this.total_value += value_eur;
        
        let year = new Date().getFullYear() - 1;

        return ''.concat(
            '2',
            '720',
            year.toString(),
            this.DNI.padStart(9, '0'), //DNI
            this.DNI.padStart(9, '0'), //DNI
            '         ',
            this.data.getName().padEnd(40, ' '),
            '1', // condicion declarante
            '                         ',
            'V',
            '1',
            '                         ',
            this.broker_country, // country of broker
            '1',
            position.ISIN.padEnd(12, ' '), //ISIN
            ' ',
            ''.padEnd(11, ' '),//BIC
            ''.padEnd(34, ' '), //Account
            position.description.padEnd(41, ' '), // Identificacion de la identidad
            ''.padEnd(20, ' '), // Numero identificación fiscal
            ''.padEnd(162, ' '), // DOMICILIO DE LA ENTIDAD O UBICACIÓN DEL INMUEBLE
            position.ISIN.slice(0,2), // country of broker
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
        let year = new Date().getFullYear() - 1;

        return ''.concat(
            '1',
            '720',
            year.toString(),
            this.DNI.padStart(9, '0'), //DNI
            this.data.getName().padEnd(40, ' '),
            'T',
            '669696969',
            this.data.getName().padEnd(40, ' '),
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