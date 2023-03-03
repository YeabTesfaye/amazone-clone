import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
function Product({ product }) {
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
        <Button className="btn-primary">Add To Cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
