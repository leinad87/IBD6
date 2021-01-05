import React from 'react';
import { Button, Alert, Card, Navbar, Container, Image } from 'react-bootstrap';
import { D6 } from '../aforix/D6';
import { Position } from '../aforix/Position';

import './DropZone.css';

export default class DropZone extends React.Component<{}, { text: string }> {

    constructor(props: any) {
        super(props);
        this.state = { text: '' }
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
                        currency
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
