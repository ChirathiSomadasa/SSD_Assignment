// src/components/predictions/PredictionResult.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PredictionResult.css';
import { useAuthToken, useIsAuthenticated } from '../../auth'; // Use JWT
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../../images/logo.png';

function PredictionResult() {
    const navigate = useNavigate();
    const token = useAuthToken(); // Get JWT
    const isAuthenticated = useIsAuthenticated();

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState(false); // Track search state

    // 🔒 Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Fetch predictions from backend using JWT
    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await axios.get('http://localhost:5001/prediction/api/predictions', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // ✅ Add status & recommendation (can be moved to backend later)
                const predictionsWithStatus = response.data.data.map(item => {
                    let status = '';
                    let recommendation = '';

                    const estimatedYield = parseInt(item.estimatedYield, 10);
                    const yieldVariability = parseInt(item.yieldVariability, 10);

                    if (estimatedYield > 3000 && yieldVariability < 10) {
                        status = 'Good';
                        recommendation = 'Continue with the current practices.';
                    } else if (estimatedYield >= 2000 && estimatedYield <= 3000 && yieldVariability >= 10) {
                        status = 'Moderate';
                        recommendation = 'Consider improving irrigation and monitoring weather conditions.';
                    } else {
                        status = 'Poor';
                        recommendation = 'Review agricultural practices, consider new irrigation methods, and prepare for weather variability.';
                    }

                    return { ...item, status, recommendation };
                });

                setPredictions(predictionsWithStatus);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching predictions:', err);
                if (err.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                    navigate('/login');
                } else {
                    setError('Failed to load predictions. Please try again later.');
                }
                setLoading(false);
            }
        };

        if (token) fetchPredictions();
    }, [token, navigate]);

    const handleEdit = (id) => {
        navigate(`/EditResult/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmation = window.confirm('Do you want to delete this prediction result?');
        if (!confirmation) return;

        try {
            await axios.delete(`http://localhost:5001/prediction/api/predictions/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPredictions(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete prediction. Please try again.');
        }
    };

    // Generate Summary Report (Good/Moderate/Poor counts)
    const handleGenerateReport = () => {
        const goodCount = predictions.filter(p => p.status === 'Good').length;
        const moderateCount = predictions.filter(p => p.status === 'Moderate').length;
        const poorCount = predictions.filter(p => p.status === 'Poor').length;

        const doc = new jsPDF();

        // Header background
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 50, 'F');

        const img = new Image();
        img.src = Logo;

        img.onload = () => {
            doc.addImage(img, 'PNG', 80, 10, 50, 25);

            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(18);
            doc.setTextColor(255, 255, 255);
            const title = 'Prediction Status Report';
            const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
            doc.text(title, titleX, 45);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const subtitle = 'Summary of the number of status relating to poor, moderate, and good';
            const subtitleX = (pageWidth - doc.getTextWidth(subtitle)) / 2;
            doc.text(subtitle, subtitleX, 60);

            doc.autoTable({
                head: [['Status', 'Count']],
                body: [
                    ['Good', goodCount],
                    ['Moderate', moderateCount],
                    ['Poor', poorCount],
                ],
                startY: 70,
                headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
                styles: { textColor: [0, 0, 0] }
            });

            doc.save('Prediction_Status_Report.pdf');
        };

        img.onerror = () => alert('Failed to load logo.');
    };

    // Generate Detailed Report for current filtered/search results
    const handleCurrentGenerateReport = () => {
        const dataToGenerate = search ? filteredPredictions : predictions;

        const doc = new jsPDF();
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 50, 'F');

        const img = new Image();
        img.src = Logo;

        img.onload = () => {
            doc.addImage(img, 'PNG', 80, 10, 50, 25);

            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(18);
            doc.setTextColor(255, 255, 255);
            const title = 'Yield Prediction Summary Report';
            const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
            doc.text(title, titleX, 45);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const subtitle = 'Overview of yield predictions based on current data.';
            const subtitleX = (pageWidth - doc.getTextWidth(subtitle)) / 2;
            doc.text(subtitle, subtitleX, 60);

            const tableBody = dataToGenerate.map(p => [
                p.variety,
                p.estimatedYield,
                p.yieldVariability,
                p.geographicLocation,
                p.status,
                p.recommendation
            ]);

            doc.autoTable({
                head: [['Crop Variety', 'Est. Yield', 'Yield Variability', 'Location', 'Status', 'Recommendation']],
                body: tableBody,
                startY: 70,
                headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
                styles: { fontSize: 10, textColor: [0, 0, 0] }
            });

            doc.save('Yield_Prediction_Report.pdf');
        };

        img.onerror = () => alert('Failed to load logo.');
    };

    const handleSearch = () => setSearch(true);
    const handleClearSearch = () => {
        setSearchQuery('');
        setSearch(false);
    };

    // Filter predictions only when search is active
    const filteredPredictions = search
        ? predictions.filter(p => {
            const query = searchQuery.toLowerCase();
            return (
                p.variety.toLowerCase().includes(query) ||
                p.status.toLowerCase().includes(query) ||
                p.geographicLocation.toLowerCase().includes(query) ||
                p.estimatedYield.toString().includes(query) ||
                p.yieldVariability.toString().includes(query)
            );
        })
        : predictions;

    if (loading) {
        return <div className="loading">Loading predictions...</div>;
    }

    if (error) {
        return <div className="pre_log">{error}</div>;
    }

    return (
        <div className="result">
            <h1>Prediction Results</h1>

            <div className="filter_bar">
                <input
                    className="search_bar"
                    placeholder="Search by variety, location, status, yield..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search_btn" onClick={handleSearch}>Search</button>
                <button className="clear_btn" onClick={handleClearSearch}>Clear</button>
                <button className="report_yields" onClick={handleGenerateReport}>Status Report</button>
                <button className="report_yieldc" onClick={handleCurrentGenerateReport}>Current Report</button>
            </div>

            <div className="result_data">
                {filteredPredictions.length === 0 ? (
                    <p>No prediction results match your search.</p>
                ) : (
                    filteredPredictions.map(prediction => (
                        <div key={prediction._id} className="prediction_card">
                            <table>
                                <tbody>
                                    <tr><th>Variety</th><td>{prediction.variety}</td></tr>
                                    <tr><th>Estimated Yield (kg/ha)</th><td>{prediction.estimatedYield}</td></tr>
                                    <tr><th>Yield Variability (kg/ha)</th><td>{prediction.yieldVariability}</td></tr>
                                    <tr><th>Geographic Location</th><td>{prediction.geographicLocation}</td></tr>
                                    <tr><th>Irrigation Practices</th><td>{prediction.irrigationPractices}</td></tr>
                                    <tr><th>Weather Conditions</th><td>{prediction.weatherConditions}</td></tr>
                                    <tr><th>Status</th><td>{prediction.status}</td></tr>
                                    <tr><th>Recommendation</th><td>{prediction.recommendation}</td></tr>
                                </tbody>
                            </table>
                            <div className="result_div">Do you want to Edit Yield Prediction Results?
                                <button className="edit_btn" onClick={() => handleEdit(prediction._id)}>Edit</button>
                            </div>
                            <div className="result_div">Do you want to Delete Yield Prediction Results?  
                                <button className="delete_btn" onClick={() => handleDelete(prediction._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PredictionResult;