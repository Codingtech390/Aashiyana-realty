import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  // Handle On Logout

  function handleOnLogout() {
    auth.signOut();
    navigate("/");
  }

  // Handle Details Change

  function handleDetailsChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // Apply details change and submit the form

  async function onSubmit(e) {
    // Add the change to the db
    try {
      if (auth.currentUser.displayName !== name) {
        // Update the display name in fireBase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update the name in the fireStore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      // Send a toast success
      toast.success("Profile details updated successfully");
    } catch (error) {
      toast.error("Oops! Couldn't update the profile details");
    }
  }

  // Fetch the listings
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");

      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="flex max-w-6xl mx-auto justify-center items-center flex-col">
        <h1 className="text-2xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 ">
          <form>
            {/* Name Input */}
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={handleDetailsChange}
              className={`w-full px-4 py-2 text-md mb-6 text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            {/* Email Input */}
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 text-md mb-6 text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-md mb-6">
              <p className="flex items-center">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply Changes" : "Edit"}
                </span>
              </p>
              <p
                onClick={handleOnLogout}
                className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer"
              >
                Sign Out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition ease-in-out duration-200 hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center "
            >
              <FcHome className="mr-2 text-3xl bg-indigo-200 rounded-full p-1 border-2 " />
              Sell Or Rent Your Home
            </Link>
          </button>
        </div>
      </section>

      {/* Display Listing */}
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">My Listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
