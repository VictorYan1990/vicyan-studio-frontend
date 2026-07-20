import React from 'react';
import './Experience.css';

interface Role {
  title: string;
  period: string;
  summary: string;
}

interface Position {
  company: string;
  location: string;
  range: string;
  roles: Role[];
}

const positions: Position[] = [
  {
    company: 'BlackRock Inc., Aladdin Wealth Technology',
    location: 'New York, NY',
    range: '2022 — NOW',
    roles: [
      {
        title: 'Senior Engineer II / Tech Lead (Vice President)',
        period: 'Jan 2025 – Present',
        summary:
          'Tech lead for the Client Delivery Experience (CDX) team, driving backend service and platform infrastructure for BlackRock’s multi-tenant wealth-management business.',
      },
      {
        title: 'Senior Engineer I (Vice President)',
        period: 'Oct 2022 – Dec 2024',
        summary:
          'Led the design and rollout of a platform-level workflow automation framework and data contract / validation services used across multi-tenant environments.',
      },
    ],
  },
  {
    company: 'Bank of America Corp.',
    location: 'Jersey City, NJ',
    range: '2021 — 2022',
    roles: [
      {
        title: 'Quantitative & Analytics Platform Engineer, AMGQS',
        period: 'Feb 2021 – Oct 2022',
        summary:
          'Built high-performance Python and Spark-based analytics systems supporting CCAR and CECL workflows over a $500B+ mortgage portfolio, and delivered a web-based analytics interface for interactive model validation, diagnostics, and scenario exploration.',
      },
    ],
  },
  {
    company: 'Radian Group Inc.',
    location: 'Philadelphia, PA',
    range: '2016 — 2021',
    roles: [
      {
        title: 'Credit Modeler, Quantitative Engineering & Risk Platform',
        period: 'Feb 2016 – Feb 2021',
        summary:
          'Developed a firm-wide risk analytics and forecasting engine supporting underwriting, pricing, and capital planning for a $200B+ mortgage insurance portfolio, productionizing quantitative credit models into distributed AWS workflows.',
      },
    ],
  },
];

const education = [
  {
    school: 'University of Maryland, College Park',
    degree: 'M.S. in Quantitative Finance',
    date: 'Dec 2015',
  },
  {
    school: 'Central South University, Changsha, China',
    degree: 'B.S. in Economics and Mathematics',
    date: 'Jun 2013',
  },
];

const Experience: React.FC = () => {
  return (
    <div className="experience-page">
      <h1>Experience</h1>
      <ol className="xp-list">
        {positions.map((position) => (
          <li key={position.company} className="xp-card">
            <span className="xp-range">{position.range}</span>
            <div className="xp-detail">
              <h3 className="xp-company">
                {position.company}
                <span className="xp-location"> · {position.location}</span>
              </h3>
              {position.roles.map((role) => (
                <div key={role.title} className="xp-role">
                  <p className="xp-title">{role.title}</p>
                  <p className="xp-period">{role.period}</p>
                  <p className="xp-summary">{role.summary}</p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <h2 className="edu-heading">Education</h2>
      <ul className="edu-list">
        {education.map((entry) => (
          <li key={entry.school} className="edu-item">
            <span className="edu-school">{entry.school}</span>
            <span className="edu-degree">{entry.degree}</span>
            <span className="edu-date">{entry.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Experience;
