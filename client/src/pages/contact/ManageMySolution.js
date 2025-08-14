import { useEffect, useState } from 'react';
import React from 'react';
import './ManageMySolution.css'; // Ensure CSS file contains relevant styles
import axios from 'axios';
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useAuthEmail, useAuthPassword } from '../../auth';
import { useNavigate } from 'react-router-dom';

function ManageMySolution() {
    const [contactData, setContactData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const authEmail = useAuthEmail();
    const authPassword = useAuthPassword();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5001/')
            .then(result => setContactData(result.data))
            .catch(err => console.log(err));
    }, []);
 
    const handleDeleteSolution = (contactId, solutionIndex) => {
        if (window.confirm("Are you sure you want to delete this solution?")) {
            const updatedContacts = contactData.map(contact => {
                if (contact._id === contactId) {
                    contact.solutions.splice(solutionIndex, 1); // Remove the solution from the array
                }
                return contact;
            });

            setContactData([...updatedContacts]);

            axios.put(`http://localhost:5001/updateContact/${contactId}`, { solutions: updatedContacts.find(c => c._id === contactId).solutions })
                .then(() => alert("Solution deleted successfully."))
                .catch(err => {
                    console.log(err);
                    alert("Failed to delete the solution. Please try again.");
                });
        }
    };

    
    const handleEditSolution = (contactId, solutionIndex) => {
        const updatedSolution = prompt("Enter the updated solution:");
        if (updatedSolution) {
            const updatedContacts = contactData.map(contact => {
                if (contact._id === contactId) {
                    contact.solutions[solutionIndex].solution = updatedSolution; // Update the specific solution
                }
                return contact;
            });

            setContactData([...updatedContacts]);

            axios.put(`http://localhost:5001/updateContact/${contactId}`, { solutions: updatedContacts.find(c => c._id === contactId).solutions })
                .then(() => alert("Solution updated successfully."))
                .catch(err => {
                    console.log(err);
                    alert("Failed to update the solution. Please try again.");
                });
        }
    };





    if (authEmail == null || authPassword == null) {
        navigate('/login');
        return null;
    } else {
        return (
            <div>


                <div className="SContactStore">
                    <br /><br />
                    <h2>Manage Solutions</h2>
                    <table className="SContactTable">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Symptoms</th>
                                <th>Solutions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactData.map((contact) => (
                                // Only render the row if there are solutions available
                                contact.solutions && contact.solutions.length > 0 && (
                                    <tr key={contact._id}>
                                        <td className='thead'>{contact.category}</td>
                                        <td className='thead'>{contact.description}</td>
                                        <td className='thead'>
                                            <ul>
                                                {contact.solutions.map((sol, index) => (
                                                    <li key={index} className="solution-item">
                                                        <span>{sol.solution}</span>
                                                        <span className="icon-container">
                                                            <MdEdit className="SeditIcon" onClick={() => handleEditSolution(contact._id, index)} />
                                                            <MdDeleteOutline className="SdeleteIcon" onClick={() => handleDeleteSolution(contact._id, index)} />
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        );
    }
}

export default ManageMySolution;
