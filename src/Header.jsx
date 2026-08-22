import React from "react";
import "./Header.css";
import cartImg from "./assets/cart.png";

function Header({ cartCount = 0, onCartToggle }) {
  return (
    <header className="header">
      <h1 className="header-title">Boton_Shop</h1>
      <div className="header-actions">
        <button
          className="header-cart-button"
          onClick={onCartToggle}
          type="button"
          aria-label="Корзина"
        >
          <img src={cartImg} alt="🧺" />
          {cartCount > 0 && (
            <span className="header-cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
