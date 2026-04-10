"use client";

import * as React from "react";

console.log("[page.tsx]", "Page component loaded");

export default function HomePage() {
  console.log("[page.tsx]", "HomePage rendering");
  
  // Temporarily skip Dashboard - just render simple div
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>PS INOX - Loading Test</h1>
      <p>If you see this, the app is rendering!</p>
      <p>The issue is in the Dashboard component.</p>
      <button onClick={() => console.log("Button clicked")}>Test Button</button>
    </div>
  );
}
