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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (phone.length > 0) {
        // regex check that it is valid phone number: 05X-XXX-XXXX
        const phoneRegex = /^05\d([-]{0,1})\d{3}([-]{0,1})\d{4}$/;
        if (!phoneRegex.test(phone)) {
          alert("מספר הטלפון אינו תקין, נסה שוב");
          return;
        }

        if ((await getGuestByPhone(phone)) > 0) {
          alert("מספר הטלפון קיים כבר, נסה שוב");
          return;
        }
      }

      const timestamp = new Date().getTime().toString();
      const attending = isAttending === "yes";

      await setDoc(doc(db, "guests", timestamp), {
        name,
        isAttending: attending,
        guests: isAttending === "yes" ? parseInt(guests) : 0,
        phone,
      });

      setFormSubmitted(true);
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGuestByPhone = async (phone) => {
    const guestsRef = collection(db, "guests");
    const q = query(guestsRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data());
  };

  const resetForm = () => {
    setName("");
    setIsAttending("");
    setGuests(1);
    setPhone("");
    setFormSubmitted(false);
  };

  const handleWazeNavigation = () => {
    const url =
      "https://ul.waze.com/ul?preview_venue_id=23265605.232656051.26996&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location";
    window.open(url);
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
                placeholder="הקלד/י את מספר הטלפון שלך (לא חובה)"
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
            <button className="waze-button" onClick={handleWazeNavigation}>
              ניווט לאירוע
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Form;
