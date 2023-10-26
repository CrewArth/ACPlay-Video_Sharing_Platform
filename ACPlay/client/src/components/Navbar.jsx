import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  VideoCallOutlined,
  AccountCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import Upload from "./Upload";
import { signOut } from "../redux/userSlice";

const Navbar = ({ setShowExtendedMenu }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const [toggleUpload, setToggleUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const handleChange = async (e) => {
    navigate(`/search?sr=${e.target.value}`);
  };
  console.log(showSearch);
  return (
    <>
      <div className="main h-16 bg-blue-500 gap-40 flex">
        <div className="logo px-4 hover:bg-[#0d68fc] rounded hover:border border-orange-500">
          <a href="http://localhost:3000/">
            <img className="h-16" src={logo} alt="" />
          </a>
        </div>
        <div className="search_bar w-[400px] h-16 ">
          <div className={showSearch ? "sear  ch" : ""}>
            <input
              className="input h-12 p-4 w-[400px] mt-2 rounded-3xl text-gray-800 placeholder:text-orange-500 outline-orange-500"
              placeholder="Search"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="bg-blue-500 ml-auto">
          {!currentUser ? (
            <div className="hover:bg-[#0d68fc] rounded mr-6 mt-2 hover:translate-1 hover:border hover:border-orange-500">
              <Link to="signin" style={{ textDecoration: "none" }}>
                <button className="button text-white text-xl p-2">
                  <AccountCircleOutlinedIcon fontSize="large" />
                  SIGN IN
                </button>
              </Link>
            </div>
          ) : (
            <div className="user h-full flex">
              <VideoCallOutlined
                fontSize="large"
                onClick={() => setToggleUpload(true)}
                className="btn cursor-pointer text-white mr-5 my-3"
              />
              <LogoutOutlined
                className="btn cursor-pointer text-white mr-5 my-4"
                onClick={() => dispatch(signOut())}
              />
              {currentUser?.img ? (
                <img
                  src={currentUser.img}
                  onClick={() => navigate(`/profile/${currentUser?._id}`)}
                  className="btn cursor-pointer text-white mr-5 rounded-full  my-3"
                />
              ) : (
                <AccountCircleOutlined
                  fontSize="large"
                  onClick={() => navigate(`/profile/${currentUser?._id}`)}
                  className="btn mr-2 cursor-pointer text-white my-3"
                />
              )}
              <span className="mr-5 text-white text-lg my-4">
                {currentUser.username}
              </span>
            </div>
          )}
        </div>
      </div>
      {toggleUpload && <Upload setToggleUpload={setToggleUpload} />}
    </>
  );
};

export default Navbar;
