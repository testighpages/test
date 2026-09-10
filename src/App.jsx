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
    setProducts([
    {
      id: "zh-01",
      text: "жижа А",
      price: 260,
      variants: [
        { id: "zh-01-30", name: "30 мл", stock: 4 },
        { id: "zh-01-60", name: "60 мл", stock: 3 },
        { id: "zh-01-120", name: "120 мл", stock: 3 },
      ],
    },
    {
      id: "zh-02",
      text: "жижа B",
      price: 320,
      variants: [
        { id: "zh-02-30", name: "30 мл", stock: 5 },
        { id: "zh-02-60", name: "60 мл", stock: 5 },
      ],
    },
    {
      id: "zh-03",
      text: "жижа C",
      price: 290,
      variants: [
        { id: "zh-03-30", name: "30 мл", stock: 6 },
        { id: "zh-03-50", name: "50 мл", stock: 4 },
      ],
    },
    {
      id: "zh-04",
      text: "жижа D",
      price: 340,
      variants: [
        { id: "zh-04-30", name: "30 мл", stock: 7 },
        { id: "zh-04-90", name: "90 мл", stock: 3 },
      ],
    },
    {
      id: "rs-01",
      text: "расходник E",
      price: 120,
      variants: [
        { id: "rs-01-1", name: "1 шт", stock: 8 },
        { id: "rs-01-3", name: "3 шт", stock: 7 },
        { id: "rs-01-10", name: "10 шт", stock: 5 },
      ],
    },
    {
      id: "rs-02",
      text: "расходник F",
      price: 150,
      variants: [
        { id: "rs-02-1", name: "1 шт", stock: 12 },
        { id: "rs-02-5", name: "5 шт", stock: 8 },
      ],
    },
    {
      id: "us-01",
      text: "устройство G",
      price: 700,
      variants: [
        { id: "us-01-basic", name: "базовая", stock: 3 },
        { id: "us-01-pro", name: "pro", stock: 2 },
      ],
    },
    {
      id: "us-02",
      text: "устройство H",
      price: 840,
      variants: [
        { id: "us-02-basic", name: "базовая", stock: 3 },
        { id: "us-02-max", name: "max", stock: 2 },
      ],
    },
  ]);
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
