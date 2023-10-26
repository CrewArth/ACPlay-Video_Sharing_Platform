import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import app from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Upload = ({ setToggleUpload }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [tags, setTags] = useState([]);
  const [inputs, setInputs] = useState({
    userId: user?._id,
  });

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "img"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.floor(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "video");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "img");
  }, [img]);

  const handleUpload = async (e) => {
    console.log("working...");
    e.preventDefault();
    try {
      const res = await axios.post(`/video`, { ...inputs, tags });
      console.log(res);
      setToggleUpload(false);
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full h-screen absolute top-0 left-0 bg-white flex items-center justify-center z-50 ">
        <div className="w-[600px] h-[700px] bg-blue-500 text-black p-5 flex flex-col gap-5 relative z-40 rounded-3xl">
          <div
            className="absolute text-3xl top-[10px] font-bolds right-[20px] cursor-pointer"
            onClick={() => setToggleUpload(false)}
          >
            X
          </div>
          <h1 className="text-start text-2xl">Create a New Video</h1>
          <label className="text-xl">Video:</label>
          {videoPerc > 0 ? (
            "Uploading" + videoPerc + "%"
          ) : (
            <input
              className="border border-black text-black placeholder:text-black rounded-[3px] h-20 py-3 px-5 bg-transparent  z-50"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          )}

          <input
            className="border border-black text-black rounded-[3px] placeholder:text-black p-5 bg-transparent z-50"
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
          />
          <textarea
            className="border border-black rounded-[3px] placeholder:text-black p-5 bg-transparent"
            placeholder="Description"
            name="desc"
            rows={5}
            onChange={handleChange}
          />
          <input
            className="border border-black text-black rounded-[3px] placeholder:text-black p-5 bg-transparent z-50"
            type="text"
            placeholder="Separate the tags with commas."
            onChange={handleTags}
          />
          <label className="text-xl">Image:</label>
          {imgPerc > 0 ? (
            "Uploading " + imgPerc + "%"
          ) : (
            <input
              className="border border-black text-black placeholder:text-black rounded-[3px] h-20 py-3 px-5 bg-transparent  z-50"
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          )}
          <button
            className="rounded-[3px] border-none p=[10px 20px] h-16 font-medium cursor-pointer bg-red-500 text-black z-50"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </>
  );
};

export default Upload;
