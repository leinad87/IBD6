import { isMetaProperty } from 'typescript';
import { Position } from '../aforix/Position';

export default class InteractiveBrokersParser {
    static parse(file: string, default_pais: string, default_emisor: number, default_valor: number, holders: number) {

        var headers: { [key: string]: number } = {};
        var skip = true;
        var positions: Position[] = [];

        file.split("\n").forEach((line) => {
            if (line.includes("ISIN")) {
                skip = false
                line.split(",").forEach((val, idx) => {
                    headers[val.slice(1, -1)] = idx;
                })
            } else if (!skip && line.length > 0) {
                var data = line.split(",").map((x) => x.slice(1, -1));

                var count = parseInt(data[headers['Quantity']]);
                var value = parseFloat(data[headers['PositionValue']]);
                var currency = data[headers['CurrencyPrimary']];

                positions.push(new Position(
                    data[headers['ISIN']],
                    data[headers['Description']],
                    count,
                    value,
                    currency,
                    default_pais,
                    default_valor,
                    default_emisor
                ))
            }
        })

        return positions;
    }
}