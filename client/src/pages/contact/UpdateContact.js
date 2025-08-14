import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import './UpdateContact.css';

function UpdateContact() {
    const navigate = useNavigate();
    const {id} = useParams()

    const [contactData, setContactData] = useState([]);
    const [disease, setDisease] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5001/getContact/${id}`)
            .then(res => {
                const problem = res.data;
                setDisease(problem.disease);
                setDescription(problem.description);
                setCategory(problem.category);
                setLocation(problem.location);
            })
            .catch(err => console.log(err));
            
    }, [id]);
 
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/UpdateContact/${id}`, { disease, description, category, location });
            setSuccessMessage('Problem updated successfully!');
            navigate('/contact/ManageDisease'); // Redirect after success
            alert('Problem updated successfully!!!')
        } catch (err) {
            setError('Error updating problem. Please try again.');
            alert('Error updating problem. Please try again.');
        }
    };

    return (
        <div className='PUpdateProblemForm'>
            <div className='PUaddproblem_photo'>
                <br></br><br></br>
                    <form className="PUproductForm" onSubmit={handleUpdate}>
                        <h2 className="PUtopic">Update Disease</h2>
                        <div className="PUform-group">
                            <label>Disease:</label>
                            <input type="text" className="PUinarea" value={disease} onChange={(e) => setDisease(e.target.value)} required />
                        </div>
                        <div className="PUform-group">
                            <label>Description:</label>
                            <textarea className="PUinarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="PUform-group">
                            <label>Category:</label>
                            <select id="productCategory" className="PUinarea"  value={category} onChange={(e) => setCategory(e.target.value)} required>
                                 
                            <option>Sowing Season</option>
                                <option>Growing Season</option>
                                <option>Harvesting Season</option>
                                <option>Resting Season</option>
                            </select>
                        </div>
                        <div className="PUform-group">
                            <label>Location:</label>
                            <input type="text" className="PUinarea"  value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        <button type="submit" className="PUbtn">Update</button>
                    </form>
                    {error && <p>{error}</p>}
                    {successMessage && <p>{successMessage}</p>}
                </div>
            </div>

        
    );
}

export default UpdateContact;
