import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { loginUser, googleAuth, registerUser } from "../redux/userSlice";
import { provider, auth } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import ClipLoader from "react-spinners/ClipLoader";
import google from "../img/google.png";
import "../../src/index.css";

const SignIn = () => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isError, setisError] = useState("");
  const [loginLoading, setloginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(undefined);

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignIn = async (e) => {
    e.preventDefault();

    setloginLoading(true);
    const { username, ...loginDetails } = userDetails;
    const res = await dispatch(loginUser(loginDetails));
    if (res.type === "auth/login/rejected") setisError("signInErr");
    setloginLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setSignUpLoading(true);
    const res = await dispatch(registerUser(userDetails));
    if (res.type === "auth/register/rejected") setisError("signUpErr");
    setSignUpLoading(false);
  };

  const googleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const authDetails = {
          username: res.user.displayName,
          email: res.user.email,
          img: res.user.photoURL,
        };
        dispatch(googleAuth(authDetails));
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="flex flex-col items-center justify-center height-screen overflow-hidden bg-[#919191] text-white">
      <div className="bg-white flex text-black p-8 rounded-lg w-1/2 ">
        <div className="w-1/2 mx-auto">
          <h1 className="text-3xl font-semibold">Sign in</h1>
          <h2 className="text-xl font-light">to ACPLAY</h2>

          <input
            className="border-2 border-blue-500  rounded p-2 mt-4 w-3/4"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className="border-2 border-blue-500  rounded p-2 mt-4 w-3/4"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          {isError === "signInErr" && (
            <p className="text-red-500 text-sm">Something went wrong...</p>
          )}
          <button
            className={`bg-blue-500 text-white rounded p-2 mt-4 w-1/2 m-auto ${
              loginLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={handleSignIn}
            disabled={loginLoading}
          >
            {loginLoading ? "Loading..." : "Sign In"}
          </button>
        </div>

        <div className="w-1/2 mx-auto">
          <h1 className="text-3xl font-semibold ">Sign Up</h1>
          <h2 className="text-xl font-light">to ACPLAY</h2>
          <input
            className="border-2 border-blue-500  rounded p-2 mt-4 w-3/4"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            className="border-2 border-blue-500  rounded p-2 mt-4 w-3/4"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className="border-2 border-blue-500  rounded p-2 mt-4 w-3/4"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          {isError === "signUpErr" && (
            <p className="text-red-500 text-sm">Something went wrong...</p>
          )}
          <button
            className={`bg-blue-500 text-white rounded p-2 mt-4 w-1/2 ${
              signUpLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={handleSignUp}
            disabled={signUpLoading}
          >
            {signUpLoading ? "Loading..." : "Sign Up"}
          </button>

          <div>
            <button
              className="bg-blue-500 text-white rounded p-2 mt-4 w-1/2 cursor-pointer"
              onClick={googleSignIn}
            >
              Sign in with Google
            </button>
            <img
              className="h-7 relative bottom-[35px] left-[2.5px]"
              src={google}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        ACPLAY.COM
        <div className="ml-8"></div>
      </div>
    </div>
  );
};

export default SignIn;
