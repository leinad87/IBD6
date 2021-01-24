import React from 'react';
import { Form, Alert, Row, Col, Table, Pagination, Button, Image } from 'react-bootstrap';

import InteractiveBrokersActivity from '../../parsers/IBactivity';
import Modelo720 from '../../builder/modelo720'
import './DropZone.css';

import countries from '../../static/countries.json'
import { Position } from '../../aforix/Position';

export default class DropZone extends React.Component {

    data: InteractiveBrokersActivity | null = null

    state = {
        dni: '',
        text: '',
        broker_country: '',
        eurusd: '',
        filename: '',
        active_page: 1
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
        this.uploadFile(e.dataTransfer.files);
    }

    onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.uploadFile(e!.target!.files!);
    };

    uploadFile(files: any) {

        var promises = [];
        for (var i = 0; i < files.length; i++) {
            this.setState({ filename: files[i].name });
            promises.push(files[i].text())
        }

        Promise.all(promises)
            .then((file_texts) => {
                this.data = new InteractiveBrokersActivity(file_texts[0]);
            }).then(() => {
                this.setState({ text: 'ok' })
            })


    }

    displayForex() {
        const items = [];

        if (this.data != null) {
            for (var key in this.data.forex) {
                items.push(<Form.Group>
                    <Form.Label>EUR{key}</Form.Label>
                    <Form.Control placeholder={this.data!.forex[key].toFixed(4)}
                        value={this.state.eurusd}
                        onChange={e => this.setState({ eurusd: e.target.value })} />
                    <Form.Text className="text-muted">
                        Valor calculado a partir del informe subido
                    </Form.Text>
                </Form.Group>)
            }
        }

        return items;
    }



    displayElements() {

        if (this.data == null) { return }
        console.log(this.data?.open_positions)
        let items = this.data!.open_positions!.map((item: Position, index: number) => {
            return (

                <tr>
                    <td>{index + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.ISIN}</td>
                    <td>{item.count}</td>
                    <td>{item.value}{item.currency}</td>
                    <td>{(item.value * this.data!.forex[item.currency]).toFixed(2)}EUR</td>
                </tr>
            )
        });

        let items_pagination = [];
        for (let number = 1; number <= ((items.length) / 10) + 1; number++) {
            items_pagination.push(
                <Pagination.Item key={number} active={number === this.state.active_page} onClick={() => this.setState({ active_page: number })}>
                    {number}
                </Pagination.Item>,
            );
        }
        return (
            <div>
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>ISIN</th>
                            <th>Cuenta</th>
                            <th>Valor</th>
                            <th>Valor en euros</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.slice((this.state.active_page - 1) * 10, this.state.active_page * 10)}
                    </tbody>
                </Table>
                <Pagination size="sm">{items_pagination}</Pagination>
            </div>
        )
    }

    render() {
        return (
            <div className=""
                onDragOver={this.dragOver}
                onDragEnter={this.dragEnter}
                onDragLeave={this.dragLeave}
                onDrop={this.fileDrop}>

                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>DNI</Form.Label>
                        <Form.Control placeholder="12345678Z" value={this.state.dni}
                            onChange={e => this.setState({ dni: e.target.value })} />
                    </Form.Group>

                    <Form.Group controlId="broker">
                        <Form.Label>País del broker</Form.Label>
                        <Form.Control value={this.state.broker_country}
                            onChange={e => this.setState({ broker_country: e.target.value })} as="select" >
                            <option value=''></option>
                            {countries.map((c) => {
                                return <option value={c['code']}>{c['text'].slice(0, 120)}{(c['text'].length > 120) ? '...' : ''}</option>
                            })}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Informe anual Interacive Brokers</Form.Label>
                        <Form.File onChange={this.onFileChange}
                            id="custom-file"
                            label={this.state.filename}
                            custom
                        />
                    </Form.Group>
                    {this.displayForex()}
                    {this.displayElements()}

                </Form>

                {this.state.text.length > 0 ?
                    (<Alert variant="dark" className="mt-3">{this.state.text}</Alert>) : null
                }


                {this.data ?
                    <Button onClick={() => this.downloadTxtFile(this.state.dni, new Modelo720(this.state.dni, this.state.broker_country, this.data!)!.build())}>Descargar</Button>
                    : null
                }
            </div>
        )
    }
}
