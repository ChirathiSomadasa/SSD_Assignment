import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
//import './AddSolution.css';


function AddSolution() {
    const navigate = useNavigate();
    const { id } = useParams()

    const [contactData, setContactData] = useState([]);
    const [disease, setDisease] = useState('');
    const [solution, setSolution] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5001/getContact/${id}`)
            .then(res => {
                const problem = res.data;
                setDisease(problem.disease);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleSolution = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/addSolution/${id}`, { solution });
            setSuccessMessage('Solution added successfully!');
            alert('Solution added successfully!');
            setSolution(''); // Clear the form after submission

            // Fetch the updated contact data to display the new solution
            const res = await axios.get(`http://localhost:5001/getSolution/${id}`);
            setContactData(res.data);  // Update state with the latest contact data
            navigate('/contact')
        } catch (err) {
            setError('Error adding solution. Please try again.');
            alert('Error adding solution. Please try again.');
        }
    };


    return (
        <div className='QAddProblemForm'>
            <div className='Aaddproblem_photo'>
                <br></br><br></br>
                <form className="PAproductForm" onSubmit={handleSolution}>
                    <h2 className="PAtopic">Add Solution</h2>
                    <div className="PAform-group">
                        <label>Disease:</label>
                        <input type="text" className="PAinarea" value={disease} onChange={(e) => setDisease(e.target.value)} required />
                    </div>

                    <div className="PAform-group">
                        <label>Solution:</label>
                        <textarea className="PAinarea" value={solution} onChange={(e) => setSolution(e.target.value)} required />
                    </div>
                    <button type="submit" className="PAbtn">Submit</button>
                </form>
                {error && <p>{error}</p>}
                {successMessage && <p>{successMessage}</p>}
            </div>
        </div>



    );
}

export default AddSolution;
