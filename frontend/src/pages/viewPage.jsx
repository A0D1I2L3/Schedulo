import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Btn.css";

const ViewPage = () => {
  const eventsPerPage = 3;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchUserName = () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          navigate("/");
          return;
        }

        setIsAuthenticated(true);
        setUser(user);

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

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchInitialEvents(user);
    }
  }, [isAuthenticated, user]);

  const fetchInitialEvents = async (currentUser) => {
    if (!currentUser) {
      console.error("No user is logged in.");
      setEvents([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const eventsRef = collection(db, "events");

      const q = query(
        eventsRef,
        where("participantEmails", "array-contains", currentUser.email),
        orderBy("name"),
        limit(eventsPerPage)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setEvents([]);
        setHasMore(false);
      } else {
        const fetchedEvents = snapshot.docs.map((doc) =>
          formatEvent(doc, currentUser.email)
        );
        setEvents(fetchedEvents);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === eventsPerPage);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreEvents = async () => {
    if (!lastVisible || !hasMore) return;

    try {
      setLoading(true);
      const eventsRef = collection(db, "events");

      const q = query(
        eventsRef,
        where("participants", "array-contains", { email: user.email }),
        orderBy("name"),
        startAfter(lastVisible),
        limit(eventsPerPage)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
      } else {
        const fetchedEvents = snapshot.docs.map((doc) =>
          formatEvent(doc, user.email)
        );
        setEvents((prevEvents) => [...prevEvents, ...fetchedEvents]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching more events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatEvent = (doc, userEmail) => {
    const data = doc.data();
    const isHost = data.hostEmail === userEmail;

    let eventStatus = data.status || "Going";
    if (isHost) {
      eventStatus = `Host`;
    }

    return {
      name: data.name,
      status: eventStatus,
      color: getEventColor(eventStatus, isHost),
    };
  };

  const getEventColor = (status, isHost) => {
    const colors = {
      Going: "bg-green-500",
      Cancelled: "bg-red-500",
      Postponed: "bg-yellow-500",
    };

    if (isHost) return "bg-purple-500";

    return colors[status] || "bg-gray-500";
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex justify-center items-center">
      <div className="w-full max-w-xl">
        <h2 className="text-4xl font-bold mb-4 font-serif">My Events</h2>
        <p className="mb-6 font-sans text-sm italic">
          Here's a list of events you've registered for.
        </p>

        {loading && events.length === 0 ? (
          <div className="text-center text-xl font-sans italic">
            Loading events...
          </div>
        ) : !user ? (
          <div className="text-center text-xl font-sans italic">
            Please log in to view your events.
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-xl font-sans italic">
            No events found for the user.
          </div>
        ) : (
          <>
            {events.map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-300 rounded-2xl p-4 mb-4 font-sans">
                <span className="text-sm font-serif">{event.name}</span>
                <div className="flex items-center ml-auto">
                  <span className="mr-2 text-sm text-center text-white">
                    {event.status}
                  </span>
                  <span
                    className={`btn w-3 h-3 rounded-full ml-2 ${event.color}`}></span>{" "}
                </div>
              </div>
            ))}

            {hasMore && (
              <button
                onClick={fetchMoreEvents}
                className="mt-4 bg-gray-700 text-white px-4 py-2 rounded">
                Load More
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewPage;
