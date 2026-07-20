import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <section className="hero">
      <h1 className="hero-name">Victor Yan</h1>
      <p className="hero-role">
        I build data platforms for finance.
      </p>
      <p className="hero-body">
        Ten years of backend and data-platform engineering across wealth and
        risk management — currently a tech lead on BlackRock&rsquo;s Aladdin
        Wealth platform, after an earlier life as a quant.
      </p>
      <div className="hero-links">
        <Link to="/experience" className="hero-link">
          See experience →
        </Link>
        <Link to="/about" className="hero-link hero-link-muted">
          More about me
        </Link>
      </div>
    </section>
  );
};

export default Home;
