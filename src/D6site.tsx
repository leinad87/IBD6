import React from 'react';

import { Button, Alert, Card, Navbar, Nav, Container, Toast, Image } from 'react-bootstrap';
import DropZone from "./dropzone/DropZone";

export default function D6site() {

    const [fileSelected, setFileSelected] = React.useState<File>() // also tried <string | Blob>

    const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;

        if (!fileList) return;

        setFileSelected(fileList[0]);
    };


    const uploadFile = function (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        if (fileSelected) {
            const formData = new FormData();
            formData.append("image", fileSelected, fileSelected.name);
        }
    };


    return (

        <div className="content" >
            <Alert variant='warning'>⚠️ Este software puede tener errores, uselo bajo su responsabilidad.</Alert>

            <DropZone />

            <p className="mt-5">Si quieres colaborar puedes hacerlo en <a target="_blank" href="https://github.com/leinad87/IBD6">https://github.com/leinad87/IBD6</a> o <a target="_blank" href="https://www.paypal.com/donate?business=RLT78EWATKNGU&amp;currency_code=EUR">invitándome a una cerveza</a></p>

            <Card className="mt-5">
                <Card.Body><p className="info">
                    Crea en InteractiveBrokers una nueva consulta flex con las sección <b>Posiciones Abiertas</b> y campos:
              <ul className="info">
                        <li>Symbol</li>
                        <li>Description</li>
                        <li>ISIN</li>
                        <li>Quantity</li>
                        <li>Multiplier</li>
                        <li>Position Value</li>
                        <li>Mark Price</li>
                        <li>Currency</li>
                    </ul>
              Ejecuta la consulta con el perido <b>Mes pasado</b> y format <b>CSV</b>. Guarda el fichero y arrastreloo para generar el informe D6.
              </p>
                </Card.Body>
            </Card>

        </div >
    );
}