import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './addDetails.css';

const BRAND_PRICES = {
    StarChemicals: 100,
    TataRallis: 200,
    IFFCO: 300,
    KatyayaniOrganics: 400,
    FMC: 500,
    EcoGreen: 600,
    Bayer: 700
};

const UNIT_CONVERSIONS = {
    liters: 1,
    milliliters: 0.001,
    kilograms: 1,
    grams: 0.001
};

const fertilizerNames = ["UNIPOWER YaraMila Complex", "PADDY GROW - Paddy Microbial Consortia", "Tata Rallis RALLIGOLD GR BIO FERTILIZER", "IFFCO Nano DAP"];
const pesticideNames = ["Ricestar Fenoxaprop-p-ethyl 6.9 EC", "Dhanuka Cover Chlorantraniliprole 18.5% SC", "GOLDPOWER Captan 70% + Hexaconazole 5% WP", "Tata CONTAF PLUS Hexaconazole 5% SC", "Katyayani Chloda | Chlorantraniliprole 9.3%", "Bispyribac Sodium 10% SC", "PRETGOLD Pretilachlor 50% EC", "FMC Ferterra Chlorantraniliprole 0.4% ww GR"];

function EditDetails() {
    const [detail, setDetail] = useState({
        receiverName: "",
        address: "",
        phoneNumber: "",
        productType: "",
        productName: "",
        brand: "",
        amount: "",
        unit: "",
        price: ""
    });

    const [originalDetail, setOriginalDetail] = useState({ ...detail });
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/details/${id}`);
                const fetchedDetail = response.data.data;
                setDetail(fetchedDetail);
                setOriginalDetail(fetchedDetail);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching detail:", error);
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'receiverName':
            if (!value) {
            newErrors.receiverName = "Receiver's Name is required.";
                         } else if (!/^[a-zA-Z\s]*$/.test(value)) {
             newErrors.receiverName = "Receiver's Name must contain only letters and spaces.";
                 } else {
                 delete newErrors.receiverName;
    }
    break;

            case 'phoneNumber':
                if (!value) newErrors.phoneNumber = "Phone Number is required.";
                else if (!/^\d{10}$/.test(value)) newErrors.phoneNumber = "Phone Number must be exactly 10 digits.";
                else delete newErrors.phoneNumber;
                break;
            case 'address':
                if (!value) newErrors.address = "Address is required.";
                else delete newErrors.address;
                break;
            case 'productType':
                if (!value) newErrors.productType = "Product Type is required.";
                else delete newErrors.productType;
                break;
            case 'productName':
                if (!value) newErrors.productName = "Product Name is required.";
                else delete newErrors.productName;
                break;
            case 'brand':
                if (!value) newErrors.brand = "Brand is required.";
                else delete newErrors.brand;
                break;
            case 'amount':
                if (!value) newErrors.amount = "Amount is required.";
                else if (isNaN(value)) newErrors.amount = "Amount must be a number.";
                else delete newErrors.amount;
                break;
            case 'unit':
                if (!value) newErrors.unit = "Unit is required.";
                else delete newErrors.unit;
                break;
            case 'price':
                if (!value) newErrors.price = "Price is required.";
                else delete newErrors.price;
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { value, name } = e.target;
        setDetail(prevState => ({
            ...prevState,
            [name]: value
        }));
        validateField(name, value);

        // Calculate price if needed
        if (name === 'amount' || name === 'unit' || name === 'brand') {
            calculatePrice(detail.brand, detail.amount, detail.unit);
        }
    };

    const calculatePrice = (brand, amount, unit) => {
        const brandPrice = BRAND_PRICES[brand] || 0;
        const unitConversion = UNIT_CONVERSIONS[unit] || 1;

        const calculatedPrice = brandPrice * (amount || 0) * unitConversion; 
        setDetail(prevState => ({
            ...prevState,
            price: calculatedPrice.toFixed(2)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!detail.receiverName) newErrors.receiverName = "Receiver Name is required.";
        if (!detail.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
        if (!/^\d{10}$/.test(detail.phoneNumber)) newErrors.phoneNumber = "Phone Number must be exactly 10 digits.";
        if (!detail.address) newErrors.address = "Address is required.";
        if (!detail.productType) newErrors.productType = "Product Type is required.";
        if (!detail.productName) newErrors.productName = "Product Name is required.";
        if (!detail.brand) newErrors.brand = "Brand is required.";
        if (!detail.amount) newErrors.amount = "Amount is required.";
        if (isNaN(detail.amount)) newErrors.amount = "Amount must be a number.";
        if (!detail.unit) newErrors.unit = "Unit is required.";
        if (!detail.price) newErrors.price = "Price is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const hasChanges = JSON.stringify(detail) !== JSON.stringify(originalDetail);

            if (hasChanges) {
                try {
                    await axios.put(`http://localhost:5001/details/${id}`, detail);
                    alert("Details updated successfully");
                    navigate('/view');
                } catch (error) {
                    console.error('Error updating details:', error);
                    alert(`An error occurred while updating details: ${error.response?.data?.message || error.message}`);
                }
            } else {
                alert('No changes were made');
            }
        } else {
            alert('Please fix the errors in the form');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="refill-request-container">
            <h1 className="refill">Edit Details</h1>

            <form onSubmit={handleSubmit} className="details-form">
                <div className="refill-form">
                    <div className="form-column">
                        <h2>User Details</h2>
                        <div className="form-group">
                            <label>Receiver's Name:</label>
                            <input
                                type="text"
                                name="receiverName"
                                value={detail.receiverName}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Enter Receiver's Name"
                            />
                            {errors.receiverName && <span className="error-text">{errors.receiverName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={detail.phoneNumber}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Enter Phone Number"
                            />
                            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={detail.address}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Enter Address"
                            />
                            {errors.address && <span className="error-text">{errors.address}</span>}
                        </div>
                    </div>

                    <div className="form-column">
                        <h2>Product Details</h2>
                        <div className="form-group">
                            <label>Product Type:</label>
                            <select
                                name="productType"
                                value={detail.productType}
                                onChange={handleInputChange}
                                className="input-field"
                            >
                                <option value="">Select Product Type</option>
                                <option value="Fertilizer">Fertilizer</option>
                                <option value="Pesticide">Pesticide</option>
                            </select>
                            {errors.productType && <span className="error-text">{errors.productType}</span>}
                        </div>
                        <div className="form-group">
                            <label>Product Name:</label>
                            <select
                                name="productName"
                                value={detail.productName}
                                onChange={handleInputChange}
                                className="input-field"
                            >
                                <option value="">Select Product Name</option>
                                {(detail.productType === "Fertilizer" ? fertilizerNames : pesticideNames).map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            {errors.productName && <span className="error-text">{errors.productName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Brand:</label>
                            <select
                                name="brand"
                                value={detail.brand}
                                onChange={handleInputChange}
                                className="input-field"
                            >
                                <option value="">Select Brand</option>
                                <option value="StarChemicals">Star Chemicals</option>
                                <option value="TataRallis">Tata Rallis</option>
                                <option value="IFFCO">IFFCO</option>
                                <option value="KatyayaniOrganics">Katyayani Organics</option>
                                <option value="FMC">FMC</option>
                                <option value="EcoGreen">EcoGreen</option>
                                <option value="Bayer">Bayer</option>
                            </select>
                            {errors.brand && <span className="error-text">{errors.brand}</span>}
                        </div>
                        <div className="form-group">
                            <label>Amount:</label>
                            <input
                                type="text"
                                name="amount"
                                value={detail.amount}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Enter Amount"
                            />
                            {errors.amount && <span className="error-text">{errors.amount}</span>}
                        </div>
                        <div className="form-group">
                            <label>Unit:</label>
                            <select
                                name="unit"
                                value={detail.unit}
                                onChange={handleInputChange}
                                className="input-field"
                            >
                                <option value="">Select Unit</option>
                                <option value="liters">Liters</option>
                                <option value="milliliters">Milliliters</option>
                                <option value="kilograms">Kilograms</option>
                                <option value="grams">Grams</option>
                            </select>
                            {errors.unit && <span className="error-text">{errors.unit}</span>}
                        </div>
                        <div className="form-group">
                            <label>Price:</label>
                            <input
                                type="text"
                                name="price"
                                value={detail.price}
                                readOnly
                                className="input-field"
                                placeholder="Calculated Price"
                            />
                            {errors.price && <span className="error-text">{errors.price}</span>}
                        </div>
                    </div>
                </div>
                <button type="submit" className="refill_button">Update Details</button>
            </form>
        </div>
    );
}

export default EditDetails;
