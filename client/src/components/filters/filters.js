import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import "./filters.css";
import { useTranslation } from 'react-i18next';

const Filters = ({
  sortOption,
  setSortOption,
  searchQuery,
  setSearchQuery,
  rentValues,
  setRentValues,
  bathroomCount,
  setBathroomCount,
  bedroomCount,
  setBedroomCount,
  furnishing,
  city,
  leases,
  setCity,
  setFurnishing,
  setApplyFilters,
  clearFilters,
  setClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cityList, setCityList] = useState([]);
  const furnishingList = ["Furnished", "Unfurnished", "Semi-Furnished"];

  const { t } = useTranslation();
  const fetchCities = async () => {
    try {
      let response = await fetch("/filters/city");
      if (!response.ok) {
        throw new Error("Failed to fetch leases");
      }
      const data = await response.json();
      setCityList(data.response);
    } catch (error) {
      console.error("Error fetching leases:", error);
    }
  };
  // useEffect(() => {
  //   async function fetchCities() {
  //     try {
  //       let response = await fetch("/filters/city");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch leases");
  //       }
  //       const data = await response.json();
  //       setCityList(data.response);
  //     } catch (error) {
  //       console.error("Error fetching leases:", error);
  //     }
  //   }
  //   fetchCities();
  // }, []);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleApplyFilters = () => {
    setApplyFilters(true);
  };
  const handleFiltersDropdown = () => {
    setIsOpen(!isOpen);
    setClearFilters(!clearFilters);
  };

  function incrementBathroomCount() {
    if (bathroomCount < 5) {
      bathroomCount = bathroomCount + 1;
    }
    setBathroomCount(bathroomCount);
  }
  function decrementBathroomCount() {
    if (bathroomCount > 0) {
      bathroomCount = bathroomCount - 1;
    }
    setBathroomCount(bathroomCount);
  }
  function incrementBedroomCount() {
    if (bedroomCount < 5) {
      bedroomCount = bedroomCount + 1;
    }
    setBedroomCount(bedroomCount);
  }
  function decrementBedroomCount() {
    if (bedroomCount > 0) {
      bedroomCount = bedroomCount - 1;
    }
    setBedroomCount(bedroomCount);
  }
  function handleClearFilters(){
    setIsOpen(!isOpen);
    setClearFilters(!clearFilters)
  }

  return (
    <section className="pt-5">
      <div className="mb-3 listings-filters">
        <div className="order-filter">
          <span id="order-title">{t('Filter.order')}</span>
          <select
            id="filterOptions"
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">{t('Filter.select')}</option>
            <option value="lowestPrice">{t('Filter.lowest')}</option>
            <option value="highestPrice">{t('Filter.highest')}</option>
          </select>
        </div>
        <div className="search-filter">
          <input
            type="text"
            className="form-control mt-0"
            placeholder={t('Filter.search')}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ padding: "1rem" }}>
          <button
            className="btn btn-secondary dropdown-toggle"
            onClick={ () => {
              if(!isOpen){
                fetchCities();
              }
              handleClearFilters();
            
            }}
          >
            {t('Filter.filters')}
          </button>
        </div>
        {clearFilters && (
          <div className="clear-filters-button">
            <button className="btn btn-danger" onClick={handleFiltersDropdown}>
              {t('Filter.clear')}
            </button>
          </div>
        )}
      </div>
      {isOpen && (
      <div className="mb-4 filters-div">
        {/* Your filter options */}
        {/* City filter */}
        <div className="filters-div-inner">
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ textAlign: "start" }}>{t('Filter.city')}</div>
            <div
              style={{
                overflow: "scroll",
                height: "100px",
                width: "120px",
              }}
            >
              {cityList.map((city) => (
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    onChange={() => setCity(city)}
                    name="city"
                  />
                  <label className="form-check-label">{city}</label>
                </div>
              ))}
            </div>
          </div>
          {/* Furnishing filter */}
          <div>
            <div style={{ textAlign: "start" }}>{t('Filter.furnishing')}</div>
            <div className="form-check" style={{ textAlign: "start" }}>
              <input
                type="radio"
                className="form-check-input"
                onChange={() => setFurnishing(null)}
                name="furnishing"
              />
              <label className="form-check-label">{t('Filter.all')}</label>
            </div>
            {furnishingList.map((furnishing) => (
              <div className="form-check" style={{ textAlign: "start" }}>
                <input
                  type="radio"
                  className="form-check-input"
                  onChange={() => setFurnishing(furnishing)}
                  name="furnishing"
                />
                <label className="form-check-label">{furnishing}</label>
              </div>
            ))}
          </div>
          {/* Rent range filter */}
          <div style={{ margin: "50px" }}>
            <label htmlFor="rent">
              {t('Filter.min')} {rentValues[0]} <br /> {t('Filter.max')}{" "}
              {rentValues[1]}
            </label>
            <Range
              step={50}
              min={0}
              max={8000}
              values={rentValues}
              onChange={(values) => setRentValues(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    marginTop: "1.5rem",
                    height: "6px",
                    width: "100%",
                    backgroundColor: "#ccc",
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "21px",
                    width: "21px",
                    backgroundColor: "#bfbfbf",
                    borderRadius: "50%",
                    border: "2px solid #999",
                  }}
                />
              )}
            />
          </div>
          {/* Bathroom count filter */}
          <div>
            <div className="input-group num-filters">
              <div style={{ textAlign: "start", paddingRight: "1rem" }}>{t('Filter.baths')}</div>
              <span className="input-group-btn" style={{ paddingTop: "0.4rem" }}>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={decrementBathroomCount}
                >
                  -
                </button>
              </span>
              <span className="input-group-btn col-sm-3">
                <input
                  className="form-control input-number"
                  type="number"
                  id="bathroomNmb"
                  value={bathroomCount}
                  min="0"
                  max="5"
                  onChange={(e) => setBathroomCount(e.target.value)}
                />
              </span>
              <span className="input-group-btn" style={{ paddingTop: "0.4rem" }}>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={incrementBathroomCount}
                >
                  +
                </button>
              </span>
            </div>
            {/* Bedroom count filter */}
            <div className="input-group num-filters" style={{ paddingTop: "1rem" }}>
              <div style={{ textAlign: "start", paddingRight: "1rem" }}>{t('Filter.beds')}</div>
              <span className="input-group-btn" style={{ paddingTop: "0.4rem" }}>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={decrementBedroomCount}
                >
                  -
                </button>
              </span>
              <span className="input-group-btn col-sm-3">
                <input
                  className="form-control input-number"
                  type="number"
                  id="bedroomNmb"
                  value={bedroomCount}
                  min="0"
                  max="5"
                  onChange={(e) => setBedroomCount(e.target.value)}
                />
              </span>
              <span className="input-group-btn" style={{ paddingTop: "0.4rem" }}>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={incrementBedroomCount}
                >
                  +
                </button>
              </span>
            </div>
          </div>
        </div>
        {/* Apply filters button */}
        <button
          type="button"
          onClick={handleApplyFilters}
          className="btn btn-primary"
          disabled={!city}
        >
          {t('Filter.apply')}
        </button>
      </div>
      )}
    </section>
  );
};
export default Filters;
