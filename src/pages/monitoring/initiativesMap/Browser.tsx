import React from "react";

interface BrowserProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function Browser({ title, subtitle, children }: BrowserProps) {
  return (
    <div className="browser-container">
      <h2 className="browser-title">
        {title}
        <span>{subtitle}</span>
      </h2>
      <div className="browser-content">{children}</div>
    </div>
  );
}
