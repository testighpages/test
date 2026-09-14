import { use } from "react";
import "./Cart.css";

function Cart({
  cart = [],
  isCartOpen = false,
  onCloseCart,
  onAdd,
  onRemove,
  onClear,
  totalItems = 0,
  totalPrice = 0,
}) {
  if (!isCartOpen) return null;

  const getUserName = () => {
    if (!window.Telegram?.WebApp) {
      alert("Откройте приложение внутри Telegram");
      return null;
    }

    /*const tg = window.Telegram.WebApp;

    const username = tg.initDataUnsafe?.user?.username;

    if (!username) {
      tg.showAlert(
        "На вашем аккаунте Telegram не указан username. Пожалуйста, установите его в настройках профиля.",
      );
      return null;
    }
    return username;*/
    return "username";
  };

  return (
    <div className="cart-overlay" onClick={onCloseCart}>
      <div className="cart-window" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Корзина</h2>
          <button
            onClick={onCloseCart}
            type="button"
            aria-label="Закрыть корзину"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="cart-empty">Пока товаров нет</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map(({ product, variant, qty }) => (
                <li
                  key={`${product.id}-${variant?.id ?? "base"}`}
                  className="cart-item"
                >
                  <div className="cart-item-text">
                    <span>{product.text}</span>
                    <small>{variant?.name ?? "основной"}</small>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() =>
                        onRemove(product, variant ?? product.variants[0])
                      }
                      type="button"
                    >
                      -
                    </button>
                    <span>{qty}</span>
                    <button
                      onClick={() =>
                        onAdd(product, variant ?? product.variants[0])
                      }
                      disabled={
                        qty >=
                        (variant?.stock ?? product.variants[0]?.stock ?? 0)
                      }
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <div>
                <span>Товаров</span>
                <strong>{totalItems}</strong>
              </div>
              <div>
                <span>Итого</span>
                <strong>{totalPrice} ₽</strong>
              </div>
            </div>

            <div className="cart-actions">
              <button className="cart-clear" onClick={onClear} type="button">
                Очистить
              </button>
              <button
                className="cart-order"
                type="button"
                onClick={async () => {
                  let deliveryTime;
                  //сделать всплывашку по которой можно будет выбрать время

                  const username = getUserName();
                  if (!username) return;

                  try {
                    const response = await fetch(
                      "http://localhost:3000/api/orders",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          items: cart.map(({ product, variant, qty }) => ({
                            productId: product.id,
                            variantId: variant?.id || product.variants[0]?.id,
                            quantity: qty,
                          })),
                          userData: {
                            name: username,
                            deliveryTime: deliveryTime,
                          },
                        }),
                      },
                    );

                    const data = await response.json();

                    if (!response.ok) {
                      window.Telegram?.WebApp.showAlert(
                        `Ошибка: ${data.message}`,
                      );
                      return;
                    }

                    window.Telegram?.WebApp.showAlert(
                      `Заказ создан! ID: ${data.id}`,
                    );
                    onClear();
                  } catch (err) {
                    console.error("Ошибка отправки заказа:", err);
                    window.Telegram?.WebApp.showAlert(`Ошибка: ${err.message}`);
                  }
                }}
              >
                Заказать
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
