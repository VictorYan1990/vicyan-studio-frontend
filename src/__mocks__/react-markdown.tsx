import React from 'react';

// Test stub for react-markdown (mapped in craco.config.js). The real
// package is ESM-only, which Jest 27 can't parse; tests only need the
// markdown source to land in the DOM, not actual markdown rendering.
const ReactMarkdown: React.FC<{ children: string }> = ({ children }) => (
  <div data-testid="markdown">{children}</div>
);

export default ReactMarkdown;
