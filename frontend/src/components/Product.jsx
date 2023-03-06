import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";
function Product({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((pro) => pro._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert(`Sorry Product is out of Stock!`);
    }
    
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    
  };
  return (
    <Card className="product">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <Card.Title>
          <Link to={`/product/${product.slug}`}>
            <p>{product.name}</p>
          </Link>
          <Rating
            rating={product.rating}
            numReviews={product.numReviews}
          ></Rating>
        </Card.Title>
        <Card.Text>
          <strong>${product.price}</strong>
        </Card.Text>
        {product.countInStock === 0 ?  <Button variant="light" disabled>outof Stock</Button>
         : (
          <Button
            className="btn-primary"
            onClick={() => addToCartHandler(product)}
          >
            Add To Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
