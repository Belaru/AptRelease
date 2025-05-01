import ApartmentImages from './images.js';
import LeaseMap from '../components/leaseMap/leaseMap.js';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Apartment.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { SayButton } from 'react-say';
import { useTranslation } from 'react-i18next';


/**
 * ApartmentPage component for displaying information on a single apartment.
 *
 * @component
 * @returns {JSX.Element} Rendered ApartmentPage component.
 */
export default function ApartmentPage() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); //state to control the modal
    const [content, setReadContent] = useState('');

    const { t } = useTranslation();


    useEffect(() => {
        //check if the user is logged in based on stored credentials
        const storedUsername = localStorage.getItem('username');
        const storedName = localStorage.getItem('name');
        if (storedUsername && storedName) {
            setUsername(storedUsername);
            setName(storedName);
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        // Get speech content
        getContext(); 
    }, []);

   const getContext = () => {
        let readText = '';
        const descriptionBlocks = document.getElementsByClassName('apt-info');

        // Loop through each description block
        Array.from(descriptionBlocks).forEach(descriptionBlock => {
        
            // Access the child nodes of each description block
            Array.from(descriptionBlock.childNodes).forEach(childNode => {
                if (childNode.id === 'map-container') {
                    // Skip processing if the child node has the id 'map-container'
                    return;
                }
                if (childNode.tagName === 'BUTTON') { // Check if the childNode is a button element
                    readText += 'Click button ' + childNode.textContent + ' ';
                } else {
                    readText += childNode.textContent + ' ';
                }
            });
        });

        setReadContent(readText);
   };

    const location = useLocation();
    const apartment = location.state?.apartment;


    let navigate = useNavigate();

    const handleInterestedClick = () => {
        if (isLoggedIn) {
            setIsModalOpen(true);
        } else {
            navigate('/profil', { replace: true });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const [isReported, setIsReported] = useState(false);

    const handleReport = async() => {
        if (isLoggedIn) {
            setIsReported(true);
            if(apartment.reports > 3){
                await removeRelease(apartment._id);
            }else{
                await reportRelease(apartment._id);
            }

            // remove cached data
            localStorage.removeItem('leases');
            const keysToRemove = Object.keys(localStorage).
                filter(key => key.includes(`leases:${apartment.city}:`));
            console.log(keysToRemove)
            keysToRemove.forEach(key => localStorage.removeItem(key));

        } else {
            navigate('/profil', { replace: true });
        }
    };

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
        <div>
            <div id="apartment-information">
                <ApartmentImages imagesLinks={apartment.images}/>
                <div className='apt-info'>
                    <h3>
                        {/* {translateFurnishing(apartment.furnishing)} {t('AptsList.aptlocation')} {apartment.address}, {apartment.city} */}
                        {t('apartmentInfo', {
                            furnishing: translateFurnishing(apartment.furnishing),
                            aptLocation: t('AptsList.aptlocation'),
                            address: apartment.address,
                            city: apartment.city
                        })}
                    </h3>
                    <h4>
                        <br></br>
                        <strong>{t('Post.rentprice')}:</strong> {t('AptsList.price', { apartmentPrice: apartment.rentPrice })}
                        <br></br>
                        <strong>{t('Post.floor')}:</strong> {apartment.floor}
                        <br></br>
                        <strong>{t('Post.size')}:</strong> {apartment.size}
                        <br></br>
                        <strong>{t('Post.beds')}:</strong> {apartment.bhk}
                        <br></br>
                        <strong>{t('Post.baths')}:</strong> {apartment.bathroom}
                        <br></br>
                        <strong>{t('Post.furnishing')}:</strong> {translateFurnishing(apartment.furnishing)}
                        <br></br>
                        <strong>{t('Apt.postdate')}:</strong> {apartment.postedDate}  
                    </h4>
                    <LeaseMap address={apartment.address}></LeaseMap>
                    <br></br>
                    <h6>
                    {t('Apt.moreinfo')}
                    </h6>
                    <button onClick={handleInterestedClick}>{t('Apt.interested')}</button>   
                    <br/>
                    <br/>
                    <div id="service-tools">
                        {/* Button to translate text */}
                        <SayButton
                            className="speech-btn"
                            text={content}
                        >
                            {t('Apt.readtxt')}
                        </SayButton>
                        {!isReported ? (
                            <div id="report-space">
                                <p>{t('Apt.problems')}</p>
                                <button id="report-btn" onClick={handleReport}>{t('Apt.report')}</button>
                            </div>
                        ) : (
                            <p id="report-message">{t('Apt.msg')}</p>
                        )}     
                    </div>        
                </div>
            </div>
            

            {/* Modal to display tenant's contact information */}
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                contentLabel="Contact Information Modal"
            >
                <Box className='box'>
                <Typography variant="h6" component="h2">
                    {t('Contact.contactinfo')}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                     {apartment.pointOfContact}
                </Typography>
                </Box>
            </Modal>
        </div>
    )
}


async function removeRelease(id){
    try {
        await fetch('/leaseDelete/' + id, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ id: id }) 
        });

    } catch (error) {
        console.error('Error:', error);
    }

}

async function reportRelease(id){
    try {
        await fetch('/leaseReport/' + id, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ id: id }) 
        });

    } catch (error) {
        console.error('Error:', error);
    }
}
