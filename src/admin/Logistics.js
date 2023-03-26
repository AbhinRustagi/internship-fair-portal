import React, { useEffect, useState } from "react";
import { useStateValue } from "../utils/StateProvider";
import "./logistics.css";
import CourseList from "../other/CoursesList";
import {
  auth,
  firestore as db,
  storage,
  functions,
} from "../utils/firebase/firebaseConfig";
import { useHistory, Link, Redirect } from "react-router-dom";

import UserProfile from "../components/userProfile.js/UserProfile";

export default function Admin() {
  const [{ user }, dispatch] = useStateValue();
  const History = useHistory();
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    await db
      .collection("users")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().companiesSelected) {
            setUsers((users) => [...users, doc.data().collegeRollNo]);
          }
        });
      });
  }, []);

  const logOut = () => {
    dispatch({
      action: "REMOVE_USER",
    });

    History.push("/");
  };

  return user === "admin" ? (
    <div className="logistics">
      <div className="container">
        <div className="navbar">
          <Link to="/">
            <div className="logo_box">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/ifair-portal.appspot.com/o/assets%2Fpcell_logo.png?alt=media&token=0fab47f3-c265-4b11-a5a5-162437e594c2"
                alt="Placement Cell Logo"
              />
              <p>
                The Placement Cell <br />
                <span>Sri Venkateswara College</span>
              </p>
            </div>
          </Link>
          <div className="button_box">
            <button className="logout_button" onClick={logOut}>
              Log out
            </button>
          </div>
        </div>
        <h2>Entries found: {users.length}</h2>
        <div className="download_csv">
          <Link to="/downloadData">
            <h4>Download here.</h4>
          </Link>
        </div>
        <div className="row">
          {users.length === 0
            ? "Loading all entries from the database. Please wait."
            : users.map((user) => {
                return <UserProfile rollno={user} />;
              })}
        </div>
      </div>
    </div>
  ) : (
    <Redirect to="/" />
  );
}