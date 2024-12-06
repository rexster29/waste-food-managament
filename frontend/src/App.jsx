import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, withAuth } from './common/AuthProvider';
import persistor from './store/store';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { openDatabase } from './utils/indexedDBUtils';
const LandingPage = React.lazy(() => import('./pages/LandingPage/landingPage'))
const DonorLandingPage = withAuth(React.lazy(() => import('./pages/DonorPage/DonorLandingPage')))
const DonateHistory = withAuth(React.lazy(() => import('./pages/DonateHis/DonateHistory')))
const AvailableFood = React.lazy(() => import('./pages/AvailableFood/AvailableFood'))
const LogInSignUp = React.lazy(() => import('./pages/LoginPage/LogInSignUp'))
const DonorDetails = withAuth(React.lazy(() => import('./pages/DonorPage/DonorDetails')))
const ReceivedHistoryPage = withAuth(React.lazy(() => import('./pages/ReceivedHistory/ReceivedHistoryPage')))
const About = React.lazy(() => import('./pages/AboutPage/AboutPage'));
const Registration = React.lazy(() => import('./pages/RegistrationForm/Registration'))
const Profile = withAuth(React.lazy(() => import('./pages/Profile/Profile')))
const Fooddetails = React.lazy(() => import('./pages/fooddetails/fooddetails'))
const AvailableFoodDetails=React.lazy(()=>import('./pages/AvailableFood/AvailableFoodDetails'))
const ContactUs = React.lazy(() => import ("./pages/ContactUs/ContactUs"));
const clientId = '285807180215-an40t7r1rau490tt3f82knnnascdal3l.apps.googleusercontent.com';
function App() {
  (async () => {
    await openDatabase();
  })();
  return (
    <>
      <Provider store={persistor}>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <Router basename='/'>
              <div>
                <Suspense fallback={<div className="pre-loader"></div>}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/DonorLandingPage" element={<DonorLandingPage />} />
                    <Route path="/DonateHistory" element={<DonateHistory />} />
                    <Route path="/AvailableFood" element={<AvailableFood />} />
                    <Route path="/Login" element={<LogInSignUp />} />
                    <Route path="/ReceivedHistoryPage" element={<ReceivedHistoryPage />} />
                    <Route path="/DonorDetails" element={<DonorDetails />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Registration" element={<Registration />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/Fooddetails" element={<Fooddetails />} />
                    <Route path="/AvailableFoodDetails" element={<AvailableFoodDetails />} />
                    <Route path="/Contact" element={<ContactUs />} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </AuthProvider>
        </GoogleOAuthProvider>
    </Provider >
    </>
  )
}

export default App
