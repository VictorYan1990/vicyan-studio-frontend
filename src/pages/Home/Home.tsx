import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div style={{ padding: '32px 24px', maxWidth: 720, margin: '0 auto' }}>
      <Title level={2}>Welcome</Title>
      <Paragraph>VicYan Studio — personal site.</Paragraph>
    </div>
  );
};

export default Home;
