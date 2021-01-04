import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Alert, Card, Navbar, Container, Image } from 'react-bootstrap';
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


  return (
    <div className="App">
      <Navbar bg="dark" sticky="top">
        <Container>
          <a href="https://github.com/leinad87/IBD6"><Image src={GitHub_Logo_White} width="100px"/></a>
        </Container>
      </Navbar >
      <header className="App-header">
        <div className="content">
          <Alert variant='warning'>⚠️ Este software puede tener errores, uselo bajo su responsabilidad.</Alert>

          <DropZone />

          <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&amp;p=13&amp;l=ez&amp;f=ifr&amp;linkID=7765fbe0e479f8f3ad9e7791a36a6604&amp;t=leinad87-21&amp;tracking_id=leinad87-21"
            width="468" height="60" scrolling="no"
            style={{ border: "none", margin: 10 }}></iframe>

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
    </div>
  );

}
export default App;
