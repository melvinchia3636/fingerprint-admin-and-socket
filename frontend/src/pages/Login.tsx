import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

function Login() {
  return (
    <div className="flex items-center justify-center flex-col gap-24 flex-1">
      <div className="flex items-center justify-center flex-col gap-2">
        <h1 className="text-4xl font-bold">学生资料库</h1>
        <p className="text-lg text-center uppercase tracking-widest font-medium">
          Student Info Database
        </p>
      </div>
      <button
        onClick={() => {}}
        className="bg-blue-400 hover:bg-blue-500 transition-all text-zinc-900 font-medium px-6 py-4 flex items-center gap-4 rounded-md uppercase tracking-widest"
      >
        <Icon icon="uil:google" className="w-5 h-5" />
        <div className="flex flex-col text-left">
          <span>使用Google账号登录</span>
          <span className="text-sm">Login with Google</span>
        </div>
      </button>
    </div>
  );
}

export default Login;
