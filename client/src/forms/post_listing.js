import { React, useState } from 'react';
import './post_listing.css';
import AddressAutocompleteForm from './addressAutocomplete';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PostListing() {
  const location = useLocation();
  const email = location.state?.email;
  const { t } = useTranslation();



  const [rentPrice, setRentPrice] = useState('');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [preferredTentant, setpreferredTentant] = useState('');
  const [files, setFiles] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'city':
        setCity(value);
        break;
      case 'rentPrice':
        setRentPrice(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'contactInfo':
        setContactInfo(value);
        break;
      case 'size':
        setSize(value);
        break;
      case 'bedrooms':
        setBedrooms(value);
        break;
      case 'bathrooms':
        setBathrooms(value);
        break;
      case 'floorNumber':
        setFloorNumber(value);
        break;
      case 'furnishing':
        setFurnishing(value);
        break;
      case 'preferredTentant':
        setpreferredTentant(value);
      break;
      case 'images':
        setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
        break;
      default:
        break;
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const isFormValid = () => {

    const validTextFields = [city, address, description, contactInfo, preferredTentant].every((field) => field.trim() !== '')
    const validNumFields = [rentPrice, size, bedrooms, bathrooms, floorNumber].every((field) => field.length > 0);
    const validFurnishing = ['Unfurnished', 'Semi-Furnished', 'Furnished'].includes(furnishing);


    return validTextFields && validNumFields && validFurnishing;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('city', city);
    formData.append('rentPrice', rentPrice);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('contactInfo', contactInfo);
    formData.append('size', size);
    formData.append('bedrooms', bedrooms);
    formData.append('bathrooms', bathrooms);
    formData.append('floorNumber', floorNumber);
    formData.append('furnishing', furnishing);
    formData.append('preferredTentant', preferredTentant);
    files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    //formdata
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await fetch('/leaseUpload', {
        method: 'POST',
        headers: {},
        body: formData,
      });

      alert('Submitted successfully');

      // remove cached data
      localStorage.removeItem('leases');
      const keysToRemove = Object.keys(localStorage).
          filter(key => key.includes(`leases:${city}:`));
      console.log(keysToRemove)
      keysToRemove.forEach(key => localStorage.removeItem(key));

      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting the form');
    }
  };

  const handleAddressChange = (event) => {
    const { value } = event.target;
    setAddress(value);
    fetchSuggestions(value);
  };
  

  const resetForm = () => {
    setCity('');
    setRentPrice('');
    setAddress('');
    setDescription('');
    setContactInfo('');
    setSize('');
    setBedrooms('');
    setBathrooms('');
    setFloorNumber('');
    setFurnishing('');
    setpreferredTentant('');
    setFiles([]);
  };

  const fetchSuggestions = async (value) => {
    const key = '487133b272ff44ca96e0b7e0c3427ac1';
    var requestOptions = {
      method: 'GET',
    };
    try {
      if(value.trim() !== ''){
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&apiKey=${key}`, requestOptions);
        const results = await response.json();
        const formattedList = results.features.map((address)=>{
          return address.properties.formatted;
        });
        setSuggestions(formattedList);
      }
    } catch (error) {
      setSuggestions([]);
      console.error('Error fetching suggestions:', error);
    }
  };
  

  return (
    <div className="post-listing-container">
      <h1 className="create-listing">{t('Post.title')}</h1>
      {email ? ( 
      <form onSubmit={handleSubmit} style={{marginBottom:"3rem"}}>
        <div className="float-container">
        <div className="float-child">

          <label htmlFor="rentPrice">{t('Post.rentprice')}</label>
          <input type="number" id="rentPrice" name="rentPrice" value={rentPrice} onChange={handleChange} min="0" />

          <label htmlFor="address">{t('Post.address')}</label>
          <AddressAutocompleteForm addresses={suggestions} readAddressInput={handleAddressChange} selectAddress={setAddress}/>  

          <label htmlFor="city">{t('Post.city')}</label>
          <input type="text" id="city" name="city" value={city} onChange={handleChange} />

          <label htmlFor="size">{t('Post.size')}</label>
          <input type="number" id="size" name="size" value={size} onChange={handleChange} />

          <label htmlFor="bedrooms">{t('Post.beds')}</label>
          <input type="number" id="bedrooms" name="bedrooms" value={bedrooms} onChange={handleChange} min="0" />

          <label htmlFor="bathrooms">{t('Post.baths')}</label>
          <input type="number" id="bathrooms" name="bathrooms" value={bathrooms} onChange={handleChange} min="0" />

          <label htmlFor="floorNumber">{t('Post.floor')}</label>
          <input type="number" id="floorNumber" name="floorNumber" value={floorNumber} onChange={handleChange} min="0" />

          <label htmlFor="furnishing">{t('Post.furnishing')}</label>
          <br></br>

          <div className="furnishing-options">
            <label>
              <input type="radio" id="unfurnished" name="furnishing" value="Unfurnished" checked={furnishing === 'Unfurnished'} onChange={handleChange}/>
              <span className="radio-circle"></span> {t('Post.unfur')}
            </label>

            <label>
              <input
                type="radio" id="semiFurnished" name="furnishing" value="Semi-Furnished" checked={furnishing === 'Semi-Furnished'} onChange={handleChange}/>
              <span className="radio-circle"></span> {t('Post.semifur')}
            </label>

            <label>
              <input
                type="radio" id="furnished" name="furnishing" value="Furnished" checked={furnishing === 'Furnished'} onChange={handleChange}/>
              <span className="radio-circle"></span> {t('Post.fur')}
            </label>
          </div>

          <br></br>

          <label htmlFor="preferredTentant">{t('Post.tenants')}</label>
          <input type="text" id="preferredTentant" name="preferredTentant" value={preferredTentant} onChange={handleChange} />

          <label htmlFor="description">{t('Post.desc')}</label>
          <textarea id="description" name="description" value={description} onChange={handleChange} />

          <label htmlFor="contactInfo">{t('Post.contact')}</label>
          <input type="text" id="contactInfo" name="contactInfo" value={contactInfo} onChange={handleChange} />
        </div>

        <div className="float-child">
          <div className="image-column">
            <label htmlFor="images">{t('Post.imgs')}</label>
            <input type="file" id="images" name="images" onChange={handleChange} multiple />
            
            <div className="image-preview">
              {files.map((file, index) => (
                
                <div key={index} className="image-container">
                  <img alt="Preview" src={URL.createObjectURL(file)} />
                  <button type="button" onClick={() => handleRemoveImage(index)}>
                    x
                  </button>
                </div>
              ))}
            </div>

          </div>
          </div>
        </div>
        <button type="submit" disabled={!isFormValid()}>{t('Post.submit')}</button>
      </form>
      ) : (
        <p>{t('Post.errmsg')}</p>
      )}
    </div>
  );
}


/** address api
 * 
 * https://apidocs.geoapify.com/docs/geocoding/address-autocomplete/#autocomplete
 * https://api.geoapify.com/v1/geocode/autocomplete?text=Lessingstra%C3%9Fe%203%2C%20Regensburg&format=json&apiKey=d548c5ed24604be6a9dd0d989631f783
 * https://api.geoapify.com/v1/geocode/autocomplete?text=7779&format=json&apiKey=d548c5ed24604be6a9dd0d989631f783
 * https://www.geoapify.com/tutorial/address-input-for-address-validation-and-address-verification-forms-tutorial
 */