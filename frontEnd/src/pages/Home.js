import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import useImage from "../images/signup1.webp";
import logoMinhphat from "../images/LOGO_MINHPHAT.png";
import logoThepost from "../images/LOGO_THEPOST.png";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
export default function Home() {

   const { user, dispatch } = useContext(Context);
   const [greeting, setGreeting] = useState([
      'THEPOST SOUVENIR',
      2000,
      'MINHPHAT SOUVENIR',
      2000,
      'VIETNAMESE TRADITIONAL HANDMADE',
      2000,
      'THANK YOU FOR SHOPPING WITH US',
      2000
   ])
   const [shop, setShop] = useState('');
   const navigate = useNavigate();

   function tokenValid() {
      if (!user) return 1;
      const currentDate = new Date();
      const expiryDate = new Date(parseInt(+user.exp) * 1000);
      return currentDate < expiryDate;
   }

   useEffect(() => {
      if (!tokenValid()) {
         console.log("Quá thời gian đăng nhập, hãy đăng nhập lại")
         dispatch({ type: "LOGOUT" });
         localStorage.clear('user');
         navigate("/")
      }
   })

   useEffect(() => {
      if (user) {
         if (user.shop === 'MINH PHAT SOUVENIR') {
            setShop('MP');
         } else {
            setShop('TP');
         }
      }
   }, [user])

   return (
      <>
         <section className="vh-100" style={{ width: '100%', height: '100%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
            <div className="container-fluid h-custom" >
               <div className="row d-flex justify-content-center align-items-center h-200">
                  <div className="row d-flex justify-content-center align-items-center h-200" style={{ textAlign: 'center', color: 'red', fontFamily: 'Segoe Print' }}>
                     <TypeAnimation
                        sequence={greeting}
                        wrapper="span"
                        speed={20}
                        style={{ fontSize: '2em', display: 'inline-block' }}
                        repeat={Infinity}
                     />
                  </div>
                  <div className="row d-flex justify-content-center align-items-center h-200" >
                     {user ?
                        <img
                           style={{ width: "50%", height: "50%" }}
                           src={shop === 'MP' ? logoMinhphat : logoThepost}
                           className="img-fluid"
                           alt="Sample..."
                        />
                        :
                        <img
                           style={{ width: "60%", height: "60%" }}
                           src={useImage}
                           className="img-fluid"
                           alt="Sample..."
                        />
                     }

                  </div>
               </div>

            </div>
         </section>


      </>
   )
}
