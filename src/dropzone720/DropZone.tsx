import React from 'react';
import { Form, Alert, Row, Col, Accordion, Card, Button, Image } from 'react-bootstrap';

import InteractiveBrokersActivity from '../parsers/IBactivity';
import Modelo720 from '../builder/modelo720'
import './DropZone.css';

import countries from '../static/countries.json'

export default class DropZone extends React.Component {

    state = {
        dni: '',
        text: '',
        broker_country: '',
   }


    downloadTxtFile = (name: string, content: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'application/aforixm' });
        element.href = URL.createObjectURL(file);
        element.download = `${name}.720`;
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

        var promises = [];
        for (var i = 0; i < files.length; i++) {
            promises.push(files[i].text())
        }

        Promise.all(promises).then((file_texts) => {
            console.log(file_texts)
            let data = new InteractiveBrokersActivity(file_texts[0]);
            console.log(data)
            let modelo720 = new Modelo720(this.state.dni, this.state.broker_country, data).build()

            this.setState({ text: "ok" });

            this.downloadTxtFile(this.state.dni, modelo720)
        })
    }


    render() {
        return (
            <div className="container">

                <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>DNI</Form.Label>
                    <Form.Control placeholder="12345678Z"  value={this.state.dni}
                    onChange={e => this.setState({ dni: e.target.value })}/>
                </Form.Group>

                <Form.Group controlId="broker">
                    <Form.Label>País del broker</Form.Label>
                    <Form.Control value={this.state.broker_country}
                    onChange={e => this.setState({ broker_country: e.target.value })}  as="select" >
                        <option value=''></option>
                    {countries.map((c)=>{
                        return <option value={c['code']}>{c['text'].slice(0, 120)}{(c['text'].length>120)?'...':''}</option>
                    })}
                    </Form.Control>
                </Form.Group>

                </Form>

                <div className="drop-container"

                    onDragOver={this.dragOver}
                    onDragEnter={this.dragEnter}
                    onDragLeave={this.dragLeave}
                    onDrop={this.fileDrop}
                >
                    <div className="drop-message">
                        <div className="upload-icon"></div>
                        <p className="title">Arrastra aquí tu fichero csv con la consulta Flex para generar 720</p>
                    </div>
                </div>
                
                {this.state.text.length > 0 ?
                    (<Alert variant="dark" className="mt-3">{this.state.text}</Alert>) : null
                }
            </div>
        )
    }
}
