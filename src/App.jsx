import { useMemo, useState, useEffect } from "react";
import "./styles/App.css";
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    getAllProductsData()
      .then((data) => {
        if (isCurrent) setProducts(dataToProducts(data));
      })
      .catch((error) => {
        if (isCurrent) {
          setLoadError(error.message);
          console.error("Ошибка загрузки товаров:", error);
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
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

  const visibleProducts =
    selectedFilter === "all"
      ? filters.flatMap((filter) => filter.products)
      : (filters.find((filter) => filter.name === selectedFilter)?.products ??
        []);

  return (
    <>
      <Filters
        filters={filters}
        selected={selectedFilter}
        onChange={setSelectedFilter}
      />
      <div id="product_display">
        {isLoading ? (
          <p className="catalog-state" role="status">
            Загружаем товары...
          </p>
        ) : loadError ? (
          <p className="catalog-state" role="alert">
            Не удалось загрузить каталог: {loadError}
          </p>
        ) : visibleProducts.length === 0 ? (
          <p className="catalog-state">В каталоге пока нет товаров.</p>
        ) : (
          visibleProducts.map((p) => (
            <ProductCart
              key={p.id}
              product={p}
              qty={p.variants.reduce((sum, v) => sum + getQty(p, v), 0)}
              getVariantQty={getVariantQty}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          ))
        )}
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
