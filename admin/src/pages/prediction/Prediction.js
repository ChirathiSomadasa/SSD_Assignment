import React, { useEffect, useState } from 'react';
import './Prediction.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import Logo from '../../images/logo.png';  
import 'jspdf-autotable';


function Predictions() {
    const [predictions, setPredictions] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filteredPredictionData, setFilteredPredictionData] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5001/prediction/api/admin/predictions")
            .then((response) => {
                const { data, status } = response.data;
                if (status === "success") {

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

                    setPredictions(data);
                    setFilteredPredictionData(data); 
                } else {
                    alert("Error - " + response.data.message);
                }
            })
            .catch((error) => {
                alert("Error fetching predictions: " + error.message);
            });
    }, [navigate]);

    // Function to filter predictions based on the search query
    const handleSearch = () => {
        const filteredPredictions = predictions.filter(prediction => {
            const query = searchQuery.toLowerCase();

            // Convert numerical values to strings for comparison
            const estimatedYieldStr = prediction.estimatedYield.toString();
            const yieldVariabilityStr = prediction.yieldVariability.toString();

            return (
                prediction.variety.toLowerCase().includes(query) ||
                prediction.status.toLowerCase().includes(query) ||
                prediction.geographicLocation.toLowerCase().includes(query) ||
                estimatedYieldStr.includes(query) || 
                yieldVariabilityStr.includes(query)  
            );
        });

        setFilteredPredictionData(filteredPredictions); 
    };

    // Function to clear the search query and reset the prediction list
    const handleClearSearch = () => {
        setSearchQuery('');
        setFilteredPredictionData(predictions); // Reset to original predictions list
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
    
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 50, 'F'); 
    
        const img = new Image();
        img.src = Logo;
        img.onload = () => {
            const logoWidth = 50;
            const logoHeight = 25;
            doc.addImage(img, 'PNG', 80, 10, logoWidth, logoHeight);
    
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(18);
            const title = 'Prediction Status Report';
            const textWidth = doc.getTextWidth(title);
            const textX = (pageWidth - textWidth) / 2;
            doc.setTextColor(255, 255, 255);
            doc.text(title, textX, 45);
    
            doc.setFontSize(12);
            const subtitle = 'Summary of the number of status relating to poor, moderate, and good';
            const subtitleWidth = doc.getTextWidth(subtitle);
            const subtitleX = (pageWidth - subtitleWidth) / 2;
            doc.setTextColor(0, 0, 0);
            doc.text(subtitle, subtitleX, 60);
    
            doc.autoTable({
                head: [['Status', 'Count']],
                body: [
                    ['Good', goodCount],
                    ['Moderate', moderateCount],
                    ['Poor', poorCount],
                ],
                startY: 70,
                styles: {
                    textColor: [0, 0, 0],
                },
                headStyles: {
                    fillColor: [0, 0, 0],
                    textColor: [255, 255, 255],
                },
            });
    
            doc.save('Prediction_Status_Report.pdf');
        };
    
        img.onerror = () => {
            console.error('Failed to load the logo image.');
        };
    };

    const handleCurrentGenerateReport = () => {
        const dataToGenerate = filteredPredictionData.length > 0 ? filteredPredictionData : predictions;
        
        const doc = new jsPDF();
    
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 50, 'F'); 
    
        const img = new Image();
        img.src = Logo;
    
        img.onload = () => {
            const logoWidth = 50;
            const logoHeight = 25;
            doc.addImage(img, 'PNG', 80, 10, logoWidth, logoHeight);
    
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(18);
            const title = 'Yield Prediction Summary Report';
            const textWidth = doc.getTextWidth(title);
            const textX = (pageWidth - textWidth) / 2;
            doc.setTextColor(255, 255, 255); 
            doc.text(title, textX, 45);
    
            doc.setFontSize(12);
            const subtitle = 'Overview of yield predictions based on current data.';
            const subtitleWidth = doc.getTextWidth(subtitle);
            const subtitleX = (pageWidth - subtitleWidth) / 2;
            doc.setTextColor(0, 0, 0); 
            doc.text(subtitle, subtitleX, 60);
    
            const tableBody = dataToGenerate.map(prediction => [
                prediction.variety,
                prediction.estimatedYield,
                prediction.yieldVariability,
                prediction.geographicLocation,
                prediction.status,
                prediction.recommendation
            ]);
    
            doc.autoTable({
                head: [['Crop Variety', 'Estimated Yield (kg/ha)', 'Yield Variability (kg/ha)', 'Geographic Location', 'Status', 'Recommendation']],
                body: tableBody,
                startY: 70,
                styles: {
                    textColor: [0, 0, 0],
                },
                headStyles: {
                    fillColor: [0, 0, 0],
                    textColor: [255, 255, 255],
                },
            });
    
            doc.save('Yield_Prediction_Report.pdf');
        };
    
        img.onerror = () => {
            console.error('Failed to load the logo image.');
        };
    };

    return (
        <div className="prediction-list-container">
            <h1>Manage Yield Predictions</h1>
            <div className='prediction-filter-bar'>
                <input
                    className='prediction-filter-search'
                    placeholder="Search prediction"
                    type="text"
                    value={searchQuery} 
                    onChange={(event) => setSearchQuery(event.target.value)} 
                />
                <button className='prediction-filter-search-btn' onClick={handleSearch}>Search</button>  {/* Search button */}
                <button className='prediction-filter-search-btn' onClick={handleClearSearch}>Clear Search</button> {/* Clear Search button */}
                <button className='generate_report_appbtn' onClick={handleGenerateReport}>Generate Status Report</button>
                <button className='generate_creport_btn' onClick={handleCurrentGenerateReport}>Generate Current Report</button>
            </div>

            <table className="prediction-table">
                <thead>
                    <tr>
                        <th>Variety</th>
                        <th>Estimated Yield</th>
                        <th>Yield Variability</th>
                        <th>Geographic Location</th>
                        <th>Irrigation Practices</th>
                        <th>Weather Conditions</th>
                        <th>Status</th>
                        <th>Recommendation</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPredictionData.map((prediction, index) => (
                        <tr key={index}>
                            <td>{prediction.variety}</td>
                            <td>{prediction.estimatedYield}</td>
                            <td>{prediction.yieldVariability}</td>
                            <td>{prediction.geographicLocation}</td>
                            <td>{prediction.irrigationPractices}</td>
                            <td>{prediction.weatherConditions}</td>
                            <td>{prediction.status}</td>
                            <td>{prediction.recommendation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Predictions;
