import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Alert, Card, Navbar, Container, Toast, Image } from 'react-bootstrap';
import DropZone from "./dropzone/DropZone";
import GitHub_Logo_White from './images/GitHub_Logo_White.png';

function App() {


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

  const [show, setShow] = React.useState(true);

  return (
    <div className="App">
      <Navbar bg="dark" sticky="top">
        <Container>
          <a href="https://github.com/leinad87/IBD6"><Image src={GitHub_Logo_White} width="100px" /></a>
        </Container>
      </Navbar >
      <header className="App-header">
        <div className="content">
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

        </div>
      </header>

      <Alert variant="dark" show={show} className="ml-3 fixed-bottom " style={{ right: "auto" }}>
        <p>Este sitio web usa cookies de Google para ofrecer sus servicios y analizar el tráfico.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button className="mr-3" variant="info" href="https://policies.google.com/technologies/cookies" about="_blank">
            Más información
          </Button>
          <Button variant="success" onClick={() => setShow(false)}>
            Vale!
          </Button>
        </div>
      </Alert>
    </div>
  );

}
export default App;
