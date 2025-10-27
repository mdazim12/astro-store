import { useState } from 'react';

// Your WordPress GraphQL endpoint
const API_URL = "https://store.insectsexpert.com/graphql";

// The GraphQL mutation to add an item to the cart.
// It takes a 'productId' which must be an Integer (like 2585)
const ADD_TO_CART_MUTATION = `
  mutation AddToCart($productId: Int!) {
    addToCart(input: {productId: $productId}) {
      cartItem {
        key
        quantity
        product {
          node {
            name
          }
        }
      }
    }
  }
`;

export default function AddToCartButton({ productId }) {
  // We use React's 'useState' to manage the button's text
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Add to Cart');

  const handleClick = async () => {
    setLoading(true);
    setMessage('Adding...');

    // 1. Get the current session token from the browser's storage
    const sessionToken = localStorage.getItem('woocommerce-session');

    // 2. Set up the headers for the request
    const headers = {
      'Content-Type': 'application/json',
    };
    // If we have a session token, add it to the request
    if (sessionToken) {
      headers['woocommerce-session'] = sessionToken;
    }

    try {
      // 3. Send the fetch request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: ADD_TO_CART_MUTATION,
          variables: {
            productId: productId, // This is the databaseId (e.g., 2585)
          },
        }),
      });

      // 4. Get the *new* session token from the response headers
      // WooCommerce sends an updated token with every cart action
      const newSessionToken = response.headers.get('woocommerce-session');

      // 5. Save the new token back to localStorage
      if (newSessionToken) {
        localStorage.setItem('woocommerce-session', newSessionToken);
      }

      // 6. Handle the response data
      const json = await response.json();
      
      if (json.data && json.data.addToCart) {
        setMessage('Added!');
      } else {
        setMessage('Error');
        console.error(json.errors);
      }

    } catch (error) {
      setMessage('Error');
      console.error(error);
    }

    // After 2 seconds, reset the button text
    setTimeout(() => {
      setLoading(false);
      setMessage('Add to Cart');
    }, 2000);
  };

  return (
    <button
      className="btn btn-primary w-full"
      onClick={handleClick}
      disabled={loading} // Disable the button while it's loading
    >
      {message}
    </button>
  );
}