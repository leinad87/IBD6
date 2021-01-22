import React from 'react';
import './App.css';
import { Button, Alert, Navbar, Nav, Container, Image, Badge } from 'react-bootstrap';
import GitHub_Logo_White from './images/GitHub_Logo_White.png';
import D6site from './D6site'
import Modelo720Form from './Modelo720'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { useCookies } from 'react-cookie';

function App() {

  const [cookies, setCookie] = useCookies(['acceptCookies']);

  const acceptCookies = () => {
    setCookie('acceptCookies', true, { path: '/' });
  }

  return (
    <div className="App">
      <Router>
        <Navbar bg="dark" sticky="top" variant="dark">
          <Container>
            <Nav className="mr-auto">
              <Nav.Link href="/D6">Modelo D6</Nav.Link>
              <Nav.Link href="/720">Modelo 720<Badge pill variant="warning">BETA</Badge ></Nav.Link>
            </Nav>

            <a href="https://github.com/leinad87/IBD6"><Image src={GitHub_Logo_White} width="100px" /></a>
          </Container>

        </Navbar >
        <Switch>

          <Route path="/720">
            <Modelo720Form />
          </Route>
          <Route path="/">
            <D6site />
          </Route>
          <Route path="/D6">
            <D6site />
          </Route>
        </Switch>
      </Router>


      <Alert variant="dark" show={!cookies.acceptCookies} className="ml-3 fixed-bottom " style={{ right: "auto" }}>
        <p>Este sitio web usa cookies de Google para ofrecer sus servicios y analizar el tráfico.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button className="mr-3" variant="info" href="https://policies.google.com/technologies/cookies" about="_blank">
            Más información
          </Button>
          <Button variant="success" onClick={() => acceptCookies()}>
            Vale!
          </Button>
        </div>
      </Alert>
    </div>
  );

}
export default App;
