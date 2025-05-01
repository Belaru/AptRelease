import './footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function Footer(){
  const { t } = useTranslation();

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
    }

    return <>
        <footer>
            <div class="top">
              <div class="logo-footer">
                <picture><img src="/logo1.png" alt="Logo" class="image-footer"  loading="lazy" /></picture>
              </div>
              <div class="left">
                <p><strong>{t('Footer.credit')}</strong></p>
                <p>Elissar Fadel</p>
                <p>Monica Dimitrova</p>
                <p>Anastasia Bondarenko</p>
                <p>Dany Makhoul</p>
              </div>
              <div className="right">
                <p><strong>{t('Footer.links')}</strong></p>
                <ul className="footer-links">
                  <li>
                    <Link to="/" onClick={scrollToTop}>{t('Nav.home')}</Link>
                  </li>
                  <li>
                    <Link to="/about" onClick={scrollToTop}>{t('Nav.about')}</Link>
                  </li>
                  <li>
                    <Link to="/contact" onClick={scrollToTop}>{t('Nav.contact')}</Link>
                  </li>
                  <li>
                    <Link to="/post-listing" onClick={scrollToTop}>{t('Profil.post')}</Link>
                  </li>
                  <li>
                    <Link to="/apartments" onClick={scrollToTop}>{t('Footer.viewapts')}</Link>
                  </li>
                </ul>
              </div>
            </div>
          
            <div class="policy">
              <p>{t('Footer.policy')}</p>
            </div>
      </footer>
    </>
}
export default Footer;