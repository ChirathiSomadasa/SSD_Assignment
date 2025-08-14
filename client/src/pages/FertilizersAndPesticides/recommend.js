import React, { useEffect } from 'react';
import './recommend.css';
import Problems from '../../images/fertilizers/problem.jpg';
import RiceBlast1 from '../../images/fertilizers/riceblast1.jpg';
import RiceBlast2 from '../../images/fertilizers/riceblast2.jpg';
import Cover from '../../images/fertilizers/cover.png';
import LEAF from '../../images/fertilizers/leafFolder.png';
import STEM from '../../images/fertilizers/stem.png';
import yaraMila from '../../images/fertilizers/yaraMila.png';
import ricestar from '../../images/fertilizers/ricestar.png';
import weed1 from '../../images/fertilizers/weed1.jpg';
import weed2 from '../../images/fertilizers/weed2.jpg';
import Ralliigold from '../../images/fertilizers/Ralliigold.png';
import soil1 from '../../images/fertilizers/soil1.jpeg';
import soil2 from '../../images/fertilizers/soil2.png';

function Recommend() {

    // Image sources for each pest or disease
    const pestImages = {
        RiceBlast: [
            RiceBlast1,
            RiceBlast2,
            
        ],

        stemBorer:[
            LEAF,
            STEM,
        ],

        ricestar:[
            weed1,
            weed2,
        ],
        Ralliigold:[
            soil1,
            soil2,

        ]
    };

    // Function to change the images using React refs
    const rotateImages = (imageElementId, images) => {
        let index = 0;
        const changeImage = () => {
            const imageElement = document.getElementById(imageElementId);
            if (imageElement) {
                imageElement.src = images[index];
                index = (index + 1) % images.length; // Rotate index
            }
        };
        setInterval(changeImage, 3000); // Change image every second
    };

    // useEffect hook to handle lifecycle and image rotation
    useEffect(() => {
        rotateImages('RiceBlast', pestImages.RiceBlast);
        rotateImages('stemBorer', pestImages.stemBorer);
        rotateImages('ricestar', pestImages.ricestar);
        rotateImages('RalliiGold', pestImages.Ralliigold);
    }, []);

    return (
        <div className="recommend-container">
            <h1>Problems Faced By Farmers</h1>
            <p className='product'>Weeds, Insectes & Diseases causes harms to the crop and farmers lose an estimated average of 37% of their rice crop due to pests & diseases every year. In addition to good crop management, timely and accurate diagnosis of these pest & diseases and proper chemical management can significantly reduce these losses.</p>
            <div className='problem'><img src={Problems} alt="Farmer in distress" /></div>
            <table className="recommend-table">
                <thead>
                    <tr>
                        <th>Pests Or Diseases</th>
                        <th>Recommended Product Solutions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td className="pest-section">
                            <h3>Rice Blast Disease</h3>
                            <div className="rotating-section">
                                <img id="RiceBlast" className="pest-image" src={pestImages.RiceBlast[0]} alt="Rice Blast Disease" />
                            </div>
                            
                        </td>
                        <td className="product-section">
                        <img className="product_image" src={yaraMila} alt="Chemfa Product" />

                            <p className='product'>Spray in Splits to reduce excessive growth.</p>
                        </td>
                        
                    </tr>
                    <tr>
                    <td className="pest-section">
                            <h3>Stem-Borer & Leaf-Folder</h3>
                            <div className="rotating-section">
                                <img id="stemBorer" className="pest-image" src={pestImages.stemBorer[0]} alt="stem-borer Disease" />
                            </div>
                            
                        </td>
                        <td className="product-section">
                        <img className="product_image" src={Cover} alt="StemBorer" />
                            <p className='product'>Mix the recommended dose of Chlorantraniliprole with water. Typically, the dosage ranges from 0.5 to 1.0 liters per hectare (check the label for precise rates).
                            Apply at the first sign of pest infestation or as a preventive measure. Timing may vary based on the crop and pest.
                            </p>
                        </td>
                        
                    </tr>
                    <tr>
                    <td className="pest-section">
                            <h3> barnyard grass, foxtail, and crabgrass weeds</h3>
                            <div className="rotating-section">
                                <img id="ricestar" className="pest-image" src={pestImages.ricestar[0]} alt="weeds" />
                            </div>
                            
                        </td>
                        <td className="product-section">
                        <img className="product_image" src={ricestar} alt="Chemfa Product" />
                            <p className='product'> The recommended dosage varies depending on the type of weed and crop. Generally, it is applied at 0.8-1.2 liters per hectare. Always refer to the product label for specific instructions.
                              It should be applied post-emergence when the grass weeds are actively growing and before they reach a mature stage. Early application ensures better control.</p>
                        </td>
                        
                    </tr>
                    <tr>
                    <td className="pest-section">
                            <h3>Soil Fertilizer</h3>
                            <div className="rotating-section">
                                <img id="RalliiGold" className="pest-image" src={pestImages.Ralliigold[0]} alt=" Disease" />
                            </div>
                            
                        </td>
                        <td className="product-section">
                        <img className="Ralligold" src={Ralliigold} alt="RalliiGold" />
                            <p className='product'>It should be applied directly to the soil either by broadcasting or placing it near the root zone during planting. Watering after application helps activate the bio-fertilizer.
 The general recommended dosage is 5-10 kg per acre, depending on the crop and soil conditions. Always refer to the product label for specific dosage instructions.</p>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Recommend;
