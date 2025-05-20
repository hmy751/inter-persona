import { PageEvent } from './type';

export const GTMPageView = ({ page_location }: { page_location: string }) => {
  window.dataLayer.push({
    event: PageEvent.page_view,
    page_location,
  });
};

export const GTMPageExit = ({ page_location }: { page_location: string }) => {
  window.dataLayer.push({
    event: PageEvent.page_exit,
    page_location,
  });
};
