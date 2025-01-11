import React from "react";

export default function Loading() {
  return (
    <div>
      <div className="flex justify-center items-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path className="opacity-75" fill="currentColor"></path>
        </svg>
        <span className="text-white">Loading...</span>
      </div>
    </div>
  );
}
