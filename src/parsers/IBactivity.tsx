import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { parse } from 'papaparse';
import { Position } from '../aforix/Position';

const STATEMENT = "Statement";
const OPEN_POSITIONS = "Posiciones abiertas";
const INFO = "Información de instrumento financiero"
const ACCOUNT_INFO = "Información sobre la cuenta"


export default class InteractiveBrokersActivity {

    open_positions: Position[];
    data: any;

    constructor(file: string) {
        this.open_positions = [];
        this.data = {}
        this.parse(file)
    }

    getName() {
        return this.data[ACCOUNT_INFO]
                .filter((e:any) => e['Nombre del campo'] == "Nombre")[0]["Valor del campo"];
    }

    parse(file: string) {

        let groups = file.split("\n")
            .map((line) => [line.replace(/^\s+|\s+$/g, '').split(",")[0], line])
            .reduce((acc: any, val) => {
                let key = val[0];
                let line = val[1];

                if (key in acc)
                    acc[key] = acc[key] + "\n" + line
                else
                    acc[key] = line

                return acc
            }, {})


        for (var key in groups) {
            parse(groups[key], {
                header: true,
                complete: (result) => { groups[key] = result.data }
            })
        }

        this.data = groups;

        let info = groups[INFO].reduce((acc: any, val: any) => {
            acc[val["Símbolo"]] = {
                'Name': val["Descripción"],
                'ISIN': val["Id. de seguridad"]
            }
            return acc;
        }, {})
        var result = groups[OPEN_POSITIONS]
            .filter((row: any) => row['Header'] == 'Data')
            .map((item: any) => {
                item['ISIN'] = info[item["Símbolo"]]['ISIN']
                item['Name'] = info[item["Símbolo"]]['Name']
                return item;
            })

        this.open_positions = result.map((p: any) => {
            return new Position(p['ISIN'], p['Name'], p['Cantidad'], p['Valor'], p['Divisa'], 'Country', 0, 0)
        });
    }
}
