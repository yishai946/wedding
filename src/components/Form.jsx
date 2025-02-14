import React, { useState } from "react";
import { db } from "../firebaseConfig";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import SuccessMessage from "./SuccessMessage";

const Form = () => {
  const [name, setName] = useState("");
  const [isAttending, setIsAttending] = useState("");
  const [guests, setGuests] = useState(1);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Function to check if a phone number already exists in Firestore
  const getGuestByPhone = async (phone) => {
    const guestsRef = collection(db, "guests");
    const q = query(guestsRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if the phone exists
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate phone number format: 05X-XXX-XXXX
      const phoneRegex = /^05\d([-]{0,1})\d{3}([-]{0,1})\d{4}$/;
      if (!phoneRegex.test(phone)) {
        alert("מספר הטלפון אינו תקין, נסה שוב");
        setLoading(false);
        return;
      }

      if (await getGuestByPhone(phone)) {
        alert("מספר הטלפון קיים כבר, נסה שוב");
        setLoading(false);
        return;
      }

      const timestamp = new Date().getTime().toString();

      await setDoc(doc(db, "guests", timestamp), {
        name,
        isAttending,
        guests: isAttending == "yes" ? +guests : 0, 
        phone,
      });

      setFormSubmitted(true);
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setIsAttending("");
    setGuests(1);
    setPhone("");
    setFormSubmitted(false);
  };

  // Function to handle Waze navigation, prioritizing app usage
  const handleWazeNavigation = () => {
    const wazeAppUrl = "waze://?ll=32.51027371,35.49961797&navigate=yes";
    const wazeWebUrl =
      "https://waze.com/ul?ll=32.51027371,35.49961797&navigate=yes";

    let opened = false;

    const onVisibilityChange = () => {
      if (document.hidden) {
        opened = true;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    window.location.href = wazeAppUrl;

    setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (!opened) {
        window.location.href = wazeWebUrl;
      }
    }, 2000);
  };

  return (
    <div className="form-container">
      {loading ? (
        <div>Loading...</div>
      ) : formSubmitted ? (
        <SuccessMessage resetForm={resetForm} />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label>
              שם מלא:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הקלד/י את שמך"
                required
              />
            </label>
            <label>
              מספר טלפון:
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="טלפון"
              />
            </label>
            <label>
              האם תגיע/י?
              <select
                value={isAttending}
                onChange={(e) => setIsAttending(e.target.value)}
                required
              >
                <option value="" disabled>
                  בחר/י
                </option>
                <option value="yes">כן</option>
                <option value="no">לא</option>
                <option value="maybe">אולי</option>
              </select>
            </label>
            {isAttending === "yes" && (
              <label>
                כמה אנשים מגיעים (כולל אותך)?
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  min="1"
                  required
                />
              </label>
            )}
            <button className="button" type="submit">
              שלח/י
            </button>
            <button
              className="waze-button"
              onClick={handleWazeNavigation}
              type="button"
            >
              ניווט לאירוע
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Form;
