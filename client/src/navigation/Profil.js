import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Profil.css';
import { FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';



export default function Profil({navigateToPostListing, navigateToApartmentPage}) {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    // const [otherField, setOtherField] = useState('');
    const [click, setClick] = useState(false);
    const [leases, setLeases] = useState([]);
    const handleClick = () => setClick(!click);

    const { t } = useTranslation();
    // const navigate = useNavigate();



    const handleLogin = async (response) => {
        try {
          const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
              idToken: response.credential,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (res.ok) {
            const data = await res.json();
            console.log(data);
            // Update state with the login status and username
            setIsLoggedIn(true);
            // console.log('useremail', data.data.email);
            setUsername(data.data.email);
            setName(data.data.name);
    
            // store user email in local storage
            localStorage.setItem('username', data.data.email);
            localStorage.setItem('name', data.data.name);
    
          } else {
            console.error('Login failed');
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
      };
    
      const handleLogout = async () => {
        try {
          const response = await fetch('/logout', {
            method: 'DELETE',
          });
    
          if (response.ok) {
    
            //clear user email form local storage
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            //updating state to indicate user is logged out
            setIsLoggedIn(false);
            setUsername('');
            setName('');
          } else {
            console.error('Logout failed');
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
      };
    
      useEffect(() => {
        let mounted = true;
    
        //fetch data from the restricted access API when component mounts
        // fetch('/restrictedAccess')
        //   .then(response => {
        //     //check if the component is still mounted before updating state
        //     if (mounted) {
        //       //check if the response status is 200
        //       if (response.status === 200) {
        //         //if the response status is 200, extract data and set state
        //         return response.json().then(data => {
        //         //   setOtherField(data.userId);
        //         });
        //       } else {
        //         //if the response status is not 200, handle error
        //         throw new Error('Unauthorized');
        //       }
        //     }
    
        //   })
        //   .catch(error => {
        //     console.error('Error fetching data:', error);
        //     // setOtherField('');
        //   });
    
        //cleanup to set mounted to false when the component unmounts
        return () => {
          mounted = false;
        };
      }, [username]);
    
      useEffect(() => {
        //check if the user email & name exists in local storage
        const storedUsername = localStorage.getItem('username');
        const storedname = localStorage.getItem('name');
        if (storedUsername && storedname) {
          setUsername(storedUsername);
          setName(storedname);
          setIsLoggedIn(true);
        }
      }, []);

      useEffect(() => {
        if (isLoggedIn) {
            // Fetch the user's leases
            fetchUserLeases(username);
        }
    }, [isLoggedIn, username]);

    const fetchUserLeases = async (username) => {
        try {
            const response = await fetch(`/userProfile/${username}`);
            if (response.ok) {
                const data = await response.json();
                setLeases(data.response.leases);
            } else {
                console.error('Failed to fetch user leases');
            }
        } catch (error) {
            console.error('Error fetching user leases:', error);
        }
    };

    // const navigateToListing = (leaseid) => {
    //   navigate(`apartment/${leaseid}`);
    // }
    const deleteLease = async (leaseTodelete) => {
      try {
          const confirmation = window.confirm('Are you sure you want to delete this listing?');
          if (confirmation) {
              const response = await fetch(`/leaseDelete/${leaseTodelete._id}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email: username }),
              });
              if (response.ok) {
                  setLeases(leases.filter(lease => lease._id !== leaseTodelete._id));


                  // remove cached data
                  localStorage.removeItem('leases');
                  const keysToRemove = Object.keys(localStorage).
                      filter(key => key.includes(`leases:${leaseTodelete.city}:`));
                  console.log(keysToRemove)
                  keysToRemove.forEach(key => localStorage.removeItem(key));
              } else {
                  console.error('Failed to delete lease');
              }
          }
      } catch (error) {
          console.error('Error deleting lease:', error);
      }
  };


//   const navigateToPost = () => {
//     if (isLoggedIn) {
//         console.log("logged in");
//         navigateToPostListing(username); //redirect to the post listing page
//     } else {
//         console.log("not logged in");
//         navigate('/profil'); //redirect to the login page if not logged in
//     }
// };

    return(
        <div className="profil">
            <h1>{t('Nav.profil')}</h1>
            <br></br>
            <div>
            {isLoggedIn ? (
            <div className="user-info">
                <p>{t('Profil.welcome')} {name}!</p>
                </div>
            ) : (

            <div className="login-button">
                <GoogleLogin onSuccess={handleLogin} onError={() => console.log('Login failed')} />
            </div>

            )}
        </div>
            {isLoggedIn && (
            <div className="nav-item">
              <button className="post-listing-btn" onClick={() => {
                navigateToPostListing(username);
                // navigateToPost();
                }}>
                {t('Profil.post')}
              </button>
            </div>
            )}

            {isLoggedIn && (
            <div className="nav-item">
              <button className="logout-button" onClick={handleLogout}>{t('Profil.logout')}</button>
            </div>
            )}
        
        {isLoggedIn  && (
                <div className="user-leases">
                    <h3>{t('Profil.yourleases')}</h3>
                    <ul>
                    {leases.map((lease, index) => (
                      <li key={index} className="lease-item">
                        <div className="lease-details">
                          <p className="lease-info"><strong>{t('Profil.posteddate')}</strong> {lease.postedDate}</p>
                          <p className="lease-info"><strong>{t('Profil.address')}</strong> {lease.address}</p>
                          <p className="lease-info"><strong>{t('Profil.price')}</strong> ${lease.rentPrice}</p>
                        </div>
                        <button className="view-listing-btn"onClick={() => navigateToApartmentPage(lease)}>View Listing</button>
                        <i className="delete-lease-btn" onClick={() => deleteLease(lease)}>
                            <FaTrash />
                        </i>
                      </li>
                  ))}
                    </ul>
                </div>
            )}

        </div>
    );
}
