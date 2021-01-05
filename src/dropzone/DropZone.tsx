import React from 'react';
import { Form, Alert, Row, Col, Container, Image } from 'react-bootstrap';
import { D6 } from '../aforix/D6';
import { Position } from '../aforix/Position';

import './DropZone.css';

export default class DropZone extends React.Component {

    state = {
        text: '',
        default_valor: -1,
        default_emisor: -1,
        default_pais: '',
    }


    downloadTxtFile = (content: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'application/aforixm' });
        element.href = URL.createObjectURL(file);
        element.download = "myfile.aforixm";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    // https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/
    dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        var file = files[0]
        var data1 = file.text();


        data1.then((res) => {
            var total_ammount: { [key: string]: number } = {}
            var aforix = new D6()

            var headers: { [key: string]: number } = {};

            var skip = true;
            res.split("\n").forEach((line) => {
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

                    var position = new Position(
                        data[headers['ISIN']],
                        data[headers['Description']],
                        count,
                        value,
                        currency,
                        this.state.default_pais,
                        this.state.default_valor,
                        this.state.default_emisor
                    )

                    aforix.add_position(position)

                    // Sum the value of the position to summary
                    var tmp = total_ammount[currency] || 0;
                    total_ammount[currency] = tmp + value
                    console.log(total_ammount)

                }

            })
            var content = aforix.build();
            this.downloadTxtFile(content);

            var total_ammount_str = '';
            for (var key in total_ammount) {
                total_ammount_str = total_ammount_str + ` ${key}: ${total_ammount[key].toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
            }

            this.setState({ text: `Se han encontrado ${aforix.positions.length} posiciones abiertas con un valor total de ${total_ammount_str}` });

        })
    }


    render() {
        return (
            <div className="container">

                <div className="mb-3">
                    <Form>
                        <Row>
                            Si lo desea, elija los valores por defecto para el emisor, valor y pais de cada posición.
                        </Row>
                        <Row>
                            <Col xs lg="4">
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>7. Emisor</Form.Label>
                                    <Form.Control as="select"
                                        value={this.state.default_emisor}
                                        onChange={e => this.setState({ default_emisor: e.target.value })}>
                                        <option value={-1}>- Ninguna</option>
                                        <option value={100}>100. Organismos internacionales de carácter multilateral, para emisores no residentes</option>
                                        <option value={200}>200. Administraciones Públicas y Corporaciones Regionales y Locales, para emisores no residentes</option>
                                        <option value={300}>300. Entidades financieras (sector público y sector privado), para emisores no residentes</option>
                                        <option value={400}>400. Entidades no financieras (sector público y sector privado), para emisores no residentes</option>
                                        <option value={500}>500. Organismos internacionales de carácter multilateral, para emisores residentes</option>
                                        <option value={600}>600. Administraciones Públicas y Corporaciones Regionales y Locales, para emisores residentes</option>
                                        <option value={700}>700. Entidades financieras (sector público y sector privado), para emisores residentes</option>
                                        <option value={800}>800. Entidades no financieras (sector público y sector privado), para emisores residentes</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col xs lg="4">
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                    <Form.Label>8. Valor</Form.Label>
                                    <Form.Control as="select"
                                        value={this.state.default_valor}
                                        onChange={e => this.setState({ default_valor: e.target.value })}>
                                        <option value={-1}>- Ninguna</option>
                                        <option value={0}>00. Derechos de suscripción y otros derechos análogos</option>
                                        <option value={1}>01. Acciones con derecho a voto</option>
                                        <option value={2}>02. Acciones sin derecho a voto</option>
                                        <option value={3}>03. Participaciones en forndos de inversión</option>
                                        <option value={5}>05. Deuda a largo plazo emitida por Administraciones Públicas, Corporaciones Regionales y Locales</option>
                                        <option value={6}>06. Otra deuda a largo plazo no convertible en acciones</option>
                                        <option value={7}>07. Otra deuda a largo plazo convertible en acciones</option>
                                        <option value={10}>10. Deuda a corto plazo emitida por Administraciones Públicas, Corporaciones Regionales y Locales</option>
                                        <option value={11}>11. Otra deuda a corto plazo</option>
                                        <option value={41}>41. Otros valores y derechos</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col xs lg="4">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>9.Pais</Form.Label>
                                    <Form.Control placeholder="Ejemplo: US"
                                        value={this.state.default_pais}
                                        onChange={e => this.setState({ default_pais: e.target.value })} />
                                </Form.Group>
                            </Col>

                        </Row>
                    </Form>
                </div>

                <div className="drop-container"

                    onDragOver={this.dragOver}
                    onDragEnter={this.dragEnter}
                    onDragLeave={this.dragLeave}
                    onDrop={this.fileDrop}
                >
                    <div className="drop-message">
                        <div className="upload-icon"></div>
                        <p className="title">Arrastra aquí tu fichero csv con la consulta Flex</p>
                    </div>
                </div>
                {this.state.text.length > 0 ?
                    (<Alert variant="dark" className="mt-3">{this.state.text}</Alert>) : null
                }
            </div>
        )
    }
}
