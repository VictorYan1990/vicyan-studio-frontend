import React from 'react';
import ReactMarkdown from 'react-markdown';
import profileMarkdown from './Profile.md';
import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="profile-markdown">
        <ReactMarkdown>{profileMarkdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Profile;
