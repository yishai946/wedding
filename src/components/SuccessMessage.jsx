import React from "react";

const SuccessMessage = ({ resetForm }) => (
  <div className="success-message">
    <h2>תודה רבה! פרטיך נשלחו בהצלחה.</h2>
    <button onClick={resetForm}>שלח/י טופס נוסף</button>
  </div>
);

export default SuccessMessage;
