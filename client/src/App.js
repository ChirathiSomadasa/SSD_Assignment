import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import Contact from './pages/contact/Contact';
import SignUp from './pages/signup/SignUp';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import ProblemForm from './pages/contact/ProblemForm';
import UpdateContact from './pages/contact/UpdateContact';
import AddSolution from './pages/contact/AddSolution';
import ManageDisease from './pages/contact/ManageDisease';
import Predictions from './pages/predictions/Predictions';
import PredictionResult from './pages/predictions/PredictionResult';
import EditResult from './pages/predictions/EditResult';
import SignOut from './pages/signout/SignOut';
import Map from './pages/map/Map';
import NotificationBell from './pages/map/NotificationBell';
import FertilizersAndPesticides from './pages/FertilizersAndPesticides/FertilizersAndPesticides';
import SearchFertilizer from './pages/FertilizersAndPesticides/searchFertilizer';
import Refill from './pages/FertilizersAndPesticides/refill';
import AddDetails from './pages/FertilizersAndPesticides/addDetails';
import EditDetails from './pages/FertilizersAndPesticides/editDetails';
import ViewAll from './pages/FertilizersAndPesticides/viewAll';
import Recommend from './pages/FertilizersAndPesticides/recommend';
import Details from './pages/FertilizersAndPesticides/details';
import Details2 from './pages/FertilizersAndPesticides/details2';
import Details3 from './pages/FertilizersAndPesticides/details3';
import Details4 from './pages/FertilizersAndPesticides/details4';
import Details5 from './pages/FertilizersAndPesticides/details5';
import Disposal from './pages/FertilizersAndPesticides/disposal';
import Solutions from './pages/FertilizersAndPesticides/solutions';
import ManageMySolution from './pages/contact/ManageMySolution';
import Profile from './pages/profile/Profile';   
function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
    <Route path="/contact" element={<Contact />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Home />} />
    <Route path="/contact/ProblemForm" element={<ProblemForm/>}/>
    <Route path="/contact/UpdateContact/:id" element={<UpdateContact/>}/>
    <Route path="/contact/AddSolution/:id" element={<AddSolution/>}/>
    <Route path="/contact/ManageDisease" element={<ManageDisease/>}/>
    <Route path="/contact/ManageMySolution" element={<ManageMySolution/>}/>
    <Route path="/predictions" element={<Predictions />} />
    <Route path="/predictionResult" element={<PredictionResult />} />
    <Route path="/EditResult/:id" element={<EditResult />} />
    <Route path="/signout" element={<SignOut />} />
    <Route path="/map/Map" element={<Map/>}/>
    <Route path="/map" element={<Map />} />
    <Route path="/notification" element={<NotificationBell />} />
    <Route path="/FertilizersAndPesticides" element={<FertilizersAndPesticides />} />
    <Route path="/SearchFertilizer" element={<SearchFertilizer/>}/>
    <Route path= "/refill" element={<Refill/>}/>
    <Route path= "/addDetails" element={<AddDetails/>}/>
    <Route path= "/editDetails/:id" element={<EditDetails/>}/>
    <Route path="/view" element={<ViewAll/>}/>
    <Route path="/recommend" element={<Recommend/>}/>
    <Route path="/details1" element={<Details/>}/>
    <Route path="/details2" element={<Details2/>}/>
    <Route path="/details3" element={<Details3/>}/>
    <Route path="/details4" element={<Details4/>}/>
    <Route path="/details5" element={<Details5/>}/>
    <Route path="/disposal" element={<Disposal/>}/>
    <Route path="/recommendform" element={<Solutions/>}/>
    <Route path="/profile/Profile" element={<Profile/>}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
