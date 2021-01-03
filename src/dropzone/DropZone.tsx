import React from 'react';
import { D6 } from '../aforix/D6';
import { Position } from '../aforix/Position';

import './DropZone.css';

const downloadTxtFile = (content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'application/aforixm' });
    element.href = URL.createObjectURL(file);
    element.download = "myfile.aforixm";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

// https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/
const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
}

const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
}

const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
}

const fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    var file = files[0]
    var data1 = file.text();
    data1.then((res) => {
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
                var data = line.split(",").map((x) => x.slice(1, -1))
                var position = new Position(
                    data[headers['ISIN']],
                    data[headers['Description']],
                    parseInt(data[headers['Quantity']]),
                    parseFloat(data[headers['PositionValue']]),
                    data[headers['CurrencyPrimary']]
                )
                aforix.add_position(position)
            }

        })
        var content = aforix.build();
        console.log(content)
        downloadTxtFile(content)
    })
}


const DropZone = () => {
    return (
        <div className="container">
            <div className="drop-container"

                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                >
                <div className="drop-message">
                    <div className="upload-icon"></div>
                    <p className="title">Arrastra aquí tu fichero csv con la consulta Flex</p>
                </div>
            </div>
        </div>
    )
}
export default DropZone;