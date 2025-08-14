import { useEffect, useState } from 'react'
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../../images/logo.png';



function Header() {

  var menu = [
    {
      name: "Admin Dashboard",
      icon: "home",
      navigate: "adminhome",
    },
    {
      name: "Users",
      icon: "person",
      navigate: "user",
    },
    {
      name: "Yield Prediction",
      icon: "grass",
      navigate: "prediction",
    },
    {
      name: "Fertilizers & Pesticides",
      icon: "agriculture",
      navigate: "fertilizers",
    },
    {
      name: "Diseases",
      icon: "healing", // Icon for Questions
      navigate: "contact/Contact", // Define your navigation route for Questions
    },
    {
      name: "Solutions",
      icon: "lightbulb", // Icon for Answers
      navigate: "contact/Solution", // Define your navigation route for Answers
    },
   ];

  const[openNavMenu,setOpenNavMenu] = useState(false);
  var navigate = useNavigate();

  function onMenuClick(id) {
    if (id != undefined) {
      navigate(id);
    }
  }

  function onSubMenuClick(id) {
    if (id != undefined) {
      navigate(id);
    }
  }

  useEffect(() => {
    var sidenavOut = document.getElementById('sidenavOut');
    var sidenav = document.getElementById('sidenav');
    if (openNavMenu) {
      sidenavOut.style.display = "block";
      sidenav.style.marginLeft = "0";
    } else {
      sidenavOut.style.display = "none";
      sidenav.style.marginLeft = "-250px";
    }
  });

  return (

    <>

      <div className='header'>
        <div className='header-container'>

          <div onClick={() => setOpenNavMenu(true)} className='nav-menu-btn'>
            <span className="material-icons-round">menu</span>
          </div>

          <div className='headerLogo'>
            <img src={Logo} alt='logo' className='logo' />
          </div>

          <div>
            <h2 className='headerTopic'> Admin Dashboard</h2>
          </div>


        </div>
      </div>

      <div onClick={() => { setOpenNavMenu(false) }} id='sidenavOut' className='sidenav-out'></div>
      <div id='sidenav' className="sidenav">
        <div className='sidenav-container'>

          {menu.map((item) =>

            <div key={item.name} className='sidenav-item'>
              <div onClick={() => onMenuClick(item.navigate)} className='sidenav-item-main'>
                <div className='sidenav-item-container'>
                  <span className="material-icons-round">{item.icon}</span>
                  <p>{item.name}</p>
                </div>
              </div>

              {(item.sub_menu != undefined) ? (

                <div className='sidenav-sub-item-container'>

                  {item.sub_menu.map((submenu) =>

                    <div onClick={() => onSubMenuClick(submenu.navigate)} key={submenu.name} className='sidenav-item-sub-main'>
                      <p>{submenu.name}</p>
                    </div>
                    

                  )}

                </div>

              ) : ("")}


            </div>

          )}



        </div>
      </div>

    </>


  );
}

export default Header;