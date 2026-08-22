import { useMemo, useState } from "react";
import "./App.css";
import ProductCart from "./ProductCart.jsx";
import Filters from "./Filters.jsx";
import Cart from "./Cart.jsx";
import Product from "./Product";
import image from "./assets/image.png";

function App({ cart = [], setCart, isCartOpen = false, onCloseCart }) {
  const zhizha = [
    new Product({
      id: "zh-01",
      text: "жижа А",
      image,
      price: 260,
      variants: [{ name: "30 мл", stock: 4 }, { name: "60 мл", stock: 3 }, { name: "120 мл", stock: 3 }],
    }),
    new Product({
      id: "zh-02",
      text: "жижа B",
      image,
      price: 320,
      variants: [{ name: "30 мл", stock: 5 }, { name: "60 мл", stock: 5 }],
    }),
    new Product({
      id: "zh-03",
      text: "жижа C",
      image,
      price: 290,
      variants: [{ name: "30 мл", stock: 6 }, { name: "50 мл", stock: 4 }],
    }),
    new Product({
      id: "zh-04",
      text: "жижа D",
      image,
      price: 340,
      variants: [{ name: "30 мл", stock: 7 }, { name: "90 мл", stock: 3 }],
    }),
  ];
  const rasxodniki = [
    new Product({
      id: "rs-01",
      text: "расходник E",
      image,
      price: 120,
      variants: [{ name: "1 шт", stock: 8 }, { name: "3 шт", stock: 7 }, { name: "10 шт", stock: 5 }],
    }),
    new Product({
      id: "rs-02",
      text: "расходник F",
      image,
      price: 150,
      variants: [{ name: "1 шт", stock: 12 }, { name: "5 шт", stock: 8 }],
    }),
  ];
  const ustroystva = [
    new Product({
      id: "us-01",
      text: "устройство G",
      image,
      price: 700,
      variants: [{ name: "базовая", stock: 3 }, { name: "pro", stock: 2 }],
    }),
    new Product({
      id: "us-02",
      text: "устройство H",
      image,
      price: 840,
      variants: [{ name: "базовая", stock: 3 }, { name: "max", stock: 2 }],
    }),
  ];

  const [filters] = useState([
    { name: "жидкости", products: zhizha },
    { name: "расходники", products: rasxodniki },
    { name: "устройства", products: ustroystva },
  ]);
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

      if (idx === -1) return [...prev, { product, variant, qty: quantityToAdd }];

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
