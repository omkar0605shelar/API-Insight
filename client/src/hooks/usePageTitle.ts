import { useEffect } from 'react';

const usePageTitle = (title: string) => {
  useEffect(() => {
    const defaultTitle = 'API Insight';
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;
  }, [title]);
};

export default usePageTitle;
