import React from 'react';
import ReactMarkdown from 'react-markdown';
import experienceMarkdown from './Experience.md';
import './Experience.css';

const Experience: React.FC = () => {
  return (
    <div className="experience-page">
      <div className="experience-markdown">
        <ReactMarkdown>{experienceMarkdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Experience;
