import React from 'react';
import './Home.css'
import WelcomeImage from '../../images/yield/welcome.jpg';

function Home() {

    return (
        <div>
            <div className='parallax'>
                <div class="centered"><h1>Smart Farming, Better Yields</h1></div>
            </div>

            <div className='salon_body'>
                <div className='welcome_topic'> <h1>Welcome to RiceSmart</h1></div>

                <div className='welcome'>

                    <div className='welcome_des'>
                        <p>Empower your rice farming with our cutting-edge solutions. At RiceSmart, 
                            we provide innovative tools and insights to optimize your cultivation process, 
                            enhance yields, and ensure a sustainable future. <br></br><br></br>

                            From real-time disease monitoring to precise yield predictions, 
                            our smart solutions are designed to elevate your farming practices. 
                            Join us in transforming rice agriculture with precision and efficiency.<br></br><br></br>

                            With RiceSmart, you can monitor diseases in real-time, staying ahead of potential 
                            threats with our cutting-edge disease detection system. Plan and optimize your harvest
                            with precise yield forecasting, and get expert advice on fertilizers and pesticides
                            to enhance crop health and productivity.<br></br><br></br>

                            Join our community of forward-thinking farmers and experience the future of rice 
                            cultivation today. With RiceSmart, you’re not just farming smarter; you’re cultivating a 
                            more sustainable and prosperous future.


                        </p>

                    </div>

                    <div className='welcome_photo'><img src={WelcomeImage} alt="welcome" /></div>
                </div>

                <div className="about-image">
                    <div className="about-text">
                        <h1>About Us</h1><br></br>

                        <p>RiceSmart is a comprehensive platform designed to revolutionize yield prediction and crop management for farmers. By integrating historical data with real-time field inputs such as location, soil quality, climate conditions, crop variety, and farming techniques, the system helps users make informed decisions about planting, harvesting, 
                            and ploughing. Farmers can quickly determine whether current conditions are favorable for their crops, enhancing productivity and reducing risks. <br></br><br></br>
                            <br></br><br></br>
                            Farmers can quickly determine whether current conditions are favorable for their crops, enhancing productivity and reducing risks.
                             RiceSmart also generates detailed reports on farm success rates, offering a clear picture of overall crop health across various regions.
                             The platform goes beyond yield prediction by providing disease management tools that allow users to report issues related to crop diseases. 
                             Farmers can fill out forms with detailed descriptions of symptoms and GPS locations, 
                             enabling the platform to map disease spread and issue emergency alerts to local agriculture agents and affected users. 
                          <br></br><br></br>
                          Additionally, RiceSmart fosters a collaborative environment where users can share solutions, whether it’s through home remedies, 
                          fertilizer suggestions, or pest control tips. To further assist farmers, the platform offers tailored recommendations for fertilizer and pesticide use, 
                          including refill and disposal options, making it easier to manage resources sustainably. With its holistic approach, RiceSmart empowers farmers 
                          to boost their yield while addressing challenges in a proactive and efficient manner.
                        </p>

                    </div>
                </div>
               
            </div>



        </div>

        

    );
}

export default Home;