"use client";

import { useState } from "react";

interface DescriptionProps {
  text: string;
  length: number;
  className?: string;
}

export function Description({ text, length, className }: DescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= length) {
    return <p className={`text-sm text-gray-600 dark:text-gray-400 ${className || ''}`}>{text}</p>;
  }

  return (
    <div>
      <p className={`text-sm text-gray-600 dark:text-gray-400 ${className || ''}`}>
        {isExpanded ? text : `${text.slice(0, length)} ...`}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isExpanded ? "View less" : "View more"}
        </button>
      </p>
    </div>
  );
}
