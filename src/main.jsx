import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./Header.jsx";

function ShopApp() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Header
        cartCount={cartCount}
        onCartToggle={() => setIsCartOpen((prev) => !prev)}
      />
      <App
        cart={cart}
        setCart={setCart}
        isCartOpen={isCartOpen}
        onCloseCart={() => setIsCartOpen(false)}
      />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ShopApp />
  </StrictMode>,
);
