import './Contact.css';
import { useTranslation } from 'react-i18next';

export default function Contact() {
    const { t } = useTranslation();

    return(
        <div className="contact">
            <h1>{t('Contact.contactinfo')}</h1>
            <br></br>
            <p>
                {t('Contact.text')}
            </p>
            <div className="contact-info">
                <div className="contact-item">
                    <strong>{t('Contact.email')}</strong> relaease@info.ca
                </div>
                <div className="contact-item">
                    <strong>{t('Contact.phone')}</strong> +x (xxx)xxx-xxxx
                </div>
            </div>
        </div>
    );
}