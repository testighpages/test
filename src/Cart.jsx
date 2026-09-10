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
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      alert("Откройте приложение внутри Telegram");
      return;
    }

    // 2. Достаем юзернейм и сырые данные авторизации
    const username = tg.initDataUnsafe?.user?.username;
    const initData = tg.initData;

    // 3. Проверяем, есть ли у пользователя юзернейм
    if (!username) {
      tg.showAlert("Здесь будет ввод имени для лохов будет без юза");
      return;
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
                  window.Telegram?.WebApp.showAlert(username);
                  console.log(username);
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
