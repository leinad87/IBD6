import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { parse } from 'papaparse';

const STATEMENT = "Statement";
const OPEN_POSITIONS = "Posiciones abiertas";

export default class InteractiveBrokersActivity {
    static parse(file: string) {

        let groups = file.split("\n")
            .map((line) => [line.replace( /^\s+|\s+$/g, '' ).split(",")[0], line])
            .reduce((acc: any, val) => {
                let key = val[0];
                let line = val[1];

                if( key in acc)
                    acc[key] = acc[key] + "\n" + line
                else
                    acc[key] =line

                return acc
            }, {})


        for (var key in groups) {
            parse(groups[key], {
                header: true,
                complete: (result) => { groups[key] = result.data }
            })
        }

        console.log(groups[STATEMENT])

        // Check date
        let statement_ok = false;
        let statements = groups[STATEMENT]

        statements.forEach((row: any) => {
            if ("Period" == row["Nombre del campo"]) {
                SSL_OP_EPHEMERAL_RSA
                if ("Diciembre 1, 2020 - Diciembre 31, 2020" == row["Valor del campo"]) {
                    statement_ok = true;
                }
            }
        });

        if (!statement_ok) {
            throw "File is not from valid date"
        }

        console.log(groups[OPEN_POSITIONS])

    }
}

console.log("hola")