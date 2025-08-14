import React, { useState } from 'react';
import './SearchFertilizer.css';
import Loading_screen from '../../images/fertilizers/Loading_screen.gif'; 
import yaraMilaImage from '../../images/fertilizers/yaraMila.png'; 
import Urea from '../../images/fertilizers/urea.png';
import GOLDPOWER from '../../images/fertilizers/goldpower.png';
import TATA from '../../images/fertilizers/TATA.jpg';
import PADDYGrow from '../../images/fertilizers/paddyGrow.jpg';
import RALLIGOLD from '../../images/fertilizers/Ralliigold.png';
import Cover from '../../images/fertilizers/cover.png';
import RiceStar from '../../images/fertilizers/ricestar.png';

const fertilizers = [
    { 
        name: "UNIPOWER YaraMila Complex",
        brand: "EcoGreen",
        amount: "25kg",
        description: "Organic compost is perfect for enriching soil and improving plant health.",
        type: 'fertilizer',
        image: yaraMilaImage,
    },
    {
        name: "PADDY GROW - Paddy Microbial Consortia",
        brand: "Amruth Organic Fertilizers",
        amount: "5L",
        description: "AMRUTH PMC is an exclusive formulated liquid bio-fertilizer consisting of nutrients, proteins, plant growth and development.",
        type: 'fertilizer',
        image: PADDYGrow,
    },
    {
        name: "Urea Granules",
        brand: "AgriBest",
        amount: "5kg",
        description: "Urea granules provide a high source of nitrogen, promoting vigorous plant growth and higher yields.",
        type: "fertilizer",
        image: Urea,
    },
    {
        name: 'Tata Rallis RALLIGOLD GR BIO FERTILIZER',
        brand: "TATA",
        amount: "3L",
        description: 'Tata Rallis RALLIGOLD GR is a bio-fertilizer in granular form designed to enhance soil fertility and promote healthy crop growth.',
        type: "fertilizer",
        image: RALLIGOLD,
    },
];

const pesticides = [
    {
        name: "Ricestar Fenoxaprop-p-ethyl 6.9 EC",
        brand: "Bayer",
        amount: "1L",
        description: "Ricestar is a post-emergent herbicide designed to control a broad spectrum of grass weeds in paddy crops.",
        type: 'pesticide',
        category: 'herbicide',
        image: RiceStar,
    },
    {
        name: "Dhanuka Cover Chlorantraniliprole 18.5% SC",
        brand: "Dhanuka",
        amount: "60ml / 150ml",
        description: "Cover Insecticide Liquid provides effective and long duration protection in crops like Paddy.",
        type: 'pesticide',
        category: 'insecticide',
        image: Cover,
    },
    {
        name: "GOLDPOWER Captan 70% + Hexaconazole 5% WP",
        brand: "Star Chemicals",
        amount: "250g / 500g / 1kg",
        description: "It is a unique combination of contact & systemic mode of action with protective and curative action.",
        type: 'pesticide',
        category: 'fungicide',
        image: GOLDPOWER, 
    },
    {
        name: 'Tata CONTAF PLUS Hexaconazole 5% SC Fungicide',
        brand: "Amruth Organic Fertilizers",
        amount: "1L",
        description: 'Tata CONTAF PLUS is a systemic fungicide designed to control a wide range of fungal diseases in crops.',
        type: "fungicide",
        image: TATA,
    },
];

function getRandomProduct(products) {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
}

function Solutions() {
    const [selection, setSelection] = useState('');
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [solution, setSolution] = useState(null);
    const [usedProducts, setUsedProducts] = useState([]);

    const handleSelectionChange = (e) => {
        setSelection(e.target.value);
        setFormData({});
        setSolution(null); 
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate a network call to get the solution
        setTimeout(() => {
            let selectedProduct;
            if (selection === 'Fertilizer') {
                const availableFertilizers = fertilizers.filter(f => !usedProducts.includes(f.name));
                selectedProduct = availableFertilizers.length ? getRandomProduct(availableFertilizers) : null;
            } else {
                const availablePesticides = pesticides.filter(p => !usedProducts.includes(p.name));
                selectedProduct = availablePesticides.length ? getRandomProduct(availablePesticides) : null;
            }

            if (selectedProduct) {
                setUsedProducts(prev => [...prev, selectedProduct.name]);
                setSolution(selectedProduct);
            } else {
                alert('No more products available for selection.');
            }
            setLoading(false);
        }, 5000);
    };

    return (
        <div className="search-fertilizer-container">
            <div c>
                <table className='solution-table'>
                    <thead>
                        <tr>
                            <th>You are looking for:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select onChange={handleSelectionChange} value={selection}>
                                    <option value="">Select...</option>
                                    <option value="Fertilizer">Fertilizer</option>
                                    <option value="Pesticide">Pesticide</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {selection === 'Fertilizer' && (
                    <form onSubmit={handleSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="labelSolution">Crop Type:</td>
                                    <td>
                                        <select className="selectSolution" name="crop Type" onChange={handleInputChange} required>
                                            <option value="">Select Crop Type</option>
                                            <option value="Suwandel">Suwandel</option>
                                            <option value="Kalu Heenati">Kalu Heenati</option>
                                            <option value="Maa-Wee">Maa-Wee</option>
                                            <option value="Pachchaperumal">Pachchaperumal</option>
                                            <option value="Kuruluthuda">Kuruluthuda</option>
                                            <option value="Water Lilly Rice">Water Lilly Rice</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="labelSolution">Soil Type:</td>
                                    <td>
                                        <select className="selectSolution" name="soil Type" onChange={handleInputChange} required>
                                            <option value="">Select Soil Type</option>
                                            <option value="Reddish Brown Earth">Reddish Brown Earth</option>
                                            <option value="Alluvial Soil">Alluvial Soil</option>
                                            <option value="Red Yellow Podzolic Soil">Red Yellow Podzolic Soil</option>
                                            <option value="Grumusol Soil">Grumusol Soil</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="labelSolution">Nutrient Requirement:</td>
                                    <td>
                                        <select className="selectSolution" name="nutrient Requirement" onChange={handleInputChange} required>
                                            <option value="">Select Nutrient Requirement</option>
                                            <option value="Nitrogen">Nitrogen</option>
                                            <option value="Phosphorus">Phosphorus</option>
                                            <option value="Potassium">Potassium</option>
                                            <option value="Calcium">Calcium</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="labelSolution">Local Climate Condition:</td>
                                    <td>
                                        <select className="selectSolution" name="climate Condition" onChange={handleInputChange} required>
                                            <option value="">Select Climate Condition</option>
                                            <option value="Dry">Dry</option>
                                            <option value="Rainy">Rainy</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <button type="submit" className="buttonSolution">Proceed</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                )}

                {selection === 'Pesticide' && (
                    <form onSubmit={handleSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="labelSolution">Pest Identification:</td>
                                    <td>
                                        <select className="selectSolution" name="pest Id" onChange={handleInputChange} required>
                                            <option value="">Select Pest</option>
                                            <option value="Brown Plant Hopper">Brown Plant Hopper</option>
                                            <option value="Rice Gall Midge">Rice Gall Midge</option>
                                            <option value="Rice Leaf Folder">Rice Leaf Folder</option>
                                            <option value="Rice Stem Borer">Rice Stem Borer</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="labelSolution">Weather Condition:</td>
                                    <td>
                                        <select className="selectSolution" name="weather Condition" onChange={handleInputChange} required>
                                            <option value="">Select Weather Condition</option>
                                            <option value="Dry">Dry</option>
                                            <option value="Rainy">Rainy</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <button type="submit" className='buttonSolution'>Proceed</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                )}

                {loading && (
                    <div className="loading">
                        <img 
                            className="status-video" 
                            src={Loading_screen} 
                            alt="Loading..." 
                        />
                    </div>
                )}

                {!loading && solution && (
                    <div className="solution-container">
                        <div className="input-summary">
                            <h2>Your Input</h2>
                            {Object.keys(formData).map((key) => (
                                <p key={key}><strong>{key}:</strong> {formData[key]}</p>
                            ))}
                        </div>
                        <div className="solution">
                            <h2>Solution</h2>
                            <img src={solution.image} alt={solution.name} />
                            <p><strong>Product:</strong> {solution.name}</p>
                            <p><strong>Brand:</strong> {solution.brand}</p>
                            <p><strong>Description:</strong> {solution.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Solutions;
