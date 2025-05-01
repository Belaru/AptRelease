import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './navigation/Nav';
import Home from './home/Home';
import LeasesList from './components/leasesList/leasesList';
import ApartmentPage from './apartmentDisplay/Apartment';
import PostListing from './forms/post_listing';
import Contact from './navigation/Contact';
import About from './navigation/About';
import Profil from './navigation/Profil';
import Footer from './footer/FooterPlace';
import { Suspense } from 'react';


function App() {
  const navigate = useNavigate();

  // Function to navigate to the ApartmentPage with apartment data
  const navigateToApartmentPage = (apartment) => {
    navigate(`/apartment/${apartment._id}`, { state: { apartment } });
  };

  // Function to navigate to the Leases page
  const navigateToLeases = () => {
    navigate(`/apartments`, {});
  };

  const navigateToPostListing = (email) => {
    navigate(`/post-listing/`, { state: { email } });
  }

  // const { t } = useTranslation();

  return (
    <>
      {/* <Navigation /> */}
      <div className="App">
      <Suspense fallback="...is loading">

        <Routes>
          <Route path="/" element={
            <>
              <Navigation />

              <Home navigateToApartments={navigateToLeases}/>
            </>
          } />

          <Route path="/apartment/:id" element={
            <> 
              <Navigation />

              <ApartmentPage/>
            </>   
          } />

          <Route path="/apartments/:City?" element={
            <> 
              <Navigation />

              <LeasesList navigateToApartmentPage={navigateToApartmentPage}/>
            </>
            } />
          {/* <Route
            path="/"
            element={
              <>
                <Home navigateToApartments={navigateToLeases} />
              </>
            }
          /> */}

          {/* <Route path="/apartment/:id" element={<ApartmentPage />} />

          <Route
            path="/apartments/:City?"
            element={
              <LeasesList navigateToApartmentPage={navigateToApartmentPage} />
            }
          /> */}

          <Route path="/post-listing" element={
              <>
              <Navigation />
              <PostListing />
            </>
          } />

          <Route path='/contact' element={
            <>
              <Navigation />
              <Contact />
            </>
          } />

          <Route path='/about' element={
            <>
              <Navigation />
              
              <About />
            </>
          } />

          <Route path='/profil' element={
            <>
              <Navigation />
              
              <Profil navigateToPostListing={navigateToPostListing} navigateToApartmentPage={navigateToApartmentPage}/>
            </>
          } />


        </Routes>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossorigin="anonymous"
        ></script>
        </Suspense>
      </div>
      <Footer/>
    </>
  );
}

export default App;
