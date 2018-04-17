/* eslint-disable no-param-reassign */
import debounce from 'debounce';
import minimatch from 'minimatch';
import isGlob from 'is-glob';
import { on } from 'delegated-events';

const FILTERS_TAB = 'gh-review-filter';
const URI_REGEX = /^#filter-files=(.*)$/;
const FILE_CHANGES_TAB_IDX = 2;
const DEBOUNCE_TIME = 800;

class Filter {
  constructor() {
    this.tabNav = document.querySelector('.tabnav-pr');
    this.diffBar = document.querySelector('.diffbar');
    this.files = Array.from(document.querySelectorAll('#files .file'))
      .map(element => ({
        element,
        text: element.querySelector('.file-info a').text,
      }));
    this.fileTexts = this.files.map(f => f.text);
    this.filterMenu = null;
    this.componentDidMount();
  }

  componentDidMount() {
    const tabs = this.tabNav.querySelectorAll('.tabnav-tab');
    if (tabs[FILE_CHANGES_TAB_IDX].classList.contains('selected')) {
      this.filterMenu = document.getElementById(FILTERS_TAB);

      if (!this.filterMenu) {
        this.createInput();
        this.filterMenu = document.getElementById(FILTERS_TAB);
      }

      this.bindInput();
      this.searchFromHash();
    }
  }

  createInput() {
    const div = document.createElement('div');
    div.classList.add('diffbar-item');
    div.insertAdjacentHTML('beforeend', `
      <div id="${FILTERS_TAB}" class="diffbar-item toc-select select-menu js-menu-container js-select-menu">
        <button type="button" class="btn-link muted-link select-menu-button js-menu-target">
          <strong>Filter files</strong>
        </button>
        <div class="select-menu-modal-holder">
          <div class="select-menu-modal js-menu-content">
            <div class="select-menu-header">
              <svg class="octicon octicon-x js-menu-close" role="img" aria-label="Close" viewBox="0 0 12 16" version="1.1" width="12" height="16"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path></svg>
              <span class="select-menu-title">Filter files using glob search</span>
            </div>
            <div class="js-select-menu-deferred-content">
              <div class="select-menu-filters">
                <div class="select-menu-text-filter">
                  <input id="${FILTERS_TAB}-input" type="text" class="form-control" placeholder="Glob search" autocomplete="off">
                </div>
              </div>
            </div>
            <div class="select-menu-loading-overlay anim-pulse">
              <svg height="32" class="octicon octicon-octoface" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M14.7 5.34c.13-.32.55-1.59-.13-3.31 0 0-1.05-.33-3.44 1.3-1-.28-2.07-.32-3.13-.32s-2.13.04-3.13.32c-2.39-1.64-3.44-1.3-3.44-1.3-.68 1.72-.26 2.99-.13 3.31C.49 6.21 0 7.33 0 8.69 0 13.84 3.33 15 7.98 15S16 13.84 16 8.69c0-1.36-.49-2.48-1.3-3.35zM8 14.02c-3.3 0-5.98-.15-5.98-3.35 0-.76.38-1.48 1.02-2.07 1.07-.98 2.9-.46 4.96-.46 2.07 0 3.88-.52 4.96.46.65.59 1.02 1.3 1.02 2.07 0 3.19-2.68 3.35-5.98 3.35zM5.49 9.01c-.66 0-1.2.8-1.2 1.78s.54 1.79 1.2 1.79c.66 0 1.2-.8 1.2-1.79s-.54-1.78-1.2-1.78zm5.02 0c-.66 0-1.2.79-1.2 1.78s.54 1.79 1.2 1.79c.66 0 1.2-.8 1.2-1.79s-.53-1.78-1.2-1.78z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    `);
    this.diffBar.insertBefore(div, this.diffBar.querySelector('.diffstat'));
  }

  bindInput() {
    on('click', `#${FILTERS_TAB} button`, () => {
      this.diffBar.querySelector('.form-control').focus();
    });

    on('keydown', `#${FILTERS_TAB}-input`, debounce((ui => function keydown() {
      ui.changeMenuLabel(this.value);
      window.location.hash = this.value ? `filter-files=${this.value}` : '';

      if (this.value) {
        ui.filterFiles(this.value);
      } else {
        ui.reset();
      }
    })(this)), DEBOUNCE_TIME);
  }

  changeMenuLabel(value) {
    if (this.filterMenu) {
      this.filterMenu.querySelector('button strong').innerHTML = value
        ? `Filtering files: ${value}`
        : 'Filter files';
    }
  }

  filterFiles(search) {
    const matches = isGlob(search)
      ? minimatch.match(this.fileTexts, search, {
        matchBase: true,
        nocase: true,
        dot: true,
      })
      : this.fileTexts.filter(t => t.includes(search));

    this.files.forEach(({ text, element }) => {
      const matched = matches.includes(text);
      element.style.display = matched ? 'block' : 'none';
    });
  }

  reset() {
    this.files.forEach(({ element }) => {
      element.style.display = 'block';
    });
  }

  searchFromHash() {
    const { hash } = window.location;

    if (URI_REGEX.test(hash)) {
      const text = URI_REGEX.exec(hash)[1];
      const input = document.getElementById(`${FILTERS_TAB}-input`);
      if (input && text) {
        input.value = text;
        this.changeMenuLabel(text);
        this.filterFiles(text);
      }
    }

    window.onhashchange = () => this.searchFromHash();
  }
}

export default Filter;
