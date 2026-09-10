import { useMemo, useState, useEffect } from "react";
import "./App.css";
import ProductCart from "./ProductCart.jsx";
import Filters from "./Filters.jsx";
import Cart from "./Cart.jsx";
import {
  dataToProducts,
  filterProductsByIdType,
  getAllProductsData,
} from "./apiHandler.js";

function App({ cart = [], setCart, isCartOpen = false, onCloseCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function f() {
      try {
        const data = await getAllProductsData();
        const formattedProducts = dataToProducts(data);
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      }
    }
    f();
  }, []);

  const filters = useMemo(() => {
    return [
      { name: "жидкости", products: filterProductsByIdType("zh", products) },
      { name: "расходники", products: filterProductsByIdType("rs", products) },
      { name: "устройства", products: filterProductsByIdType("us", products) },
    ];
  }, [products]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const getCartKey = (product, variant) => {
    const variantName = variant?.id ?? product.variants[0]?.id ?? product.id;
    return `${product.id}-${variantName}`;
  };

  const getQty = (product, variant = product.variants[0]) => {
    return cart.reduce((sum, item) => {
      if (
        item.product.id === product.id &&
        getCartKey(item.product, item.variant) === getCartKey(product, variant)
      ) {
        return sum + item.qty;
      }
      return sum;
    }, 0);
  };

  const addToCart = (product, variant = product.variants[0], qty = 1) => {
    setCart((prev) => {
      const itemKey = getCartKey(product, variant);
      const idx = prev.findIndex(
        (c) => getCartKey(c.product, c.variant) === itemKey,
      );

      const variantQty = prev.reduce(
        (sum, item) =>
          sum +
          (item.product.id === product.id &&
          getCartKey(item.product, item.variant) === itemKey
            ? item.qty
            : 0),
        0,
      );
      const availableQty = Math.max(0, variant.stock - variantQty);
      const quantityToAdd = Math.min(qty, availableQty);
      if (quantityToAdd === 0) return prev;

      if (idx === -1)
        return [...prev, { product, variant, qty: quantityToAdd }];

      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty + quantityToAdd };
      return next;
    });
  };

  const getVariantQty = (product, variant) => getQty(product, variant);

  const removeFromCart = (product, variant = product.variants[0], qty = 1) => {
    setCart((prev) => {
      const itemKey = getCartKey(product, variant);
      const idx = prev.findIndex(
        (c) => getCartKey(c.product, c.variant) === itemKey,
      );
      if (idx === -1) return prev;

      const next = [...prev];
      const newQty = next[idx].qty - qty;

      if (newQty <= 0) {
        next.splice(idx, 1);
        return next;
      }

      next[idx] = { ...next[idx], qty: newQty };
      return next;
    });
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + (item.variant?.price ?? item.product.price) * item.qty,
        0,
      ),
    [cart],
  );

  return (
    <>
      <Filters
        filters={filters}
        selected={selectedFilter}
        onChange={setSelectedFilter}
      />
      <div id="product_display">
        {(() => {
          if (selectedFilter === "all") {
            const all = filters.flatMap((f) => f.products);
            return all.map((p, i) => (
              <ProductCart
                key={p.id ?? `${p.text}-${i}`}
                product={p}
                qty={p.variants.reduce((sum, v) => sum + getQty(p, v), 0)}
                getVariantQty={getVariantQty}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ));
          }
          const group = filters.find((f) => f.name === selectedFilter);
          const list = group ? group.products : [];
          return list.map((p, i) => (
            <ProductCart
              key={p.id ?? `${p.text}-${i}`}
              product={p}
              qty={p.variants.reduce((sum, v) => sum + getQty(p, v), 0)}
              getVariantQty={getVariantQty}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          ));
        })()}
      </div>

      <Cart
        cart={cart}
        isCartOpen={isCartOpen}
        onCloseCart={onCloseCart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        totalItems={totalItems}
        totalPrice={totalPrice}
      />
    </>
  );
}

export default App;
