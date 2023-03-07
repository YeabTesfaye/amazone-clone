import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  HomeScreen,
  ProductScreen,
  CartScreen,
  SignInScreen,
  ShippingAddressScreen,
  SignupScreen,
  PaymentMEthodScreen,
  PlaceOrderScreen,
  OrderScreen,
  OrderHistoryScreen,
  ProfileScreen,
  SearchBox,
  SearchScreen
} from "./helper/index";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useContext, useState,useEffect } from "react";
import { Store } from "./Store";
import Badge from "react-bootstrap/Badge";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = '/sign'
  };

    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const { data } = await axios.get(`/api/products/categories`);
          setCategories(data);
        } catch (err) {
          toast.error(getError(err));
        }
      };
      fetchCategories();
    }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: "/search", search: `?category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/signin" element={<SignInScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/payment" element={<PaymentMEthodScreen />} />
              <Route path="placeorder" element={<PlaceOrderScreen />} />
              <Route path="orderhistory" element={<OrderHistoryScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              {/* <Route path="search" element={<SearchScreen />} /> */}
              <Route path="order/:id" element={<OrderScreen />} />
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
