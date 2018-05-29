# GitHub Review Filter - Chrome Extension

Speed up how you review PRs filtering files based on glob pattern.

[![Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/github-review-filter/gnpcfigiidmljgiidkhmmcgbfkolnacg)

## Features

- **Split your code review into parts based on:**
  - Components (eg: `**/components/Header/**`)
  - Without tests (eg: `!**/__tests__/**`)
  - File types (eg: `*.js`)
  - No jest snapshot (eg: `!*.snapshot`)

- **Supported pages:**
  - Pull requests (`github.com/org/repo/pull/*/files`)
  - Compare changes (`github.com/org/repo/compare/*`)

- **Share the filters using links**
  - `github.com/org/repo/pull/1/files#filter-files=PATTERN`

## Preview

#### Filter files in PR review
![Filter from PR](resources/filter-from-pr.gif)

#### Share filters using links
![Share links](resources/share-links.gif)

## Credits
Inspered by [siggysamson's project](https://github.com/siggysamson/pr-file-filter-for-github)
