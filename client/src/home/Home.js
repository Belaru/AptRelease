import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import LeaseMap from '../components/leaseMap/leaseMap';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from  'i18next';
import lngs from '../languages';

/**
 * Home component for displaying data related to a selected country.
 *
 * @component
 * @returns {JSX.Element} Rendered Home component.
 */
export default function Home({navigateToApartments}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  

  // Function to handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  }
  /**
   * useEffect hook to fetch data when there are changes in page or country.
   */
  useEffect(() => {
    async function fetchData() {
      
    }

    try {
      fetchData();
    } catch (e) {
    }
  }, []);
  
  const navigateToApartmentsWithCity = (city) => {
    navigate(`/apartments/${city}`, { state: { city } });
  };
  

  return (
    <>
    
    <div className="language-container">
      <div className="language-dropdown">
        <select
          className="m-4 p-2 bg-blue-600 rounded"
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          {lngs.map((lng) => (
            <option key={lng.code} value={lng.code}>
              {lng.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>


      <div class="banner">
        <picture><img src="/logo1.png" alt="Logo" class="background-image" /></picture>
        <div class="banner-content">
          {/* <p>WELCOME TO</p> */}
          <p>{t('Home.welcome')}</p>
        </div>
      </div>
      <div class="banner-mobile">
        {/* <div class="banner-content-mobile">
            <p>WELCOME TO</p>
        </div> */}
        <picture><img src="/logo1.png" alt="Logo" class="background-image-mobile" /></picture>
      </div>

      <button id='view-apartments-btn' type='button' onClick={navigateToApartments}>
        {/* Start Searching */}
        {t('Home.searchbtn')}
      </button>

      <div className='cities-container'>
        <div className="city-container">
            <img src={'/montreal.jpeg'} alt="Montreal" className="city-image" />
            <button className="btn city-image-button" onClick={() => navigateToApartmentsWithCity("Montreal")}>{t('Home.montrealleases')}</button>
            <p className="city-text" onClick={() => navigateToApartmentsWithCity("Montreal")}>
            {t('Home.montrealleases')}</p>
        </div>
        <div className="city-container">
          <img src={'/toronto.webp'} alt="Toronto" className="city-image" />
          <button className="btn city-image-button" onClick={() => navigateToApartmentsWithCity("Toronto")}>{t('Home.torontoleases')}</button>
          <p className="city-text" onClick={() => navigateToApartmentsWithCity("Toronto")}>
          {t('Home.torontoleases')}</p>
        </div>

        <div className="city-container">
          <img src={'/vancouver.jpeg'} alt="Vancouver" className="city-image" />
          <button className="btn city-image-button" onClick={() => navigateToApartmentsWithCity("Vancouver")}>{t('Home.vancouverlleases')}</button>
          <p className="city-text" onClick={() => navigateToApartmentsWithCity("Vancouver")}>
          {t('Home.vancouverlleases')}</p>
        </div>
        {/* <div className="city-container-mobile">
          <div className='city-image-container'>
            <div className='white-overlay'>
              <img src={'/montreal.jpeg'} alt="Montreal" className="city-image" />
              <button className='city-image-button-mobile' onClick={() => navigateToApartmentsWithCity("Montreal")}>View Montreal Leases</button>
            </div>
          </div> 
          <p className="city-text" onClick={() => navigateToApartmentsWithCity("Montreal")}>
            View Montreal Leases</p>
        </div> */}
      </div>
      
    </>
  );
  
}