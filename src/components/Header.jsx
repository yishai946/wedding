import React from "react";

const Header = () => {
  return (
    <div className="header">
      <h1>אליה שלום & הללי מרים</h1>
      <p>
        בס"ד <br />
        הנכם מוזמנים לחתונה של אליה שלום & הללי מרים <br />
        שתתקיים אי"ה ביום שלישי ד' באדר (04/03/2025) <br />
        קבלת פנים - 19:00
        <br />
        חופה - 20:00 <br />
        באולם החתונות הסיינדה <br />
        (אזור התעשייה הצפונית, העמל בית שאן) <br />
        <br />
        לנוחיותכם ניווט מהיר לאירוע עם ווייז <br />
        <br />
        נשמח לראותכם בין אורחינו <br />
        אליה שלום & הללי מרים
      </p>
      <div className="families-wrapper">
        <div className="family-column">
          <p>הורי החתן</p>
          <p className="family-text">מיכאל ורויטל</p>
          <p>ביטון</p>
        </div>
        <div className="family-column">
          <p>הורי הכלה</p>
          <p className="family-text">מרדכי ורות</p>
          <p>כהן</p>
        </div>
      </div>
      <p>אנא אשרו הגעתכם בתחתית ההזמנה</p>
    </div>
  );
};

export default Header;
