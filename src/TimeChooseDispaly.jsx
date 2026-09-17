import { useState } from "react";
import "./styles/TimeChoose.css";

function TimeChooseDisplay({
  isOpen = false,
  onClose,
  onSelect,
  selectedTime = null,
}) {
  const [hours, setHours] = useState(
    selectedTime?.hours ?? new Date().getHours(),
  );
  const [minutes, setMinutes] = useState(
    selectedTime?.minutes ?? new Date().getMinutes(),
  );
  const [errorText, setErrorText] = useState("");

  if (!isOpen) {
    return null;
  }

  const validateTime = (h, m) => {
    const now = new Date();
    const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
    const selectedTotalMinutes = Number(h) * 60 + Number(m);

    if (Number.isNaN(selectedTotalMinutes) || selectedTotalMinutes < 0) {
      setErrorText("Введите корректное время доставки");
      return false;
    }

    if (selectedTotalMinutes <= nowTotalMinutes) {
      setErrorText("Время доставки должно быть позже текущего времени");
      return false;
    }

    if (selectedTotalMinutes - nowTotalMinutes < 15) {
      setErrorText("Минимальный интервал доставки — 15 минут");
      return false;
    }

    return true;
  };

  const handleConfirm = () => {
    if (!validateTime(hours, minutes)) {
      return;
    }

    onSelect?.({
      hours: Number(hours),
      minutes: Number(minutes),
    });
  };

  return (
    <div className="time-picker-overlay" onClick={onClose}>
      <div
        className="time-picker"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="time-picker-header">
          <h3>Выберите время</h3>
          <button
            type="button"
            className="time-picker-close"
            onClick={onClose}
            aria-label="Закрыть выбор времени"
          >
            ✕
          </button>
        </div>

        <div className="time-picker-body">
          <input
            className="time-input"
            type="number"
            min={0}
            max={23}
            placeholder="ЧЧ"
            value={hours}
            onChange={(e) => {
              setHours(e.target.value);
              setErrorText("");
            }}
          />
          <span className="time-separator">:</span>
          <input
            className="time-input"
            type="number"
            min={0}
            max={59}
            placeholder="ММ"
            value={minutes}
            onChange={(e) => {
              setMinutes(e.target.value);
              setErrorText("");
            }}
          />
        </div>

        {errorText && <p className="time-picker-error">{errorText}</p>}

        <div className="time-picker-actions">
          <button
            type="button"
            className="time-picker-cancel"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="button"
            className="time-picker-confirm"
            onClick={handleConfirm}
          >
            Выбрать
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeChooseDisplay;
