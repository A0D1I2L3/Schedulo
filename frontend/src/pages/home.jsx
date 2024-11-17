import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export const HomeComponent = () => {
  const [name, setName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchUserName = () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          navigate("/");
          return;
        }

        setIsAuthenticated(true);

        const userDocRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setName(docSnap.data().name);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      });
    };

    checkAuthAndFetchUserName();
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-left">
        <h1 className="text-[6vh] font-serif">Welcome, {name || ""}!</h1>
        <p className="text-lg mb-2 font-sans">What would you like to do?</p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/register")}
            className="flex flex-row text-xl justify-between gap-x-[14vh] bg-zinc-900 border-solid border-[1px] border-zinc-600 hover:bg-gray-700 items-center px-3 py-2 text-white text-md font-serif">
            <div>Register</div>
            <div className="text-pink-400 mr-2">•</div>
          </button>

          <button
            onClick={() => navigate("/host")}
            className="flex flex-row text-xl justify-between gap-x-[14vh] bg-zinc-900 border-solid border-[1px] border-zinc-600 hover:bg-gray-700 items-center px-3 py-2 text-white text-md font-serif">
            <div>Host</div>
            <div className="text-yellow-400 mr-2">•</div>
          </button>

          <button
            onClick={() => navigate(`/events/Q20G-ZE55/participants`)}
            className="flex flex-row text-xl justify-between gap-x-[14vh] bg-zinc-900 border-solid border-[1px] border-zinc-600 hover:bg-gray-700 items-center px-3 py-2 text-white text-md font-serif">
            <div>Check</div>
            <div className="text-purple-400 mr-2">•</div>
          </button>

          <button
            onClick={() => navigate("/view")}
            className="flex flex-row text-xl justify-between gap-x-[14vh] bg-zinc-900 border-solid border-[1px] border-zinc-600 hover:bg-gray-700 items-center px-3 py-2 text-white text-md font-serif">
            <div>View</div>
            <div className="text-orange-400 mr-2">•</div>
          </button>
        </div>
      </div>
    </div>
  );
};
