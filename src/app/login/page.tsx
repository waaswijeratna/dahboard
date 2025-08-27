"use client";
import LoginForm from "@/components/LoginForm";
import Lottie from "react-lottie-player";
import relaxingGirl from "@/../../public/lottieFiles/relaxingGirl.json";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-[100vh] bg-fourth overflow-auto scrollbar-hide">
      <div className="bg-primary shadow-lg shadow-secondary/40 rounded-2xl flex w-[90%] overflow-hidden">
        {/* Left Section (Login) */}
        <div className="w-1/2 px-8 pb-2 pt-2 flex flex-col justify-center">
          <LoginForm />
        </div>

        {/* Right Section (Lottie Animation) */}
        <div className="w-1/2 flex items-center justify-center bg-fourth/90">
          <Lottie loop animationData={relaxingGirl} play className="" />
        </div>
      </div>
    </div>
  );
}
