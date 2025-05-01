import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Slider.css';

/**
 * ApartmentImages component for displaying apartment images.
 *
 * @component
 * @returns {JSX.Element} Rendered ApartmentImages component.
 */
function ApartmentImages({imagesLinks}) {

    return (
        <div id="apartment-images-slider">
            <Slide>
                {imagesLinks.map((slideImage, index)=> (
                <div key={index} className="slide-image">
                    <div
                        className="slide-image-inner"
                        style={{ backgroundImage: `url(${slideImage})` }}
                    />
                </div>
                ))} 
            </Slide>
        </div>
    )
}

export default ApartmentImages;

// https://www.npmjs.com/package/react-slideshow-image