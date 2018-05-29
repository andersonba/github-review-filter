import BasePage from './base';
import { findElementByText } from '../utils';

const FILES_CHANGED_TABNAME = 'Files changed';

class PullRequestPage extends BasePage {
  getTarget() {
    const diffbar = document.querySelector('.diffbar');
    const tabs = findElementByText('.tabnav-pr .tabnav-tab', FILES_CHANGED_TABNAME);

    if (!tabs.length || !tabs[0].classList.contains('selected')) {
      return null;
    }

    return diffbar;
  }

  insertMenu(menu) {
    this.target.insertBefore(menu, document.querySelector('.diffstat'));
  }
}

export default PullRequestPage;
