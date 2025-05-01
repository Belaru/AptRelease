import React, { useState} from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


/**
 * Navigation component for displaying a responsive navigation bar.
 *
 * @component
 * @returns {JSX.Element} Rendered Navigation component.
 */
export default function Navigation() {
  //state variable to track the click state for menu activation.
  const [click, setClick] = useState(false);

  //function to handle menu click and toggle the click state.
  const handleClick = () => setClick(!click);
  const { t } = useTranslation();


  return (
    <>
    {/* <div>
      <p>Here is some other data: {otherField}</p>
    </div> */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Navigation header with a link to the home page. */}
          <a href="/" className="nav-header">
            <picture><img src="/logo1.png" alt="Logo" className="logo-image" /></picture>
            <p>RE-LEASE</p>
          </a>

          {/* List of navigation items with links to different sections. */}
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleClick}>
                {t('Nav.home')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={handleClick}>
                {t('Nav.about')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={handleClick}>
                {t('Nav.contact')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profil" className="nav-link" onClick={handleClick}>
                {t('Nav.profil')}
              </Link>
            </li>
            
          </ul>

          {/* Button to activate/deactivate the menu on smaller screens. */}
          <div className="nav-activate" onClick={handleClick}>
            {click ? 
              <span className="activate">
                {t('Nav.close')}
              </span>
              : 
              <span className="activate">
                {t('Nav.menu')}
              </span>
            }
          </div>
        </div>
      </nav>
  </>
  );
}
