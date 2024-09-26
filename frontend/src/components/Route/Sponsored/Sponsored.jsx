import React from "react";
import styles from "../../../styles/styles";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-start">
          <img src="https://pro-avsolution.com/wp-content/themes/undercustoms-v5-proav/img/brands/sony.png"
           style={{width:"150px",objectFit:"contain"}}
           alt="" />
        </div>

        <div className="flex items-start">
          <img src="https://1.bp.blogspot.com/-v_3VHAcUjIE/YPPtxqd0pPI/AAAAAAAAACc/qU78N9Tw8Q4RVwlph6dqxvJqmdDZWr2sgCNcBGAsYHQ/s2048/Singer-Logo.png"
           style={{width:"150px",objectFit:"contain"}}
           alt="" />
        </div>

        <div className="flex items-start">
          <img src="https://th.bing.com/th/id/OIP.XSYhgWEAtf8jbbU7pcItCAHaE_?rs=1&pid=ImgDetMain"
           style={{width:"150px",objectFit:"contain"}}
           alt="" />
        </div>

        <div className="flex items-start">
          <img src="https://cdn.luxatic.com/wp-content/uploads/2019/08/apple-logo.jpg"
           style={{width:"150px",objectFit:"contain"}}
           alt="" />
        </div>

        <div className="flex items-start">
          <img src="https://th.bing.com/th/id/OIP.vaI5mdOwfF8e50rGYjsdKgHaE6?rs=1&pid=ImgDetMain"
           alt=""
           style={{width:"150px",objectFit:"contain"}} />
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
