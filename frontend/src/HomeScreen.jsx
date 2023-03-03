import { useEffect, useReducer } from "react";
import axios from "axios";
import { homeReducer } from "../helper/reducer";
import {Product} from '../helper/index'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Helmet } from "react-helmet-async";
import favicon from "../../public/amazona.png";
function HomeScreen() {
  ;
  const [{ loading, error, products }, dispatch] = useReducer(homeReducer, {
    products: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("http://localhost:8000/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Amazona</title>
        <link rel="icon" type="image/x-icon" href={favicon} />
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
