import PullRequest from './pull-request';
import CompareChanges from './compare-changes';

export const urlMapping = {
  '/pull/': PullRequest,
  '/compare/': CompareChanges,
};

export const getPage = (url) => {
  const [urlKey] = Object.keys(urlMapping).filter(pattern =>
    new RegExp(pattern).test(url));

  if (!urlKey) {
    return null;
  }

  const Page = urlMapping[urlKey];
  return new Page();
};
