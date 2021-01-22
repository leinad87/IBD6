import React from 'react';

import { Alert, Container, Row, Col } from 'react-bootstrap';
import DropZone from "./dropzone720/DropZone";

export default function Modelo720Form() {

    return (
        <div>
            <Alert variant='warning'>⚠️ Este software puede tener errores, uselo bajo su responsabilidad.</Alert>
            <div  className="" >
            <Container fluid>
            <Row>
    <Col><DropZone />
                <p className="mt-5">Si quieres colaborar puedes hacerlo en <a target="_blank" href="https://github.com/leinad87/IBD6">https://github.com/leinad87/IBD6</a> o <a target="_blank" href="https://www.paypal.com/donate?business=RLT78EWATKNGU&amp;currency_code=EUR">invitándome a una cerveza</a></p></Col>
  </Row>
</Container>
                
            </div>
        </div >
    );
}