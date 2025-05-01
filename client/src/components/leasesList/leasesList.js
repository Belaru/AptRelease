import React, { useEffect, useState, useMemo } from "react";
import Pagination from "../pagination/pagination";
import Filters from "../filters/filters";
import "./leasesList.css";
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LeasesList = ({ navigateToApartmentPage }) => {

  const { t } = useTranslation();

  const location = useLocation();
  const [cityParam, setCityParam] = useState(location.state?.city);

  const [leases, setLeases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [city, setCity] = useState(location.state?.city || null);
  const [rentValues, setRentValues] = useState([0, 0]);
  const [bathroomCount, setBathroomCount] = useState(0);
  const [bedroomCount, setBedroomCount] = useState(0);
  const [applyFilters, setApplyFilters] = useState(false);
  const [clearFilters, setClearFilters] = useState(false);
  const [furnishing, setFurnishing] = useState(null);
  const cardsPerPage = 9;
  const currentLeases = useMemo(() => {
    let filteredLeases = leases;
    if (sortOption === "lowestPrice") {
      filteredLeases = filteredLeases.sort((a, b) => a.rentPrice - b.rentPrice);
    } else if (sortOption === "highestPrice") {
      filteredLeases = filteredLeases.sort((a, b) => b.rentPrice - a.rentPrice);
    }
    if (searchQuery != null) {
      if (searchQuery.trim() !== "") {
        const searchTerms = searchQuery.trim().toLowerCase().split(" ");
        filteredLeases = leases.filter((lease) => {
          return searchTerms.some((term) =>
            lease.address.toLowerCase().includes(term.toLowerCase())
          );
        });
      }
    }
    const firstPageIndex = (currentPage - 1) * cardsPerPage;
    const lastPageIndex = firstPageIndex + cardsPerPage;
    return filteredLeases.slice(firstPageIndex, lastPageIndex);
  }, [leases, sortOption, searchQuery, currentPage]);
  const handleApartmentClick = (apartment) => {
    navigateToApartmentPage(apartment);
  };
  const resetFiltersForm = () => {
    setCity(null);
    setFurnishing(null);
    setBathroomCount(0);
    setBedroomCount(0);
    setRentValues([0, 0]);
  };
  useEffect(() => {
    async function fetchLeases() {
      try {
        let link = "/leases";
        
        // caching
        const cachedLeases = localStorage.getItem('leases');
        if (cachedLeases) {
          setLeases(JSON.parse(cachedLeases));
          return; 
        }

        let response = await fetch(link);
        if (!response.ok) {
          throw new Error("Failed to fetch leases");
        }
        const data = await response.json();
        setLeases(data.response);
        // caching
        localStorage.setItem('leases', JSON.stringify(data.response));

      } catch (error) {
        console.error("Error fetching leases:", error);
      }
    }
    if (!cityParam && !clearFilters) {
      fetchLeases();
    }
  }, [clearFilters]);
  useEffect(() => {
    async function fetchLeasesWithFilters() {
      try {
        let link = `/leases/`;

        const cacheKey = `leases:${city || ''}:${furnishing || ''}:${bedroomCount}:${rentValues[0]}:${rentValues[1]}:${bathroomCount}`;

        // caching
        const cachedLeases = localStorage.getItem(cacheKey);
        if (cachedLeases) {
          console.log("caching happening")
          setLeases(JSON.parse(cachedLeases));
          return; 
        }

        console.log("fetching again");
        if(city != null){
          link = link.concat(`${city}?`);
        }
        if (furnishing != null) {
          link = link.concat(`furnishing=${furnishing}&`);
        }
        if (bedroomCount > 0) {
          link = link.concat(`bedroom=${bedroomCount}`);
        }
        if (
          rentValues[0] >= 0 &&
          rentValues[1] > 0 &&
          rentValues[0] !== rentValues[1]
        ) {
          link = link.concat(
            `rentMinimum=${rentValues[0]}&rentMaximum=${rentValues[1]}&`
          );
        }
        if (bathroomCount > 0) {
          link = link.concat(`bathroom=${bathroomCount}`);
        }
        let response = await fetch(link);
        if (!response.ok) {
          throw new Error("Failed to fetch leases");
        }
        const data = await response.json();
        setLeases(data.response);

        //caching
        localStorage.setItem(cacheKey, JSON.stringify(data.response));
      } catch (error) {
        console.error("Error fetching leases:", error);
      }
    }
    if (cityParam) {
      console.log("reached here");
      setCityParam(null);
      fetchLeasesWithFilters();
      setApplyFilters(false);
      resetFiltersForm();
    }
    if (applyFilters) {
      fetchLeasesWithFilters();
      setApplyFilters(false);
      resetFiltersForm();
    }
  }, [applyFilters, bathroomCount, bedroomCount, city, furnishing, rentValues]);

  const translateFurnishing = (furnishing) => {
    switch (furnishing) {
        case 'Furnished':
            return t('Post.fur');
        case 'Semi-Furnished':
            return t('Post.semifur');
        case 'Unfurnished':
            return t('Post.unfur');
        default:
            return furnishing;
    }
};


return (
  <div class="container mt-5">
    <Filters
      sortOption={sortOption}
      setSortOption={setSortOption}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      city={city}
      setCity={setCity}
      setFurnishing={setFurnishing}
      furnishing={furnishing}
      rentValues={rentValues}
      setRentValues={setRentValues}
      setApplyFilters={setApplyFilters}
      setBedroomCount={setBedroomCount}
      bedroomCount={bedroomCount}
      bathroomCount={bathroomCount}
      setBathroomCount={setBathroomCount}
      leases={leases}
      clearFilters={clearFilters}
      setClearFilters={setClearFilters}
    />
    <div class="lease-list">
      {currentLeases.map((apartment) => (
        <div key={apartment.id} class="mb-5 lease-card">
          <div class="card h-100">
            <img className="card-image" src={apartment.images[0]} alt={apartment.bhk} />
            <div class="card-body p-4">
              <div class="text-center">
                <h5 class="fw-bolder">
                  {t('apartmentInfo', {
                    furnishing: translateFurnishing(apartment.furnishing),
                    aptLocation: t('AptsList.aptlocation'),
                    address: apartment.address,
                    city: apartment.city
                  })}
                </h5>
                <h5 class="fw-bolder">{t('AptsList.price', { apartmentPrice: apartment.rentPrice })}</h5>
                

                <div className="row">
                  <div className="col-2">
                    <img
                      className="card-icon"
                      src="double-bed.png"
                      alt="double-bed"
                      width="15"
                      height="15"
                    />
                    {apartment.bhk}
                  </div>
                  <div className="col-2">
                    <img
                      className="card-icon"
                      src="bathroom.png"
                      alt="bathroom-icon"
                      width="15"
                      height="15"
                    />
                    {apartment.bathroom}
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
              <div
                class="text-center"
                onClick={() => handleApartmentClick(apartment)}
              >
                <button class="btn btn-outline-dark mt-auto">
                  {t('Profil.viewlisting')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-3 pagination-div">
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={leases.length}
        pageSize={cardsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  </div>
);
};

export default LeasesList;
