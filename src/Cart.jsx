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

    const tg = window.Telegram.WebApp;

    const username = tg.initDataUnsafe?.user?.username;

    if (!username) {
      tg.showAlert(
        "На вашем аккаунте Telegram не указан username. Пожалуйста, установите его в настройках профиля.",
      );
      return null;
    }
    return username;
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
                onClick={() => {
                  const username = getUserName();
                  if (username) {
                    window.Telegram?.WebApp.showAlert(`Заказ для @${username}`);
                  }
                  //сделать отправку сообщения с координатами и видео где забрать
                  //fetch для отправки заказа
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
