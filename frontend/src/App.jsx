import { BrowserRouter, Routes, Route } from "react-router-dom";
import {HomeScreen,ProductScreen} from './helper/index'
import axios from 'axios'
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
axios.defaults.baseURL = "http://localhost:8000";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Amazona</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
            </Routes>
          </Container>
        </main>
        <footer className="text-center">All right reserved</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
