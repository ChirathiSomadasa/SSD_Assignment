import React, { useState } from 'react';
import './SearchFertilizer.css';
import { useNavigate } from 'react-router-dom';

const fertilizers = [
    {
        name: "UNIPOWER YaraMila Complex",
        brand: "EcoGreen",
        amount: "25kg",
        description: "Organic compost is perfect for enriching soil and improving plant health.",
        type: 'fertilizer',
        detailsPage: '/details1', 
        
    },
    {
        name: "PADDY GROW - Paddy Microbial Consortia",
        brand: "Amruth Organic Fertilizers",
        amount: "5L",
        description: "AMRUTH PMC is an exclusive formulated liquid bio-fertilizer consisting of nutrients, proteins, plant growth and development.",
        type: 'fertilizer',
        detailsPage: '/details2', 
    },
    {
        name: "Ricestar Fenoxaprop-p-ethyl 6.9 EC",
        brand: "Bayer",
        amount: "1L",
        description: "Ricestar is a post-emergent herbicide containing fenoxaprop-p-ethyl, designed to control a broad spectrum of grass weeds in paddy crops.",
        type: 'pesticide',
        category: 'herbicide',
        detailsPage: '/details3', 
    },
    {
        name: "Dhanuka Cover Chlorantraniliprole 18.5% SC",
        brand: "Dhanuka",
        amount: "60ml / 150ml",
        description: "Cover Insecticide Liquid provides effective and long duration protection with its unique mode of action in crops like Paddy ",
        type: 'pesticide',
        category: 'insecticide',
        detailsPage: '/details4', 
    },
    {
        name: "GOLDPOWER Captan 70% + Hexaconazole 5% WP",
        brand: "Star Chemicals",
        amount: "250g / 500g / 1kg",
        description: "It is a unique combination of contact & systemic mode of action with protective and curative action.",
        type: 'pesticide',
        category: 'fungicide',
        detailsPage: '/details5', 
    },
    {
        name: "Tata Rallis RALLIGOLD GR BIO FERTILIZER",
        brand: "Tata Rallis",
        amount: "4kg",
        description: "Tata Ralligold is a growth promoter product designed for agricultural use.",
        type: 'fertilizer',
    },
    
    {
        name: "Tata CONTAF PLUS Hexaconazole 5% SC",
        brand: "Tata Rallis",
        amount: "1L",
        description: "Its systemic action ensures long-lasting protection against a variety of fungal diseases.",
        type: 'pesticide',
        category: 'fungicide',
    },
   
    {
        name: "IFFCO Nano DAP",
        brand: "IFFCO",
        amount: "500ml",
        description: "IFFCO Nano DAP is an efficient source which helps in correcting the Nitrogen & Phosphorus deficiencies",
        type: 'fertilizer',
        
    },
    {
        name: "Katyayani Chloda | Chlorantraniliprole 9.3%",
        brand: "Katyayani Organics",
        amount: "100g / 1L",
        description: "Katyani’s Chloda presents a potent broad-spectrum insecticide formulation, offering dual efficacy against harmful pests",
        type: 'pesticide',
        category: 'insecticide',
    },
    {
        name: "Bispyribac Sodium 10% SC ",
        brand: "Katyayani Organics",
        amount: "100g /300g / 1L / 5L / 10L",
        description: " It effectively controls most of the weed species infesting rice crops, both in nurseries and main fields.",
        type: 'pesticide',
        category: 'herbicide',
    },
    {
        name: "PRETGOLD Pretilachlor 50% EC ",
        brand: "Star Chemicals",
        amount: "250g /500g / 1L / 2L / 5L",
        description: "It exhibits highly efficient control of a variety of weeds like annual grasses, sedges and broad leaved weeds.",
        type: 'pesticide',
        category: 'herbicide',
    },
    {
        name: "FMC Ferterra Chlorantraniliprole 0.4% ww GR",
        brand: "FMC",
        amount: "4KG",
        description: "Ferterra Insecticide is a novel insecticide of anthranilic diamide insecticide group in a granular form effective for borer control in Rice and Sugarcane crops.",
        type: 'pesticide',
        category: 'insectide',
    },
    
];

function SearchFertilizer() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFertilizers, setFilteredFertilizers] = useState(fertilizers);
    const [productType, setProductType] = useState(''); // Initially empty to show all products
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        const filtered = fertilizers.filter(fertilizer =>
            (fertilizer.name.toLowerCase().includes(term.toLowerCase()) ||
                fertilizer.brand.toLowerCase().includes(term.toLowerCase())) &&
            (productType === '' || fertilizer.type === productType) &&
            (selectedCategory === '' || fertilizer.category === selectedCategory)
        );

        setFilteredFertilizers(filtered);
    };

    const handleProductTypeChange = (type) => {
        
        if (productType === type) {
            setProductType('');
            setFilteredFertilizers(fertilizers);
        } else {
            setProductType(type);
            setSelectedCategory(''); // Reset selected category when changing type
            setSearchTerm(''); // Reset search term
            setFilteredFertilizers(fertilizers.filter(f => f.type === type)); // Filter based on type
        }
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);

        const filtered = fertilizers.filter(fertilizer =>
            (fertilizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fertilizer.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (productType === '' || fertilizer.type === productType) &&
            (category === '' || fertilizer.category === category)
        );

        setFilteredFertilizers(filtered);
    };

    const navigate = useNavigate();

    return (
        <div className="search-fertilizer-container">
            <button
                type="button"
                className="recommendform-button"
                onClick={() => navigate('/recommendform')}
            >
                Guide Me to Ideal Solutions
            </button>
            <button
                type="button"
                className="recommend-button"
                onClick={() => navigate('/recommend')}
            >
                Common Recommendations
            </button>

            <h1 className="topic01">Search Fertilizer</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter fertilizer or brand name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className="search-button">🔍 Search</button>
            </div>

            <div>
                <label>
                    <input
                        type="radio"
                        value="fertilizer"
                        checked={productType === 'fertilizer'}
                        onChange={() => handleProductTypeChange('fertilizer')}
                    />
                    Fertilizers
                </label>
                <label>
                    <input
                        type="radio"
                        value="pesticide"
                        checked={productType === 'pesticide'}
                        onChange={() => handleProductTypeChange('pesticide')}
                    />
                    Pesticides
                </label>
            </div>

            {productType === 'pesticide' && (
                <div className="pesticide-dropdown">
                    <h2 className='dropdown'>Select Pesticide Type:</h2>
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">All</option>
                        <option value="herbicide">Herbicides</option>
                        <option value="insecticide">Insecticides</option>
                        <option value="fungicide">Fungicides</option>
                    </select>
                </div>
            )}

            <h1 className="topic2">{productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'All Products'}</h1>
            <div className="fertilizer-results">
                {filteredFertilizers.map((fertilizer, index) => (
                    <div className="fertilizer-item" key={index}>
                        <h2>{fertilizer.name}</h2>
                        <p><strong>Brand:</strong> {fertilizer.brand}</p>
                        <p><strong>Amount:</strong> {fertilizer.amount}</p>
                        <p><strong>Description:</strong> {fertilizer.description}</p>
                        <button 
                            className="details-button" 
                            onClick={() => navigate(fertilizer.detailsPage)} // Navigate to specific page
                        >
                            Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchFertilizer;
