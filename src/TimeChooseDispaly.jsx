import { useState } from "react";

function TimeChooseDisplay({ time, isWindowOpen = false }) {
  if (!isWindowOpen) {
    return null;
  }

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [errorText, setErrorText] = useState("");

  const validateTime = (h, m) => {
    const now = new Date();
    const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
    if (h * 60 + m > nowTotalMinutes) {
      if (h * 60 + m + 15 < nowTotalMinutes) {
        setErrorText(
          "Время должно быть как минимум через 15 минут от времени заказа",
        );
        return false;
      }
      return true;
    } else {
      setErrorText("Время доставки должно быть позже чем нынешнее время");
      return false;
    }
  };

  return (
    <>
      <div>
        <h1>Введите время доставки</h1>
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="number"
          min={0}
          max={23}
          placeholder="ЧЧ"
          value={hours}
          onChange={(e) => {
            setHours(e.target.value);
            setErrorText("");
          }}
        ></input>
        <p>:</p>
        <input
          type="number"
          min={0}
          max={59}
          placeholder="ММ"
          value={minutes}
          onChange={(e) => {
            setMinutes(e.target.value);
            setErrorText("");
          }}
        ></input>
      </div>
      <p>{errorText}</p>
      <button
        onClick={() => {
          if (validateTime(h, m)) {
            time = { hours, minutes };
            isWindowOpen = false;
          }
        }}
      >
        Выбрать
      </button>
    </>
  );
}

export default TimeChooseDisplay;
