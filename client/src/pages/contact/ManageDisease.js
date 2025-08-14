import { useEffect, useState } from 'react';
import React from 'react';
import './ManageDisease.css';
import axios from 'axios';
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useAuthEmail, useAuthPassword } from '../../auth'
import { useNavigate } from 'react-router-dom';


function ManageDisease() {
  const [contactData, setContactData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const authEmail = useAuthEmail();
  const authPassword = useAuthPassword();
  const navigate = useNavigate();


  useEffect(() => {

    axios.get('http://localhost:5001/')
      .then(result => setContactData(result.data))
      .catch(err => console.log(err))
  }, []);


  const handleDelete = (id) => {
    // Display a confirmation popup
    if (window.confirm("Are you sure you want to delete it?")) {
      // If confirmed, proceed with the deletion
      axios.delete(`http://localhost:5001/deleteContact/${id}`)
        .then(() => {
          // After successful deletion, update state
          setContactData(contactData.filter(contact => contact._id !== id));

          // Display success message
          alert("Problem deleted successfully.");
        })
        .catch(err => {
          console.log(err);
          // Optionally display an error message
          alert("Failed to delete the problem. Please try again.");
        });
    } else {
      // If the user cancels the deletion, you can log or handle it here
      console.log("Deletion cancelled.");
    }
  };


  function handleSearch() {
    // Implement search logic here
    // For example, filter productData based on searchQuery
    const filteredContacts = contactData.filter(contact =>
      contact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.disease.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setContactData(filteredContacts);
  }

  const handleEdit = (id) => {
    // Redirect to the edit page
    window.location.href = `/contact/UpdateContact/${id}`;

  };


  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSearch();  // Trigger search when "Enter" key is pressed
    }
  }

  if (authEmail == null || authPassword == null) {
    navigate('/login');
    return null;


  } else {
    return (
      <div>
        <div class="SStoreSearch">
          <input type="text" class="SSearch" onClick={handleSearch} value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}  // Update search query state
            onKeyPress={handleKeyPress}  // Listen for "Enter" key press
            placeholder="Search by category..." />
        </div>

        <div class="SContactStore">
          <br></br><br></br>
          <h2>Manage Diseases Results</h2>
          <table className="SContactTable">
            <thead>
              <tr>
                <th>Category</th>
                <th>Disease</th>
                <th>Symptoms</th>
                <th>Location</th>
                <th>Solutions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactData.map((contact) => (
                <tr key={contact._id}>
                  <td className='thead'>{contact.category} </td>
                  <td className='thead'>{contact.disease}</td>
                  <td className='thead'>{contact.description}</td>
                  <td className='thead'> {contact.location}</td>
                  <td className='thead'>
                    <ul>
                      {contact.solutions.map((sol, index) => (
                        <li key={index}>{sol.solution}</li>
                      ))}
                    </ul>
                  </td>


                  <td>
                    <MdEdit className="SeditIcon" onClick={() => handleEdit(contact._id)} />
                    <MdDeleteOutline className="SdeleteIcon" onClick={() => handleDelete(contact._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>


    );
  }
}

export default ManageDisease;
