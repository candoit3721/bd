"use client";

import React from 'react';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title = "Sophia's 10th Birthday!",
  subtitle = "Join us for a fun celebration!"
}) => {
  return (
    <div className="header rounded-t-lg relative overflow-hidden">
      <div className="party-emoji left">🎉</div>
      <div className="party-emoji right">🎈</div>
      <h1 className="font-fredoka">{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
};

export default PageHeader;
