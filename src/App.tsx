import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import DropZone from "./dropzone/DropZone";
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
      <header className="App-header">

        <div className="content">
          <p className="info">
            Crea en InteractiveBrokers una nueva consulta flex con las siguientes secciones y campos:
          <ul>Posiciones Abiertas
          <ul><li>Symbol 	</li>
                <li>Description</li>
                <li>ISIN</li>
                <li>Quantity</li>
                <li>Multiplier</li>
                <li>Position Value</li>
                <li>Mark Price</li>
                <li>Currency</li></ul></ul>

                AVISO: Este software puede tener errores, uselo bajo su responsabilidad.
          </p>
          <DropZone />
        </div>
      </header>
      
      </div>
  );

}
export default App;
