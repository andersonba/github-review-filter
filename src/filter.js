/* eslint-disable no-param-reassign */
import debounce from 'debounce';
import minimatch from 'minimatch';
import isGlob from 'is-glob';
import { on } from 'delegated-events';

import { getPage } from './pages';

const URI_REGEX = /^#filter-files=(.*)$/;
const DEBOUNCE_TIME = 800;

class Filter {
  constructor() {
    this.page = getPage(window.location.href);

    this.total = null;
    this.files = [];
    this.filesTexts = [];

    if (this.page) {
      this.init();
    }
  }

  init() {
    this.mountFiles();
    this.bindDOMObserver();
    this.page.createMenu();
    this.bindSearchInput();
    this.searchFromHash();
  }

  mountFiles() {
    this.files = Array.from(document.querySelectorAll('#files .file'))
      .map(element => ({
        element,
        text: element.querySelector('.file-info a').text,
      }));
    this.fileTexts = this.files.map(f => f.text);
  }

  bindDOMObserver() {
    document.addEventListener('DOMNodeInserted', ({ target }) => {
      if (target.classList && target.classList.contains('file')) {
        this.mountFiles();
        this.searchFromHash();
      }
    }, false);
  }

  bindSearchInput() {
    on('click', `#${this.page.menuId} button`, () => {
      this.page.target.querySelector('.form-control').focus();
    });

    on('keydown', `#${this.page.menuId}-input`, debounce((ui => function keydown() {
      if (!this.value) {
        ui.resetSearch();
      }
      window.location.hash = this.value ? `filter-files=${this.value}` : '';
    })(this)), DEBOUNCE_TIME);
  }

  changeMenuLabel(search) {
    const { total } = this;
    const counter = total !== null
      ? ` <span class="Counter Counter--gray-light">${total}</span>`
      : '';

    this.page.menu.querySelector('button strong').innerHTML = (search
      ? `Filtering files: ${search}`
      : 'Filter files') + counter;
  }

  searchFiles(search) {
    const matches = isGlob(search)
      ? minimatch.match(this.fileTexts, search, {
        matchBase: true,
        nocase: true,
        dot: true,
      })
      : this.fileTexts.filter(t => t.includes(search));

    let total = 0;
    this.files.forEach(({ text, element }) => {
      const matched = matches.includes(text);
      element.style.display = matched ? 'block' : 'none';
      if (matched) {
        total += 1;
      }
    });
    this.total = total;
  }

  resetSearch() {
    this.total = null;
    this.changeMenuLabel(null);
    this.files.forEach(({ element }) => {
      element.style.display = 'block';
    });
  }

  searchFromHash() {
    const { hash } = window.location;

    if (URI_REGEX.test(hash)) {
      const text = decodeURIComponent(URI_REGEX.exec(hash)[1]).trim();
      const input = document.getElementById(`${this.page.menuId}-input`);
      if (text) {
        input.value = text;
        this.searchFiles(text);
        this.changeMenuLabel(text);
      } else {
        this.resetSearch();
      }
    }

    window.onhashchange = () => this.searchFromHash();
  }
}

export default Filter;
