import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import useImage from "../images/signup2.jpg";
import logoMinhphat from "../images/LOGO_MINHPHAT.png";
import logoThepost from "../images/LOGO_THEPOST.png";
import { useNavigate } from "react-router-dom";

export default function Home() {

   const { user, dispatch } = useContext(Context);
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
         <section className="vh-100">
            <div className="container-fluid h-custom" >
               <div className="row d-flex justify-content-center align-items-center h-200">
                  <div className="row d-flex justify-content-center align-items-center h-200" >
                     {user ?
                        <img
                           style={{ width: "80%", height: "50%" }}
                           src={shop === 'MP' ? logoMinhphat : logoThepost}
                           className="img-fluid"
                           alt="Sample..."
                        />
                        :
                        ""
                        // <img
                        //    style={{ width: "45%", height: "50%" }}
                        //    src={useImage}
                        //    className="img-fluid"
                        //    alt="Sample..."
                        // />
                     }

                  </div>
               </div>

            </div>
            <div

            >
               {/* <div className="text-center mb-3 mb-md-0">
                  Copyright © 2023. All rights reserved.
               </div> */}
            </div>
         </section>


      </>
   )
}
