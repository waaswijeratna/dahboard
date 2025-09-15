/* eslint-disable @next/next/no-img-element */
"use client";
import LoginForm from "@/components/LoginForm";
import Lottie from "react-lottie-player";
import relaxingGirl from "@/../../public/lottieFiles/relaxingGirl.json";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-[100vh] bg-white overflow-auto scrollbar-hide">
      <div className="bg-white shadow-lg shadow-secondary/40 rounded-2xl flex w-[90%] overflow-hidden">
        {/* Left Section (Login) */}
        <div className="w-1/2 px-8 pb-2 pt-2 flex flex-col justify-center">
          <LoginForm />
        </div>

        {/* Right Section (Lottie Animation) */}
        <div className="w-1/2 flex flex-col items-center justify-center ">
          <div className="flex items-center mb-4">
            <img src="images/logo.png" alt="logo" className="w-8 h-8 rounded-full object-cover mr-4" />
            <h3 className="text-bold text-2xl">Arthaze Moderators</h3>
          </div>
          <Lottie loop animationData={relaxingGirl} play className="" />
        </div>
      </div>
    </div>
  );
}
