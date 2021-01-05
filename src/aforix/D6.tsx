import { ReactElement, createElement } from "react";

import { Position } from "./Position"

const ReactDOMServer = require("react-dom/server");

const campo = (code: number, value: any) => {
    var codigo = createElement('Codigo', null, code.toString(16).toUpperCase())
    var datos = createElement('Datos', null, value)
    var campo = createElement('Campo', null, [codigo, datos])

    return campo
}

export class D6 {

    positions: Position[]

    constructor() {
        this.positions = []
    }

    add_position(position: Position) {
        this.positions.push(position)
    }

    format_number(number: number, decimals: number) {
        return number.toLocaleString('es-ES', { minimumFractionDigits: decimals })
    }

    build_page(page_position: number, positions: Position[]) {
        var tipo = createElement('Tipo', null, page_position == 1 ? 'D61' : 'D62')

        var first_field_code = page_position == 1 ? 0x2E9 : 0x327;

        var campos: ReactElement[] = []
        campos.push(campo(page_position == 1 ? 0x2DB : 0x320, "D"))
        campos.push(campo(page_position == 1 ? 0x2DC : 0x321, 2020))

        positions.forEach((pos, idx) => {
            campos.push(campo(first_field_code - 1, "N"))
            campos.push(campo(first_field_code, pos.ISIN))
            campos.push(campo(first_field_code + 1, pos.description))
            if (pos.emisor > 0)
                campos.push(campo(first_field_code + 2, pos.emisor))
            if (pos.valor > 0)
                campos.push(campo(first_field_code + 3, String(pos.valor).padStart(2, '0')))

            if (pos.country.length > 0)
                campos.push(campo(first_field_code + 4, pos.country))
            campos.push(campo(first_field_code + 5, pos.currency))
            campos.push(campo(first_field_code + 6, this.format_number(pos.count, 0)))
            campos.push(campo(first_field_code + 8, this.format_number(pos.value, 2)))

            first_field_code = first_field_code + 0xC;
        })

        var campos_node = createElement('Campos', null, campos)

        var page = createElement('Pagina', null, [tipo, campos_node])

        return page
    }

    build() {
        var tipo = createElement('Tipo', null, 'D-6')
        var version = createElement('Version', null, 'R10')

        var pages = 0;

        var idx = 0;
        var content = [tipo, version]
        console.log("Building aforix file with " + this.positions.length + " elements")
        while (idx < this.positions.length) {
            console.log("Adding page " + pages)
            const page_size: number = (pages == 0 ? 3 : 6);
            content.push(this.build_page(pages + 1, this.positions.slice(idx, idx + page_size)))

            idx = idx + page_size;
            pages = pages + 1;
        }

        var root = createElement('Formulario', null, content) // Root element

        var xml = ReactDOMServer.renderToStaticMarkup(root);
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml;

    }

}


