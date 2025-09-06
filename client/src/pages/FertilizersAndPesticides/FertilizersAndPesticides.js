import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FertilizersAndPesticides.css';
import yaraMilaImage from '../../images/fertilizers/yaraMila.png'; 
import Urea from '../../images/fertilizers/urea.png';
import GOLDPOWER from '../../images/fertilizers/goldpower.png';
import TATA from '../../images/fertilizers/TATA.jpg';
import PADDYGrow from '../../images/fertilizers/paddyGrow.jpg';
import RALLIGOLD from '../../images/fertilizers/Ralliigold.png';

// Fertilizer data
const fertilizers = [
  { name: 'UNIPOWER YaraMila Complex', description: 'A balanced fertilizer blend that provides essential nutrients like nitrogen, phosphorus, and potassium, promoting healthy growth and high yields in paddy fields.', image: yaraMilaImage },
  { name: 'PADDY GROW - Paddy Microbial Consortia - PMC SOIL RICH ', description: 'This bio-fertilizer supports healthy plant growth and development, improving root structure, increasing nutrient uptake, and boosting crop resilience.', image: PADDYGrow },
  { name: 'GOLDPOWER Captan 70% + Hexaconazole 5% WP Fungicides', description: 'GOLDPOWER is a dual-action fungicide with Captan 70% and Hexaconazole 5% WP, offering both protective and systemic control against a wide range of fungal diseases in crops.', image: GOLDPOWER },
  { name: 'Tata CONTAF PLUS Hexaconazole 5% SC Fungicide', description: 'Tata CONTAF PLUS is a systemic fungicide containing Hexaconazole 5% SC (Suspension Concentrate), designed to control a wide range of fungal diseases in crops.', image: TATA },
  { name: 'HAYLEYS Urea 50KG', description: 'UREA fertilizer makes it an easily accessible nutrient for paddy plants. Urea helps increase rice productivity, particularly during key growth stages, resulting in higher yields and stronger, more resilient crops.', image: Urea },
  { name: 'Tata Rallis RALLIGOLD GR BIO FERTILIZER', description: 'Tata Rallis RALLIGOLD GR is a bio-fertilizer in granular form designed to enhance soil fertility and promote healthy crop growth by reducing the reliance on chemical fertilizers while improving crop yield and soil health', image: RALLIGOLD },
];

function FertilizersAndPesticides() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // ✅ Check for user login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fertilizers.length);
  };

  useEffect(() => {
    const intervalId = setInterval(() => nextCard(), 3000);
    return () => clearInterval(intervalId);
  }, []);

  const onSearchButtonClick = () => navigate("/searchFertilizer");
  const onRefillButtonClick = () => navigate("/refill");
  const onDisposalButtonClick = () => navigate("/disposal");

  return (
    <div>
      <div className='parallax1'>
        <div className="fertilizer_centered"><h1>Nourish the earth, see your harvest’s worth.</h1></div>
      </div>
      
      <div className="fertilizer-container">
        <div className="action-buttons">
          <button className="searchProduct-button" onClick={onSearchButtonClick}>Search Fertilizer or Pesticides</button>
          <button className="refillProduct-button" onClick={onRefillButtonClick}>Refill</button>
          <button className="disposalProduct-button" onClick={onDisposalButtonClick}>Disposal</button>
        </div>

        <div className="fertilizer-slider-container">
          <div className="fcards-container">
            {fertilizers.map((fertilizer, index) => (
              <div
                key={index}
                className={`fcard ${index === currentIndex ? 'active' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                <img src={fertilizer.image} alt={fertilizer.name} />
                <div className="fcard-content">
                  <h2>{fertilizer.name}</h2>
                  <p>{fertilizer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FertilizersAndPesticides;
