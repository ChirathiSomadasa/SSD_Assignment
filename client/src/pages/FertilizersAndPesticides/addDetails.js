import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './addDetails.css';

function AddDetails() {
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

    const [errors, setErrors] = useState({});

    // Constants for brand pricing
    const brandPrices = {
        StarChemicals: 100,
        TataRallis: 200,
        IFFCO: 300,
        KatyayaniOrganics: 400,
        FMC: 500,
        EcoGreen: 600,
        Bayer: 700
    };

    // Constants for unit conversions
    const unitConversions = {
        kilogram: 1,
        gram: 0.1,
        liter: 1,
        milliliter: 0.1
    };

    // Product names based on type
    const fertilizerNames = ["UNIPOWER YaraMila Complex", "PADDY GROW - Paddy Microbial Consortia", "Tata Rallis RALLIGOLD GR BIO FERTILIZER", "IFFCO Nano DAP"];
    const pesticideNames = ["Ricestar Fenoxaprop-p-ethyl 6.9 EC", "Dhanuka Cover Chlorantraniliprole 18.5% SC", "GOLDPOWER Captan 70% + Hexaconazole 5% WP", "Tata CONTAF PLUS Hexaconazole 5% SC", "Katyayani Chloda | Chlorantraniliprole 9.3%", "Bispyribac Sodium 10% SC", "PRETGOLD Pretilachlor 50% EC", "FMC Ferterra Chlorantraniliprole 0.4% ww GR"];

    const handleOnChange = (e) => {
        const { value, name } = e.target;
        setDetail(prevState => ({
            ...prevState,
            [name]: value
        }));
        validateField(name, value); // Validate field on change
    };

    const handleBrandChange = (e) => {
        const { value } = e.target;
        setDetail(prevState => {
            const newDetail = { ...prevState, brand: value };
            newDetail.price = calculatePrice(newDetail);
            return newDetail;
        });
    };

    const handleUnitChange = (e) => {
        const { value } = e.target;
        setDetail(prevState => {
            const newDetail = { ...prevState, unit: value };
            newDetail.price = calculatePrice(newDetail);
            return newDetail;
        });
    };

    const calculatePrice = (detail) => {
        const { brand, amount, unit } = detail;
        if (brand && amount && unit) {
            const brandPrice = brandPrices[brand] || 0;
            const unitConversion = unitConversions[unit] || 1;
            const amountValue = parseFloat(amount);
            if (!isNaN(amountValue)) {
                return brandPrice * amountValue * unitConversion;
            }
        }
        return "";
    };

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

            case 'amount':
                if (!value) newErrors.amount = "Amount is required.";
                else if (!/^\d+(\.\d+)?$/.test(value)) newErrors.amount = "Amount must be a number.";
                else delete newErrors.amount;
                break;

            case 'brand':
                if (!value) newErrors.brand = "Brand is required.";
                else delete newErrors.brand;
                break;

            case 'unit':
                if (!value) newErrors.unit = "Unit is required.";
                else delete newErrors.unit;
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!detail.receiverName) newErrors.receiverName = "Receiver's Name is required.";
        if (!detail.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
        if (!/^\d{10}$/.test(detail.phoneNumber)) newErrors.phoneNumber = "Phone Number must be exactly 10 digits.";

        if (!detail.address) newErrors.address = "Address is required.";

        if (!detail.productType) newErrors.productType = "Product Type is required.";

        if (!detail.productName) newErrors.productName = "Product Name is required.";

        if (!detail.brand) newErrors.brand = "Brand is required.";

        if (!detail.amount) newErrors.amount = "Amount is required.";
        if (!/^\d+(\.\d+)?$/.test(detail.amount)) newErrors.amount = "Amount must be a number.";

        if (!detail.unit) newErrors.unit = "Unit is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post("http://localhost:5001/addDetails", detail);
                console.log(response);
                alert("Details added successfully!");
                setDetail({
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
                setErrors({});
                
            } catch (error) {
                console.error('Error adding details:', error);
                alert('Error adding details. Please try again later.');
            }
        } else {
            alert("Please correct the errors in the form before submitting.");
        }
    };

    return (
        <div className="refill-request-container">
            <button
                type="button"
                className="View_button"
                onClick={() => navigate('/view')}
            >
                View All Details
            </button>
            <h1 className="refill">Refill Request</h1>

            <form onSubmit={handleSubmit} className="details-form">
                <div className="refill-form">
                    <div className="form-column">
                        <h2 className="topic1">User Details</h2>
                        <div className="form-group">
                            <label>Receiver's Name:</label>
                            <input
                                type="text"
                                name="receiverName"
                                value={detail.receiverName}
                                onChange={handleOnChange}
                                className="input-field"
                                placeholder="Receiver's Name Here"
                                required
                            />
                            {errors.receiverName && <span className="error-text">{errors.receiverName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={detail.phoneNumber}
                                onChange={handleOnChange}
                                className="input-field"
                                placeholder="Enter Your Number"
                                required
                            />
                            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={detail.address}
                                onChange={handleOnChange}
                                className="input-field"
                                placeholder="Your Address Here"
                                required
                            />
                            {errors.address && <span className="error-text">{errors.address}</span>}
                        </div>
                    </div>
                    
                    <div className="form-column">
                        <h2 className="topic1">Product Details</h2>
                        <div className="form-group">
                            <label>Product Type:</label>
                            <select
                                name="productType"
                                value={detail.productType}
                                onChange={handleOnChange}
                                className="input-field"
                                required
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
                                onChange={handleOnChange}
                                className="input-field"
                                required
                            >
                                <option value="">Select Product Name</option>
                                {(detail.productType === 'Fertilizer' ? fertilizerNames : pesticideNames).map((name, index) => (
                                    <option key={index} value={name}>{name}</option>
                                ))}
                            </select>
                            {errors.productName && <span className="error-text">{errors.productName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Brand:</label>
                            <select
                                name="brand"
                                value={detail.brand}
                                onChange={handleBrandChange}
                                className="input-field"
                                required
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
                                onChange={handleOnChange}
                                className="input-field"
                                placeholder="Enter Amount Needed"
                                required
                            />
                            {errors.amount && <span className="error-text">{errors.amount}</span>}
                        </div>
                        <div className="form-group">
                            <label>Unit:</label>
                            <select
                                name="unit"
                                value={detail.unit}
                                onChange={handleUnitChange}
                                className="input-field"
                                required
                            >
                                <option value="">Select Unit</option>
                                <option value="kilogram">Kilogram</option>
                                <option value="gram">Gram</option>
                                <option value="liter">Liter</option>
                                <option value="milliliter">Milliliter</option>
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
                            />
                        </div>
                    </div>
                </div>
                
                <button type="submit" className="refill_button">Submit Details</button>
            </form>
        </div>
    );
}

export default AddDetails;
