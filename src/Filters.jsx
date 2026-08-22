function Filters({ filters = [], selected, onChange }) {
  return (
    <div className="filters-wrap">
      <select
        className="filters-select"
        name="type"
        id="type"
        value={selected}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        <option value="all" className="filters-option">
          все
        </option>
        {filters.map((f) => (
          <option value={f.name} key={f.name} className="filters-option">
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
