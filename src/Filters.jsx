function Filters({ filters = [], selected, onChange }) {
  const categories = [
    { name: "все", value: "all" },
    ...filters.map((filter) => ({ name: filter.name, value: filter.name })),
  ];

  return (
    <div className="filters-wrap">
      <div className="filters-list" role="group" aria-label="Категории товаров">
        {categories.map((category) => (
          <button
            className={`filters-chip${selected === category.value ? " is-active" : ""}`}
            key={category.value}
            type="button"
            aria-pressed={selected === category.value}
            onClick={() => onChange?.(category.value)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filters;
