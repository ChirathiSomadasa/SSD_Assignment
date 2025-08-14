import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PredictionResult.css';
import { useAuthEmail, useAuthPassword } from '../../auth'
import jsPDF from 'jspdf';
import Logo from '../../images/logo.png';  
import 'jspdf-autotable';


function PredictionResult() {

    const authEmail = useAuthEmail();
    const authPassword = useAuthPassword();

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 
    const [search, setSearch] = useState(false); // Track if search button is clicked
    const navigate = useNavigate();
    

    useEffect(() => {
        // Fetch all predictions from the backend
        const fetchPredictions = async () => {
            try {
                const response = await axios.post('http://localhost:5001/prediction/api/getpredictions/',{auth_email:authEmail,auth_password:authPassword});

                for(var i = 0; i < response.data.data.length; i++){
                    var item = response.data.data[i];
                    
                    let calculatedStatus = '';
                    let calculatedRecommendation = '';

                    if (item.estimatedYield > 3000 && item.yieldVariability < 10) {
                        calculatedStatus = 'Good';
                        calculatedRecommendation = 'Continue with the current practices.';
                    } else if (item.estimatedYield >= 2000 && item.estimatedYield <= 3000 && item.yieldVariability >= 10) {
                        calculatedStatus = 'Moderate';
                        calculatedRecommendation = 'Consider improving irrigation and monitoring weather conditions.';
                    } else {
                        calculatedStatus = 'Poor';
                        calculatedRecommendation = 'Review agricultural practices, consider new irrigation methods, and prepare for weather variability.';
                    }

                    item.status = calculatedStatus;
                    item.recommendation = calculatedRecommendation;

                }

                console.log(response.data.data);
                
                setPredictions(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load predictions.You must login to the system.');
                setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    const handleEdit = (id) => {
       
        navigate(`/EditResult/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmation = window.confirm('Do you want to delete this prediction result?');
        if (confirmation) {
            try {
                await axios.delete(`http://localhost:5001/prediction/api/predictions/${id}`);
                setPredictions(predictions.filter(prediction => prediction._id !== id));
            } catch (err) {
                setError('Failed to delete prediction');
            }
        }
    };
    

    const handleGenerateReport = () => {
        let goodCount = 0;
        let moderateCount = 0;
        let poorCount = 0;
    
        predictions.forEach(prediction => {
            if (prediction.status === 'Good') goodCount++;
            if (prediction.status === 'Moderate') moderateCount++;
            if (prediction.status === 'Poor') poorCount++;
        });
    
        const doc = new jsPDF();
    
        // Set background color only for the logo section
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 50, 'F');  // Black background for logo section
    
        // Load and add logo asynchronously
        const img = new Image();
        img.src = Logo;
        img.onload = () => {
            const logoWidth = 50;
            const logoHeight = 25;
            doc.addImage(img, 'PNG', 80, 10, logoWidth, logoHeight);
    
            // Add Title and Subtitle
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(18);
            const title = 'Prediction Status Report';
            const textWidth = doc.getTextWidth(title);
            const textX = (pageWidth - textWidth) / 2;
            doc.setTextColor(255, 255, 255); // White text color for title
            doc.text(title, textX, 45);
    
            doc.setFontSize(12);
            const subtitle = 'Summary of the number of status relating to poor, moderate, and good';
            const subtitleWidth = doc.getTextWidth(subtitle);
            const subtitleX = (pageWidth - subtitleWidth) / 2;
            doc.setTextColor(0, 0, 0); // Black text color for subtitle
            doc.text(subtitle, subtitleX, 60);
    
            // Add table with black header background and white text color for header
            doc.autoTable({
                head: [['Status', 'Count']],
                body: [
                    ['Good', goodCount],
                    ['Moderate', moderateCount],
                    ['Poor', poorCount],
                ],
                startY: 70,
                styles: {
                    textColor: [0, 0, 0], // Default black text for table body
                },
                headStyles: {
                    fillColor: [0, 0, 0],  // Black background for header
                    textColor: [255, 255, 255],  // White text for header
                },
            });
    
            // Save the PDF after logo and table are rendered
            doc.save('Prediction_Status_Report.pdf');
        };
    
        img.onerror = () => {
            console.error('Failed to load the logo image.');
        };
    };
    

    const handleCurrentGenerateReport = () => {
        // Use filteredPredictions to generate report based on search or full data
        const dataToGenerate = filteredPredictions.length > 0 ? filteredPredictions : predictions;
        
        const doc = new jsPDF();
    
        // Set the black background for the header section
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 50, 'F'); 
    
        // Load and add the logo
        const img = new Image();
        img.src = Logo;
    
        img.onload = () => {
            const logoWidth = 50;
            const logoHeight = 25;
            doc.addImage(img, 'PNG', 80, 10, logoWidth, logoHeight);
    
            // Title and Subtitle
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(18);
            const title = 'Yield Prediction Summary Report';
            const textWidth = doc.getTextWidth(title);
            const textX = (pageWidth - textWidth) / 2;
            doc.setTextColor(255, 255, 255); // White text color for title
            doc.text(title, textX, 45);
    
            doc.setFontSize(12);
            const subtitle = 'Overview of yield predictions based on current data.';
            const subtitleWidth = doc.getTextWidth(subtitle);
            const subtitleX = (pageWidth - subtitleWidth) / 2;
            doc.setTextColor(0, 0, 0); // Black text color for subtitle
            doc.text(subtitle, subtitleX, 60);
    
            // Add a table for yield prediction details
            const tableBody = dataToGenerate.map(prediction => [
                prediction.variety,
                prediction.estimatedYield,
                prediction.yieldVariability,
                prediction.geographicLocation,
                prediction.status,
                prediction.recommendation
            ]);
    
            // Table with headers
            doc.autoTable({
                head: [['Crop Variety', 'Estimated Yield (kg/ha)', 'Yield Variability (kg/ha)', 'Geographic Location', 'Status', 'Recommendation']],
                body: tableBody,
                startY: 70,
                styles: {
                    textColor: [0, 0, 0], // Default black text for table body
                },
                headStyles: {
                    fillColor: [0, 0, 0],  // Black background for header
                    textColor: [255, 255, 255],  // White text for header
                },
            });
    
            // Save the PDF after generating
            doc.save('Yield_Prediction_Report.pdf');
        };
    
        img.onerror = () => {
            console.error('Failed to load the logo image.');
        };
    };

    const handleSearch = () => {
        // Set the search state to true when the search button is clicked
        setSearch(true);
    };

    const handleClearSearch = () => {
        setSearchQuery(''); // Clear search input and show all predictions
        setSearch(false); // Reset the search state
    };

    // Filter predictions based on search query, but only if search button was clicked
    const filteredPredictions = search
        ? predictions.filter(prediction => {
            const query = searchQuery.toLowerCase();
            const estimatedYieldStr = prediction.estimatedYield.toString();
            const yieldVariabilityStr = prediction.yieldVariability.toString();
            return (
                prediction.variety.toLowerCase().includes(query) ||
                prediction.status.toLowerCase().includes(query) ||
                prediction.geographicLocation.toLowerCase().includes(query) ||
                estimatedYieldStr.includes(query) || 
                yieldVariabilityStr.includes(query)
            );
        })
        : predictions;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className='pre_log'>{error}</div>;
    }

    return (
         <div className='result'>
            <h1>Prediction Results</h1>
            <div className='filter_bar'>
    <input 
        className='search_bar' 
        placeholder="Search" 
        type="text"  
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // This will filter predictions as user types
    />
   <button className='search_btn' onClick={handleSearch}>Search</button> {/* Search button */}
    <button className='clear_btn' onClick={handleClearSearch}>Clear Search</button>
    <button className='report_yields' onClick={handleGenerateReport}>Generate Status Report</button>
    <button className='report_yieldc' onClick={handleCurrentGenerateReport}>Generate Current Report</button>
</div>

            <div className='result_data'>
                {filteredPredictions.length === 0 ? (
                    <p>No prediction results available.</p>
                ) : (
                    filteredPredictions.map(prediction => (  // Use filteredPredictions here
                        <div key={prediction._id} className='prediction_card'>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Variety</th>
                                        <td>{prediction.variety}</td>
                                    </tr>
                                    <tr>
                                        <th>Estimated Yield (kg/ha)</th>
                                        <td>{prediction.estimatedYield}</td>
                                    </tr>
                                    <tr>
                                        <th>Yield Variability (kg/ha)</th>
                                        <td>{prediction.yieldVariability}</td>
                                    </tr>
                                    <tr>
                                        <th>Geographic Location</th>
                                        <td>{prediction.geographicLocation}</td>
                                    </tr>
                                    <tr>
                                        <th>Irrigation Practices</th>
                                        <td>{prediction.irrigationPractices}</td>
                                    </tr>
                                    <tr>
                                        <th>Weather Conditions</th>
                                        <td>{prediction.weatherConditions}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>{prediction.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Recommendation</th>
                                        <td>{prediction.recommendation}</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div className='result_div'>Do you want to Edit Yield Prediction Results?<button className='edit_btn' onClick={() => handleEdit(prediction._id)}>Edit</button></div>
                            <div className='result_div'>Do you want to Delete Yield Prediction Results?  <button className='delete_btn' onClick={() => handleDelete(prediction._id)}>Delete</button></div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default PredictionResult;
