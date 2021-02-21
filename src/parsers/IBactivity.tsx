import { parse } from 'papaparse';
import { Position } from '../aforix/Position';

type HeadersType = {
    STATEMENT: string,
    OPEN_POSITIONS: string,
    INFO: string,
    ACCOUNT_INFO: string,
    FIELD_NAME: string,
    NAME: string,
    FIELD_VALUE: string,
    SYMBOL: string,
    DESCRIPTION: string,
    SECURITY_ID: string,
    TOTAL: string,
    CURRENCY: string,
    VALUE: string,
    QUANTITY: string,
    COUNTRY: string,
}

const ES: HeadersType = {
    STATEMENT: "Statement",
    OPEN_POSITIONS: "Posiciones abiertas",
    INFO: "Información de instrumento financiero",
    ACCOUNT_INFO: "Información sobre la cuenta",
    FIELD_NAME: "Nombre del campo",
    NAME: "Nombre",
    FIELD_VALUE: "Valor del campo",
    SYMBOL: "Símbolo",
    DESCRIPTION: "Descripción",
    SECURITY_ID: "Id. de seguridad",
    TOTAL: "Total",
    CURRENCY: "Divisa",
    VALUE: "Valor",
    QUANTITY: "Cantidad",
    COUNTRY: "País",
}

const EN: HeadersType = {
    STATEMENT: "Statement",
    OPEN_POSITIONS: "Open Positions",
    INFO: "Financial Instrument Information",
    ACCOUNT_INFO: "Account Information",
    FIELD_NAME: "Field Name",
    NAME: "Name",
    FIELD_VALUE: "Field Value",
    SYMBOL: "Symbol",
    DESCRIPTION: "Description",
    SECURITY_ID: "Security ID",
    TOTAL: "Total",
    CURRENCY: "Currency",
    VALUE: "Value",
    QUANTITY: "Quantity",
    COUNTRY: "Country",
}

export default class InteractiveBrokersActivity {
    open_positions: Position[];
    data: any;
    forex: { [name: string]: number };
    lang: HeadersType;

    constructor(file: string) {
        this.open_positions = [];
        this.data = {}
        this.forex = { 'EUR': 1 }

        this.lang = this.detectLanguage(file);

        this.parse(file)
    }

    getName() {
        return this.data[this.lang.ACCOUNT_INFO]
            .filter((e: any) => e[this.lang.FIELD_NAME] == this.lang.NAME)[0][this.lang.FIELD_VALUE];
    }

    detectLanguage(file: string) {
        let firstLine = file.split("\n")[0];
        console.log(firstLine)
        if (firstLine === "Statement,Header,Nombre del campo,Valor del campo")
            return ES;
        else if (firstLine === "Statement,Header,Field Name,Field Value")
            return EN;
        else
            throw "language not detected";
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

        let info = groups[this.lang.INFO].reduce((acc: any, val: any) => {
            acc[val[this.lang.SYMBOL]] = {
                'Name': val[this.lang.DESCRIPTION],
                'ISIN': val[this.lang.SECURITY_ID]
            }
            return acc;
        }, {})
        var result = groups[this.lang.OPEN_POSITIONS]
            .filter((row: any) => row['Header'] == 'Data')
            .map((item: any) => {
                item['ISIN'] = info[item[this.lang.SYMBOL]]?.['ISIN'] ?? ''
                item['Name'] = info[item[this.lang.SYMBOL]]?.['Name'] ?? ''
                return item;
            })

        this.open_positions = result.map((p: any) => {
            return new Position(p['ISIN'], p['Name'], p[this.lang.QUANTITY], p[this.lang.VALUE], p[this.lang.CURRENCY], '', 0, 0)
        });

        groups[this.lang.OPEN_POSITIONS]
            .filter((row: any) => row['Header'] == 'Total')
            .map((row: any, position: number, elements: any) => {
                if (row[this.lang.CURRENCY] != 'EUR') {
                    this.forex[row[this.lang.CURRENCY]] = row[this.lang.VALUE] / elements[position + 1][this.lang.VALUE]
                }
            })
    }
}
