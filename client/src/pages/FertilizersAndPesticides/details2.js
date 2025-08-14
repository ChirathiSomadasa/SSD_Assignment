import React from 'react';
import { useLocation } from 'react-router-dom';
import './SearchFertilizer.css';
import PADDYGrow from '../../images/fertilizers/paddyGrow.jpg';


function Details2() {
  const location = useLocation();

  // Fallback product details
  const defaultProducts = [
    { 
        id: 1,
      name: "PADDY GROW - Paddy Microbial Consortia", 
      image: 'PADDYGrow', 
      description: "AMRUTH PMC is an exclusive formulated liquid bio-fertilizer consisting of nutrients, proteins, plant growth and development", 
    },
    
  ];

  let product;
  if (location.state?.product) {
    product = location.state.product;
  } else if (location.state?.productId) {
    product = defaultProducts.find(p => p.id === location.state.productId) || defaultProducts[0];
  } else {
    product = defaultProducts[0];
  }
  const productImages = {
    PADDYGrow:PADDYGrow,
   
  };

  // Fallback image in case of missing image
  const productImage = productImages[product.image] || '../../images/fertilizers/paddyGrow.jpg';

  return (
    <div className="details-container">
      <div className="details-left">
        <div className='product-image'>
          <img src={productImage} alt={product.name || "PADDYGrow"} />
        </div>
        
      </div>

      <div className="details-right">
        <h1 className="product-name">Product Name: {product.name || "No product name available"}</h1>
        <p className="product-description">
        <h4>DESCRIPTION</h4>
          {product.description || "No description available."}
        </p>

        <h3>Features and Benefits</h3>
        <ul className="features-benefits">
          <li>
          Paddy requires more of Nitrogen Phosphorous & Potassium, supply to the plant so that the formulation is supplemented with an additional micro aerophilic bacteria such as Azospirillium sp which fixes atmospheric Nitrogen in water logged condition.</li>
          <li>AMRUTH PMC increases plant growth and development because of better soil health and increases more filled spikelet's and crop yield.</li>
          <li>Due to all the above mentioned beneficial factors the crop yield will increase by 10-20%.</li>
        </ul>

        <h3>Application on Crops</h3>
        <ul className="application-methods">
          <li>Root treatment:- Mix 500 ml AMRUTH PMC in 1 liters of water, Dip the seedlings in this solution for 20-30 minutes before planting.</li>
          <li>Soil treatment:- Mix 5 liters AMRUTH PMC with 300-400 kg of AMRUTH GOLD / FYM and apply before planting.</li>
          
        </ul>

      <p>Sold by: AMRUTH ORGANIC FERTILIZERS</p>
      </div>
    </div>
  );
}

export default Details2;
