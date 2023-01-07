import React, {Component} from 'react';

import { Alert } from 'react-bootstrap';
import DropZone from "./modelo720/DropZone";
import DropZoneD6 from "./modeloD6/DropZone"

import {
    BrowserRouter as Router,
    Routes,
    Route,
    useMatch
  } from "react-router-dom";

export default function Modelo(){

        
    let match = useMatch("*");
    return (
        <div >
            <Alert variant='warning'>
                <p className="container mb-0">⚠️ Este software puede tener errores, uselo bajo su responsabilidad.</p>
            </Alert>
            <div  className="container" > 
            
            <Routes>
                <Route path={`720`} element={<DropZone />}/>
                <Route path={`D6`}  element={<DropZoneD6 />}/>
            </Routes>
                
            <p className="mt-5">Si quieres colaborar puedes hacerlo en <a target="_blank" href="https://github.com/leinad87/IBD6">https://github.com/leinad87/IBD6</a> o <a target="_blank" href="https://paypal.me/leinad87">invitándome a un café.</a></p>
            </div>
 
        </div >
    );

}
