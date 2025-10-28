import React, { useState, useEffect } from "react";
import "../../styles/user/components/filter-container.css";
import axios from "axios";

function FilterContainer({ data, applyResult}) {
  const [filterData, setFilterData] = useState(data);
  const [filters, setFilters] = useState({
    category: "",
    material: "",
    driverType: "",
    threadedType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // useEffect(() => console.log(filters), [filters]);

  const handleApply = () => {
        // console.log("fetching from filter")
    const query = `?category=${filters.category}&material=${filters.material}&driverType=${filters.driverType}&threadedType=${filters.threadedType}`;
    axios(
      `${import.meta.env.VITE_APP_API}api/v1/screw${query}`,
    )
      .then((response) => {
        // console.log(response.data);
        applyResult(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
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
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}>
          <option value="">All</option>
          {filterData.category.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label>
        Material:
        <select
          name="material"
          value={filters.material}
          onChange={handleChange}>
          <option value="">All</option>
          {filterData.material.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label>
        Driver Type:
        <select
          name="driverType"
          value={filters.driverType}
          onChange={handleChange}>
          <option value="">All</option>
          {filterData.driverType.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label>
        Threaded Type:
        <select
          name="threadedType"
          value={filters.threadedType}
          onChange={handleChange}>
          <option value="">All</option>
          {filterData.threadedType.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
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
