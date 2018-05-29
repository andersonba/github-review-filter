/* eslint-disable no-param-reassign */

import BasePage from './base';

class CompareChangesPage extends BasePage {
  getTarget() {
    return document.querySelector('.toc-diff-stats');
  }

  insertMenu(menu) {
    menu.style.margin = '2px 0 0 10px';
    this.target.append(menu);
  }
}

export default CompareChangesPage;
