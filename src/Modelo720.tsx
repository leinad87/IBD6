import React from 'react';

import { Alert } from 'react-bootstrap';
import DropZone from "./dropzone720/DropZone";

export default function Modelo720Form() {

    return (
        <div className="content" >
            <Alert variant='warning'>
                <p className="container mb-0">⚠️ Este software puede tener errores, uselo bajo su responsabilidad.</p>
            </Alert>
            <div  className="container" >
                <DropZone />
                <p className="mt-5">Si quieres colaborar puedes hacerlo en <a target="_blank" href="https://github.com/leinad87/IBD6">https://github.com/leinad87/IBD6</a> o <a target="_blank" href="https://www.paypal.com/donate?business=RLT78EWATKNGU&amp;currency_code=EUR">invitándome a una cerveza</a></p>
            </div>
        </div >
    );
}