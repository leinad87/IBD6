import { Position } from '../aforix/Position';

const ISIN = 'Symbol/ISIN';
const NAME = 'Producto'
const COUNT = 'Cantidad'
const PRICE = 'Precio de'
const VALUE = 'Valor local'
const VALUE_EUR = 'Valor en EUR'

export default class DegiroParser {
    static parse(file: string, default_pais: string, default_emisor: number, default_valor: number, holders: number): Position[] {
        var headers: { [key: string]: number };
        var positions: Position[] = [];
        var re = /"(\d+),(\d+)"/g

        file.split("\n").forEach((line) => {
            if (line.includes("ISIN")) {
                headers = DegiroParser.getHeaders(line)
            } else if (line.length > 0) {
                // remove quotes
                var data = line.replaceAll(re, "$1.$2").split(",")
                console.log(data)
                if (!data[headers[NAME]].includes("CASH")) {
                    var { value, currency } = DegiroParser.getCurrencyValue(data[headers[VALUE]]);
                    positions.push(new Position(
                        data[headers[ISIN]],
                        data[headers[NAME]],
                        parseInt(data[headers[COUNT]]),
                        value,
                        currency,
                        default_pais,
                        default_valor,
                        default_emisor
                    ))
                }
            }
        })

        return positions;
    }

    static getHeaders(line: string): { [key: string]: number } {
        var result: { [key: string]: number } = {}

        line.split(",").forEach((val, idx) => {
            result[val] = idx
        })

        return result;
    }

    static getCurrencyValue(price: string) {
        var value: number;
        var currency: string;

        var data = price.split(" ");
        value = parseFloat(data[1]);
        currency = data[0];

        return {
            value: value,
            currency: currency
        }
    }
}