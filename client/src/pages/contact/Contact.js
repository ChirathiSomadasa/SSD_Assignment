import { useEffect, useState } from 'react';
import React from 'react';
import { json, Link } from 'react-router-dom';
import './Contact.css';
import axios from 'axios';
import { MdOutlineLocationOn } from "react-icons/md";
import { jsPDF } from "jspdf";
import Logo from '../../images/logo.png';
import serviceImage from '../../images/Contact/Qwelcome.jpg';  // Make sure to place your image in the public/images folder or src/images folder


function Contact() {
  const [contactData, setContactData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  const handleAddProblem = () => {
    window.location.href = '/contact/ProblemForm';
  };

  const handleDisease = () => {
    window.location.href = '/contact/ManageDisease';
  };

  const handleMySolution = () => {
    window.location.href = '/contact/ManageMySolution';
  };

  const handleLocationClick =() =>{
    window.location.href = '/map/Map';
  }


  useEffect(() => {

    axios.get('http://localhost:5001/')
      .then(result => setContactData(result.data))
      .catch(err => console.log(err))
  }, []);



  function handleSearch() {
    // Implement search logic here
    // For example, filter productData based on searchQuery
    const filteredContacts = contactData.filter(contact =>
      contact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.disease.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setContactData(filteredContacts);
  }


  const handleSolution = (id) => {
    // Redirect to the edit page
    window.location.href = `/contact/AddSolution/${id}`;


  };

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSearch();  // Trigger search when "Enter" key is pressed
    }
  }

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
      const title = 'Disease Detection Report';
      const textWidth = doc.getTextWidth(title);
      const textX = (pageWidth - textWidth) / 2;

      // Add title
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255); // White text for title
      doc.text(title, textX, 45);

      // Add subtitle
      doc.setFontSize(12);
      const subtitle = 'Summary of diseases and potential solutions';
      const subtitleWidth = doc.getTextWidth(subtitle);
      const subtitleX = (pageWidth - subtitleWidth) / 2;
      doc.setTextColor(0, 0, 0); // Black text for subtitle
      doc.text(subtitle, subtitleX, 60);

      // Table with diseases and solutions
      const header = [['Disease', 'Category', 'Symptoms', 'Location', 'Solutions']];
      const data = dataToGenerate.map(contact => [
        contact.disease,
        contact.category,
        contact.description,
        contact.location,
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

      // Create a table for diseases by location
      doc.setFontSize(12);
      doc.text("Spreading Diseases by Location", 80, tableEndY);


      doc.autoTable({
        head: [['Location', 'Diseases']],
        body: locationData,
        startY: tableEndY + 10,
        styles: {
          textColor: [0, 0, 0],        // Black text color for the table body

        },
        headStyles: {
          fillColor: [0, 0, 0],        // Black background for the header
          textColor: [255, 255, 255],  // White text for header

        },
      });

      let locationTableEndY = doc.previousAutoTable.finalY + 10;

      // 2. Group diseases by category and display in a table
      const diseasesByCategory = {};
      contactData.forEach(contact => {
        const category = contact.category || "Unknown Category";  // Handle missing category data
        if (!diseasesByCategory[category]) {
          diseasesByCategory[category] = [];
        }
        diseasesByCategory[category].push(contact.disease);
      });

      const categoryData = Object.keys(diseasesByCategory).map(category => [
        category,
        diseasesByCategory[category].join(', ')  // Join diseases in the same category as a string
      ]);

      // Create a table for diseases by category
      doc.setFontSize(12);
      doc.text("Diseases by Category", 90, locationTableEndY);

      doc.autoTable({
        head: [['Category', 'Diseases']],
        body: categoryData,
        startY: locationTableEndY + 10,
        styles: {
          textColor: [0, 0, 0],        // Black text color for the table body

        },
        headStyles: {
          fillColor: [0, 0, 0],        // Black background for the header
          textColor: [255, 255, 255],  // White text for header

        },
      });


      // Save the PDF
      doc.save('Disease_Detection_Report.pdf');
    };

    img.onerror = () => {
      console.error('Failed to load the logo image.');
    };
  };


  return (
    <div>
      <div className='Qparallax'>
        <div className="Qcentered">
          <h1>Smart Farming, Better Solutions</h1>
        </div>
      </div>

      <div className='QWelcomeContent'>
        <div className='Qwelcome_topic'> <h1>Why Choose our Services</h1></div>

        <div className='Qwelcome'>

          <div className='Qwelcome_des'>
            <p>Improve your rice cultivation with RiceSmart's innovative equipment and expert advice.
              We offer real-time disease monitoring and accurate production
              estimates to enhance your farming methods.
              <br></br><br></br>

              Our platform provides individualized solutions for pest management,
              nutrient deficits, and best farming practices. Receive expert guidance
              suited to your individual needs.
              <br></br><br></br>

              RiceSmart enables real-time crop health monitoring, early hazard detection,
              and accurate harvest planning. Our expert recommendations for fertilizers
              and insecticides can help your crops grow.<br></br><br></br>

              Join our network of forward-thinking farmers to learn about the future of rice
              agriculture. RiceSmart provides tools and knowledge for educated decision-making,
              leading to sustainable and prosperous farming.

            </p>

          </div>

          <div className='Qwelcome_photo'><img src={serviceImage} alt="welcome" /></div>
        </div>

      </div>

      <div class="QStoreSearch">
        <input type="text" class="QSearch" onClick={handleSearch} value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  // Update search query state
          onKeyPress={handleKeyPress}  // Listen for "Enter" key press
          placeholder="Search by category..." />
      </div>
      <div class="QaddBtn">
        <Link to="/Contact/AddProblem">
          <div><button type="primary" onClick={handleAddProblem} className="Qadd-problem-button">Add Disease
          </button></div>
        </Link>
        <Link to="/Contact/ManageDisease">
          <div><button type="primary" onClick={handleDisease} className="Qmanagebtn">My Diseases
          </button></div>
        </Link>
        <Link to="/Contact/ManageMySolution">
          <div><button type="primary" onClick={handleMySolution} className="Qsolbtn">My Solutions
          </button></div>
        </Link>
        <Link >
          <div><button type="primary" onClick={generateReport} className="Qgeneratebtn">Generate Report
          </button></div>
        </Link>
      </div>
      <div class="QContactStore">
        {
          contactData.map((contact) => (
            <div class="QContactCard" key={contact._id}>
              <h7>{contact.category}</h7>
              <br></br>
              <p><strong>Disease</strong> <br>
              </br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{contact.disease}</p>
              <p><strong>Symptoms   </strong><br></br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{contact.description}</p><br></br>

                <p>
                <MdOutlineLocationOn className="QlocationIcon" onClick={() => handleLocationClick(contact.location)} // Pass the location data
                />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{contact.location}
                </p>
              <div>
                <h4>Solutions:</h4>
                {
                  contact.solutions.map((sol, index) => (
                    <ul >
                      <li key={index}> {sol.solution}</li>
                    </ul>
                  ))
                }
              </div>
              <div class="QCardActions">
                <div><button type="primary" onClick={() => handleSolution(contact._id)} className="QSolutionbtn">Add Solution
                </button></div>
              </div>
            </div>
          ))
        }
      </div>

    </div>


  );
}

export default Contact;
