import React from "react";

interface DashboardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{title}</h1>
        <p className="dashboard-subtitle">{subtitle}</p>
      </div>
      <div className="dashboard-content">{children}</div>
    </div>
  );
};
