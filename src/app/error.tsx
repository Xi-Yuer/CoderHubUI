"use client";
import React from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <p>Try refreshing the page or contact the administrator.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
