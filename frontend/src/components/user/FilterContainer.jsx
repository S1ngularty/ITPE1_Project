import React, { useState } from "react";
import "../../styles/user/components/filter-container.css";

function FilterContainer() {
  const [filters, setFilters] = useState({
    category: "",
    material: "",
    driverType: "",
    threadedType: "",
    strength: "",
  });

  const categories = ["Wood Screw", "Machine Screw", "Structural Fastener", "Anchor Screw"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    console.log("Applied filters:", filters);
    // TODO: emit filters via props or context for API/filtering logic
  };

  const handleReset = () => {
    setFilters({
      category: "",
      material: "",
      driverType: "",
      threadedType: "",
      strength: "",
    });
  };

  return (
    <div className="filter-container">
      <h4>Filter Screws</h4>

      <label>
        Category:
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label>
        Material:
        <input
          type="text"
          name="material"
          value={filters.material}
          onChange={handleChange}
          placeholder="e.g. Steel"
        />
      </label>

      <label>
        Driver Type:
        <input
          type="text"
          name="driverType"
          value={filters.driverType}
          onChange={handleChange}
          placeholder="e.g. Phillips"
        />
      </label>

      <label>
        Threaded Type:
        <input
          type="text"
          name="threadedType"
          value={filters.threadedType}
          onChange={handleChange}
          placeholder="e.g. Fully Threaded"
        />
      </label>

      <label>
        Strength:
        <input
          type="text"
          name="strength"
          value={filters.strength}
          onChange={handleChange}
          placeholder="e.g. High Tensile"
        />
      </label>

      <div className="filter-actions">
        <button className="apply-btn" onClick={handleApply}>
          Apply
        </button>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterContainer;
