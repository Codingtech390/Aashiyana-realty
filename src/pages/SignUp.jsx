import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import OAuth from "../components/OAuth";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  // On Input Field Change
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle Form Submit
  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredentials.user;

      // Remove the password field before saving it to firebase db.
      const formDataCopy = { ...formData };
      delete formDataCopy.password;

      // get the timestamp before saving it to firebase db
      formDataCopy.timestamp = serverTimestamp();

      // Add the user to db and navigate it to the homepage.
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("You have successfully signed up!");
      navigate("/");
    } catch (error) {
      toast.error("Oops! Something went wrong during registration");
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto ">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?q=80&w=1367&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Full name"
              className="mb-6 w-full px-4 py-2 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />

            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              className="mb-6 w-full px-4 py-2 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  onClick={() => setShowPassword((prevState) => !prevState)}
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                />
              ) : (
                <AiFillEye
                  onClick={() => setShowPassword((prevState) => !prevState)}
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                />
              )}
            </div>
            {/* Don't have an account? */}
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-md">
              <p className="mb-6 ">
                Have an account?
                <Link
                  to="/sign-in"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                >
                  Sign In
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Sign Up
            </button>
            <div className="flex my-4 items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
