import React from 'react';
import usePageTitle from '../hooks/usePageTitle';

interface PageWrapperProps {
  title: string;
  children: React.ReactElement;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  usePageTitle(title);
  return children;
};

export default PageWrapper;
