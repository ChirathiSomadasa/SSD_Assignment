import React, { useState, useEffect } from 'react';
import './Predictions.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import YiledImage from '../../images/yield/yield2.jpg';

function EditResult() {
    const validRiceVarieties = [
        'basmathi',
        'kurulu thuda',
        'heenati',
        'haramas',
        'rathhal',
        'maavee',
        'pachchaperumal',
        'red rice',
        'black rice',
        'sticky Rice',
        'samba',
        'keeri samba',
        'nadu',
        'kakulu'

    ];

    const [yieldData, setYieldData] = useState({
        variety: '',
        estimatedYield: '',
        yieldVariability: '',
        geographicLocation: '',
        historicalData: '',
        irrigationPractices: '',
        weatherConditions: '',
    });

    const { id } = useParams();
    const [errors, setErrors] = useState({});
    const [resultData, setResultData] = useState(null); // State for status and recommendation
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all predictions from the backend
        const fetchPredictions = async () => {
            try {
                const response = await axios.get('http://localhost:5001/prediction/api/predictions/' + id);

                for (var i = 0; i < response.data.data.length; i++) {
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

                setYieldData(response.data.data);

            } catch (err) {
                //setError('Failed to load predictions');
                //setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    const handleYieldChange = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';

        if (name === 'variety') {
            if (!validRiceVarieties.includes(value)) {
                errorMsg = 'Please enter a valid rice variety';
            }
        } else if (name === 'geographicLocation') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                errorMsg = 'Please enter only letters';
            }
        } else if (name === 'estimatedYield' || name === 'yieldVariability') {
            if (!/^\d*$/.test(value)) {
                errorMsg = 'Please enter a valid integer number';
            }
        }

        setYieldData({ ...yieldData, [name]: value });
        setErrors({ ...errors, [name]: errorMsg });
    };

    const handleYieldSubmit = async (e) => {
        e.preventDefault();

        const formErrors = {};
        if (!validRiceVarieties.includes(yieldData.variety)) {
            formErrors.variety = 'Please enter a valid rice variety';
        }
        if (!yieldData.geographicLocation.match(/^[a-zA-Z\s]*$/)) {
            formErrors.geographicLocation = 'Please enter only letters';
        }
        if (!yieldData.estimatedYield.match(/^\d*$/)) {
            formErrors.estimatedYield = 'Please enter a valid integer number';
        }
        if (!yieldData.yieldVariability.match(/^\d*$/)) {
            formErrors.yieldVariability = 'Please enter a valid integer number';
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Determine status and recommendation based on input data
        let calculatedStatus = '';
        let calculatedRecommendation = '';

        if (yieldData.estimatedYield > 3000 && yieldData.yieldVariability < 10) {
            calculatedStatus = 'Good';
            calculatedRecommendation = 'Continue with the current practices.';
        } else if (yieldData.estimatedYield >= 2000 && yieldData.estimatedYield <= 3000 && yieldData.yieldVariability >= 10) {
            calculatedStatus = 'Moderate';
            calculatedRecommendation = 'Consider improving irrigation and monitoring weather conditions.';
        } else {
            calculatedStatus = 'Poor';
            calculatedRecommendation = 'Review agricultural practices, consider new irrigation methods, and prepare for weather variability.';
        }

        // Combine all data to pass to the results page
        const resultData = {
            ...yieldData,
            status: calculatedStatus,
            recommendation: calculatedRecommendation
        };

        try {
            await axios.post('http://localhost:5001/prediction/api/predictions/' + id, yieldData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setResultData(resultData);
            console.log('Result Data:', resultData);

        } catch (error) {
            console.error('Error during form submission:', error);
            alert('Failed to submit prediction');
        }
    };

    const handleOkClick = () => {
        if (resultData) {
            console.log('Navigating with result data:', resultData);
            navigate('/predictionResult', { state: resultData });
        }
    };

    return (
        <div>
            <div className='predic_parallax'>
                <div className='hero_text'>
                    <h1>Smart Farming, Better Yields</h1>
                </div>
            </div>

            <div className='yield1_topic'> <h1>Yield Prediction</h1></div>

            <div className='yiled'>

                <div className='yiled_des'>
                    <p>Step into the future of agriculture with our cutting-edge
                        Yield Prediction Management system, designed to revolutionize how you plan
                        and manage your farming operations. With a simple input of your field data,
                        you can compare current conditions with historical trends to receive detailed
                        and personalized crop recommendations tailored to maximize your yields. Whether
                        you're managing small farms or large-scale fields, our system adapts to your specific needs.<br></br><br></br>

                        Our system analyzes key factors such as irrigation practices,
                        climate conditions,Geographic Location, estimated Yield and yield variability to guide you on the best times for
                        Generate insightful reports to track farm success rates and make
                        informed decisions that lead to higher yields and sustainable farming. <br></br><br></br>

                        Furthermore, you can generate comprehensive reports that track the success of your fields,
                        helping you monitor growth patterns, identify areas of improvement, and plan for future planting cycles.
                        By utilizing these insightful reports, you can pinpoint how many farms have successfully grown
                        crops under similar conditions, equipping you with the knowledge to improve performance across the board.
                        Make informed decisions today that will lead to long-term success, sustainability, and higher yields.

                    </p>

                </div>

                <div className='yield_photo'><img src={YiledImage} alt="yiled" /></div>
            </div>

            <div className='yiled_datap'>
                <div className='cpp'>
                    <div className='yiled_form_containerp'>
                        <form onSubmit={handleYieldSubmit} className='formp'>
                            <h2 className='yield_topicp'>Yield Prediction</h2>

                            <label className='yiled_labelp'>Variety </label><br />
                            <input
                                className='input_yiledp'
                                type='text'
                                name='variety'
                                value={yieldData.variety}
                                onChange={handleYieldChange}
                                placeholder='Enter Variety'
                                required
                            />
                            {errors.variety && <div className='error_messagep'>{errors.variety}</div>}
                            <br />

                            <label className='yiled_labelp'>Estimated Yield (kg/ha) </label><br />
                            <input
                                className='input_yiledp'
                                type='text'
                                name='estimatedYield'
                                value={yieldData.estimatedYield}
                                onChange={handleYieldChange}
                                placeholder='Enter Estimated Yield'
                                required
                            />
                            {errors.estimatedYield && <div className='error_messagep'>{errors.estimatedYield}</div>}
                            <br />

                            <label className='yiled_labelp'>Yield Variability (kg/ha)  </label><br />
                            <input
                                className='input_yiledp'
                                type='text'
                                name='yieldVariability'
                                value={yieldData.yieldVariability}
                                onChange={handleYieldChange}
                                placeholder='Enter Yield Variability'
                                required
                            />
                            {errors.yieldVariability && <div className='error_messagep'>{errors.yieldVariability}</div>}
                            <br />

                            <label className='yiled_labelp'>Geographic Location </label><br />
                            <input
                                className='input_yiledp'
                                type='text'
                                name='geographicLocation'
                                value={yieldData.geographicLocation}
                                onChange={handleYieldChange}
                                placeholder='Enter Geographic Location'
                                required
                            />
                            {errors.geographicLocation && <div className='error_messagep'>{errors.geographicLocation}</div>}
                            <br />

                            <label className='yiled_labelp'>Irrigation Practices</label><br />
                            <select
                                className='select_yiledp'
                                name='irrigationPractices'
                                value={yieldData.irrigationPractices}
                                onChange={handleYieldChange}
                                required
                            >
                                <option value=''>Select an Option</option>
                                <option value='Drip irrigation'>Drip Irrigation</option>
                                <option value='Flood irrigation'>Flood Irrigation</option>
                                <option value='Sprinkler irrigation'>Sprinkler Irrigation</option>
                                <option value='Surface irrigation'>Surface Irrigation</option>
                                <option value='Localized irrigation'>Localized Irrigation</option>
                                <option value='Centre Pivot irrigation'>Centre Pivot Irrigation</option>
                                <option value='Sub irrigation'>Sub Irrigation</option>
                                <option value='Manual irrigation'>Manual Irrigation</option>
                            </select>
                            <br />

                            <label className='yiled_labelp'>Weather Conditions</label><br />
                            <select
                                className='select_yiledp'
                                name='weatherConditions'
                                value={yieldData.weatherConditions}
                                onChange={handleYieldChange}
                                required
                            >
                                <option value=''>Select an Option</option>
                                <option value='High rainfall expected'>High Rainfall Expected</option>
                                <option value='Dry season'>Dry Season</option>
                                <option value='Mild temperatures'>Mild Temperatures</option>
                                <option value='Strong winds forecasted'>Strong Winds Forecasted</option>
                            </select>
                            <br />

                            <button className='yiled_buttonp' type='submit'>SUBMIT</button>

                        </form>

                        {resultData && (
                            <div className='result_displayp'>
                                <h3>Status: {resultData.status}</h3>
                                <p>Recommendation: {resultData.recommendation}</p>
                                <div className='result_btnp'><button className='ok_buttonp' onClick={handleOkClick}>OK</button></div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );

}

export default EditResult;
