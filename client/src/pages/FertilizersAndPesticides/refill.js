import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Refill.css';


function Refill() {
  const navigate = useNavigate();
  
    return (
        <div className="detail-container">
            <div className="refillcontainer">
  <h2 className="refill-title"><span className="emoji">🌱</span> Need a Refill? We've Got You Covered!</h2>
  <p className="refill-info">
    Running low on fertilizer? No worries! Request your refill with just a click.
  </p>
  <div className="refill-details">
    <p><strong><span className="emoji">💰</span> Pricing:</strong> The price is for the product only—container not included!</p>
    <p><strong><span className="emoji">🚚</span> Delivery Charge:</strong> Just 250 rupees to bring it right to your doorstep.</p>
  </div>
</div>

            <button
                type="button"
                className="add_button"
                onClick={() => navigate('/AddDetails')}
            >
                Add Details 
            </button>
            <button
                type="button"
                className="View_button"
                onClick={() => navigate('/view')}
            >
                View Details 
            </button>
            
        </div>
    );
}

export default Refill;
