import React from 'react';
import { useLocation } from 'react-router-dom';
import './SearchFertilizer.css';
import RiceStar from '../../images/fertilizers/ricestar.png';


function Details3() {
  const location = useLocation();

  // Fallback product details
  const defaultProducts = [
    { 
    
      name: "Ricestar Fenoxaprop-p-ethyl 6.9 EC Herbicide", 
      image: 'RiceStar', 
      description: "Ricestar is a selective post-emergent herbicide recommended for the control of grassy weeds, especially Echinochloa spp. in direct-seeded and transplanted rice. It contains Fenoxaprop-p-ethyl as an active ingredient which offers flexibility in the application window. When combined as a tank mix with a broadleaf herbicide like Sunrice it can offer total control of the rice weed spectrum. Fenoxaprop-p-ethyl is absorbed by the leaves and stems of the plants and is translocated systemically. It predominantly inhibits the synthesis of fatty acids in the meristem tissue of grassy weeds.", 
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
    RiceStar:RiceStar,
   
  };

  // Fallback image in case of missing image
  const productImage = productImages[product.image] || '../../images/fertilizers/ricestar.jpg';

  return (
    <div className="details-container">
      <div className="details-left">
        <div className='product-image'>
          <img src={productImage} alt={product.name || "RiceStar"} />
        </div>
        
      </div>

      <div className="details-right">
        <h1 className="product-name">Product Name: {product.name || "No product name available"}</h1>
        <p className="product-description">
          {product.description || "No description available."}
          <ul className="application-methods">
          <li>
          Effective grass control - a wide range of grasses controlled.</li>
          <li>Excellent plant selectivity - safe to crops at recommended dosages.</li>
          <li>Flexibility in application time - 3-5 leaf stages, used as Early Post Emergent herbicide.</li>
          <li>Excellent combining ability with Early Post Emergent Broadleaf / Sedge controlling rice herbicides (i.e. Sunrise)</li>
        </ul>
        </p>


        <h3>Features and Benefits</h3>
        <ul className="features-benefits">
          <li>Provides long-lasting weed control</li>
          <li>Minimizes competition for nutrients</li>
          <li>Promotes healthy crop growth</li>
          <li>Rainfast within 2 hours of application</li>
        </ul>
        <p>Dosage: 350 ML per Acre.</p>

       
<div  className="question-container" >
<h3 className="question-topic">Common Questions regarding the product</h3>
    <ol>
        <li><strong>What is Ricestar Fenoxaprop-p-ethyl 6.9% EC Herbicide?</strong>
            <p>Answer: Ricestar is a post-emergent herbicide containing fenoxaprop-p-ethyl, designed to control a broad spectrum of grass weeds in various crops.</p>
        </li>
        <li><strong>How does Ricestar herbicide work?</strong>
            <p>Answer: It works by inhibiting the growth of grass weeds, effectively disrupting their ability to develop and spread, ultimately leading to their death.</p>
        </li>
        <li><strong>What crops can Ricestar herbicide be used on?</strong>
            <p>Answer: Ricestar is mainly used in rice and wheat fields but can also be suitable for use in other crops where grass weed control is necessary.</p>
        </li>
        <li><strong>What are the primary benefits of using Ricestar herbicide?</strong>
            <p>Answer: Benefits include effective control of both annual and perennial grass weeds, ease of application, and safety for the crop when used as directed.</p>
        </li>
        <li><strong>What is the recommended dosage for Ricestar herbicide?</strong>
            <p>Answer: The recommended dosage varies depending on the type of weed and crop. Generally, it is applied at 0.8-1.2 liters per hectare. Always refer to the product label for specific instructions.</p>
        </li>
        <li><strong>When should Ricestar herbicide be applied?</strong>
            <p>Answer: It should be applied post-emergence when the grass weeds are actively growing and before they reach a mature stage. Early application ensures better control.</p>
        </li>
        <li><strong>Can Ricestar be mixed with other pesticides or fertilizers?</strong>
            <p>Answer: Ricestar can be tank-mixed with other herbicides or pesticides, but it is essential to perform a compatibility test and consult the product label or an expert before mixing.</p>
        </li>
    </ol>
</div>



      </div>
    </div>
  );
}

export default Details3;
