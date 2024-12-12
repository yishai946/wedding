import React, { useState } from "react";
import { db } from "./firebaseConfig";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

const GuestForm = () => {
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

      const existingGuest = await getGuestByPhone(phone);
      if (existingGuest.length > 0) {
        alert("מספר הטלפון קיים כבר, נסה שוב");
        return;
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
      console.error("Error adding document: ", error);
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

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.content}>
        {loading ? (
          <div>Loading...</div>
        ) : formSubmitted ? (
          <div style={styles.successMessage}>
            <h2>תודה רבה! פרטיך נשלחו בהצלחה.</h2>
            <button onClick={resetForm} style={styles.button}>
              שלח/י טופס נוסף
            </button>
          </div>
        ) : (
          <>
            <h1 style={styles.title}>אליה & הללי</h1>
            <p style={styles.description}>
              אנו נרגשים להזמינך להצטרף לחגוג את אהבתנו ביום המיוחד שלנו. אנא
              מלא/י את הפרטים כדי שנדע אם נזכה לראותך!
            </p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>
                שם מלא:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  placeholder="הקלד/י את שמך"
                  required
                />
              </label>
              <label style={styles.label}>
                מספר טלפון:
                <input
                  type="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                  placeholder="הקלד/י את מספר הטלפון שלך"
                  required
                />
              </label>
              <label style={styles.label}>
                האם תגיע/י?
                <select
                  value={isAttending}
                  onChange={(e) => setIsAttending(e.target.value)}
                  style={styles.select}
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
                <label style={styles.label}>
                  כמה אנשים מגיעים (כולל אותך)?
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    style={styles.input}
                    placeholder="מספר אורחים"
                    required
                  />
                </label>
              )}
              <button type="submit" style={styles.button}>
                שלח/י
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6d8d2",
    padding: "10px",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom right, #ff9a9e, #fad0c4, #fad0c4)",
    zIndex: -1,
    opacity: 0.9,
  },
  content: {
    width: "100%",
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fffafc",
    textAlign: "center",
    fontFamily: "'Amatic SC', cursive",
  },
  title: {
    fontSize: "28px",
    color: "#c70039",
    margin: "0 0 10px",
  },
  description: {
    fontSize: "16px",
    color: "#444",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    width: "100%",
    marginBottom: "10px",
    fontSize: "18px",
    color: "#333",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    marginTop: "5px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    marginTop: "5px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f3f3f3",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#c70039",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    width: "100%",
    maxWidth: "200px",
  },
  successMessage: {
    textAlign: "center",
    color: "#333",
    fontSize: "18px",
  },

  // Media query for smaller devices
  "@media (max-width: 768px)": {
    title: {
      fontSize: "24px",
    },
    description: {
      fontSize: "14px",
    },
    button: {
      padding: "8px 15px",
      fontSize: "14px",
    },
  },
};


export default GuestForm;
