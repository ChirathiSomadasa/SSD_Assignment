import React from 'react';
import { useLocation } from 'react-router-dom';
import './SearchFertilizer.css';
import yaraMila from '../../images/fertilizers/yaraMila.png';


function Details() {
  const location = useLocation();

  // Fallback product details
  const defaultProducts = [
    { 
    
      name: "UNIPOWER YaraMila Complex", 
      image: 'yaraMila', 
      description: "Yaramila is a range of high-quality, specialty fertilizers designed to meet the nutritional needs of various crops. These fertilizers provide essential macro and micronutrients, ensuring optimal plant growth and maximizing yield potential. Yaramila products are formulated to improve soil fertility, enhance nutrient uptake, and promote sustainable agricultural practices.",  
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
    yaraMila: yaraMila,
   
  };

  // Fallback image in case of missing image
  const productImage = productImages[product.image] || '../../images/fertilizers/yaraMila.png';

  return (
    <div className="details-container">
      <div className="details-left">
        <div className='product-image'>
          <img src={productImage} alt={product.name || "YaraMila"} />
        </div>

        <h3>Application Methods</h3>
        <ul className="application-methods">
          <li>Spray directly on leaves in the early morning</li>
          <li>Apply as a soil drench for deep penetration</li>
          <li>Use drip irrigation for even distribution</li>
        </ul>
      </div>

      <div className="details-right">
        <h1 className="product-name">Product Name: {product.name || "No product name available"}</h1>
        <p className="product-description">
          {product.description || "No description available."}
        </p>

        <h3>Precautions</h3>
        <ol>
                <li>Read the label: Always read and follow the instructions on the product label for application rates and safety guidelines.</li>
                <li>Protective gear: Wear appropriate protective clothing, gloves, and eye protection when handling the product to prevent skin and eye irritation.</li>
                <li>Avoid inhalation: Do not breathe in dust or fumes. Apply in a well-ventilated area.</li>
                <li>Keep away from children: Store the product out of reach of children and pets to prevent accidental ingestion.</li>
                <li>Environmental precautions: Avoid applying before heavy rainfall to reduce runoff into water bodies. Follow local regulations regarding fertilizer application to minimize environmental impact.</li>
                <li>Compatibility testing: If mixing with other fertilizers or pesticides, perform a compatibility test to prevent adverse reactions.</li>
            </ol>
       

        <h3>When to Apply</h3>
        <ol>
                <li>
                    <strong>Pre-Planting:</strong> Apply Yaramila fertilizers before planting to improve soil fertility and provide essential nutrients for seedling establishment.
                </li>
                <li>
                    <strong>Early Vegetative Stage:</strong> Use during the early vegetative stage to support root development and initial leaf growth.
                </li>
                <li>
                    <strong>Flowering Stage:</strong> Apply during the flowering stage to enhance flowering and fruit set, ensuring higher yield.
                </li>
                <li>
                    <strong>Post-Harvest:</strong> Consider applying post-harvest to replenish soil nutrients and prepare for the next planting cycle.
                </li>
                <li>
                    <strong>Soil Testing:</strong> Conduct soil tests to determine nutrient levels and tailor application timing and rates based on specific crop needs.
                </li>
            </ol>
        

        <h3 className="table-title">Application Guide</h3>
        <table className="application-table">
          <thead>
            <tr>
              <th>Target Pest/Disease</th>
              <th>Dose per Acre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Narrow Leaf Weeds</td>
              <td>1 liter</td>
            </tr>
            <tr>
              <td>Broad Leaf Weeds</td>
              <td>1.5 liters</td>
            </tr>
            <tr>
              <td>Sedges</td>
              <td>1.2 liters</td>
            </tr>
          </tbody>
        </table>

        <h3>Features and Benefits</h3>
        <ul className="features-benefits">
          <li>Provides long-lasting weed control</li>
          <li>Minimizes competition for nutrients</li>
          <li>Promotes healthy crop growth</li>
          <li>Rainfast within 2 hours of application</li>
        </ul>
      </div>
    </div>
  );
}

export default Details;
