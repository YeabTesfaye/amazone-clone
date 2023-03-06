import { useNavigate, useParams } from "react-router-dom";
import { useReducer, useEffect, useContext } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";

import Rating from "../components/Rating";
import axios from "axios";
import { productReducer } from "../helper/reducer";
import { MessageBox, LoadingBox } from "../helper/index";
import { getError } from "../helper/util";
import { Store } from "../Store";
function ProductScreen() {
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(productReducer, {
    product: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/product/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [slug]);



  const {state,dispatch: ctxDispatch } = useContext(Store);
  const {cart} = state
  const navigate = useNavigate()
  const addToCartHandler = async() => {
    const existItem = cart.cartItems.find((pro) => pro._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const {data} = await axios.get(`/api/products/${product._id}`)
    
    if(data.countInStock < quantity){
      window.alert('Sorry Product is out of Stock!')
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity},
    });
    navigate('/cart')
  };
  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <img
                src={product.image}
                alt={product.name}
                className="img-large"
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Helmet>
                    <title>{product.name}</title>
                  </Helmet>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price :${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description : {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <Card.Title>Price</Card.Title>
                      </Col>
                      <Col>
                        <Card.Text>${product.price}</Card.Text>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <Card.Title>Status</Card.Title>
                      </Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">
                            <Card.Text>In Stock</Card.Text>
                          </Badge>
                        ) : (
                          <Badge bg="danger">
                            <Card.Text>unavaliable</Card.Text>
                          </Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
export default ProductScreen;
