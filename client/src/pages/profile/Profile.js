import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
 

function Profile() {
  const [contactData, setContactData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
 

  useEffect(() => {

    axios.get('http://localhost:5001/')
      .then(result => setContactData(result.data))
      .catch(err => console.log(err))
  }, []);
 

  return (
    <div>
       
      <h1>profile</h1>

    </div>


  );
}

export default Profile;
