import React, { useEffect, useState } from 'react';
import './Contact.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import Logo from '../../images/logo.png';  
import 'jspdf-autotable';


function Contact() {
    const [searchQuery, setSearchQuery] = useState(''); 
    const [contactData, setContactData] = useState([]);
    const [filteredContactData, setFilteredContactData] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {

        axios.get('http://localhost:5001/')
          .then(result => setContactData(result.data))
          .catch(err => console.log(err))
      }, []);

    // Function to filter predictions based on the search query
    function handleSearch() {
        // Implement search logic here
        // For example, filter productData based on searchQuery
        const filteredContacts = contactData.filter(contact =>
          contact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.disease.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setContactData(filteredContacts);
      }
    
    
    // Function to clear the search query and reset the prediction list
    const handleClearSearch = () => {
        setSearchQuery('');
        setFilteredContactData(contactData); // Reset to original predictions list
    };

    const generateReport = () => {
        const filteredContacts = contactData.filter(contact =>
          contact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.disease.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        // Use filtered contacts if any, otherwise use all contact data
        const dataToGenerate = filteredContacts.length > 0 ? filteredContacts : contactData;
    
        const doc = new jsPDF();
    
        // Set the black background for the header
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 50, 'F');  // Black background for header
    
        // Add logo (ensure the path to the logo is correct)
        const img = new Image();
        img.src = Logo;
    
        img.onload = () => {
          // Add the logo image
          doc.addImage(img, 'PNG', 80, 10, 50, 25);
    
          const pageWidth = doc.internal.pageSize.getWidth();
          const title = 'Recommended Solution Report';
          const textWidth = doc.getTextWidth(title);
          const textX = (pageWidth - textWidth) / 2;
    
          // Add title
          doc.setFontSize(18);
          doc.setTextColor(255, 255, 255); // White text for title
          doc.text(title, textX, 45);
    
          // Add subtitle
          doc.setFontSize(12);
          const subtitle = 'Summary of potential solutions for diseases';
          const subtitleWidth = doc.getTextWidth(subtitle);
          const subtitleX = (pageWidth - subtitleWidth) / 2;
          doc.setTextColor(0, 0, 0); // Black text for subtitle
          doc.text(subtitle, subtitleX, 60);
    
          // Table with diseases and solutions
          const header = [['Category', 'Symptoms', 'Solutions']];
          const data = dataToGenerate.map(contact => [
            contact.category,
            contact.description,
            contact.solutions.map(sol => sol.solution).join(', ')
          ]);
    
          // Generate the disease table
          doc.autoTable({
            head: header,
            body: data,
            startY: 70,
            styles: {
              textColor: [0, 0, 0],        // Black text color for the table body
              lineColor: [128, 128, 128],  // Gray border color
              lineWidth: 0.1,              // Border thickness
            },
            headStyles: {
              fillColor: [0, 0, 0],        // Black background for header
              textColor: [255, 255, 255],  // White text for header
              lineColor: [128, 128, 128],  // Gray border color
              lineWidth: 0.1,              // Border thickness for header
            },
          });
    
          let tableEndY = doc.previousAutoTable.finalY + 10;  // Get the end Y-coordinate of the table
    
          // 1. Group diseases by location and display in a table
          const diseasesByLocation = {};
          contactData.forEach(contact => {
            const location = contact.location || "Unknown Location";  // Handle missing location data
            if (!diseasesByLocation[location]) {
              diseasesByLocation[location] = [];
            }
            diseasesByLocation[location].push(contact.disease);
          });
    
          const locationData = Object.keys(diseasesByLocation).map(location => [
            location,
            diseasesByLocation[location].join(', ')  // Join diseases in the same location as a string
          ]);
    
          // Save the PDF
          doc.save('Recomended_Solution_Report.pdf');
        };
    
        img.onerror = () => {
          console.error('Failed to load the logo image.');
        };
      };
    return (
        <div className="disease-list-container">
            <h1>Manage Solutions</h1>
            <div className='disease-filter-bar'>
                <input
                    className='disease-filter-search'
                    placeholder="Search disease"
                    type="text"
                    value={searchQuery} 
                    onChange={(event) => setSearchQuery(event.target.value)} 
                />
                <button className='disease-filter-search-btn' onClick={handleSearch}>Search</button>  {/* Search button */}
                <button className='disease-filter-search-btn' onClick={handleClearSearch}>Clear Search</button> {/* Clear Search button */}
                <button className='generate_report_disease' onClick={generateReport}>Generate Report</button>
            </div>

            <table className="prediction-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Symptoms</th>
                        <th>Solution</th>

                         
                    </tr>
                </thead>
                <tbody>
                {contactData.map((contact) => (
                                // Only render the row if there are solutions available
                                contact.solutions && contact.solutions.length > 0 && (
                                    <tr key={contact._id}>
                                        <td>{contact.category}</td>
                                        <td>{contact.description}</td>
                                        <td>
                                            <ul>
                                                {contact.solutions.map((sol, index) => (
                                                    <li key={index} className="solution-item">
                                                        <span>{sol.solution}</span>
                                                         
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
    );
}

export default Contact;
