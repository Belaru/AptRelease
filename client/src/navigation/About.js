import './About.css';
import { useTranslation } from 'react-i18next';

export default function About() {
    const { t } = useTranslation();

    return(
        <div className="about">
            <h1>{t('About.aboutus')}</h1>
            <br></br>
            <p>
                {t('About.text')}
            </p>
            <p>-Monica, Anastasia, Elissar, Dany</p>
        </div>
    );
}