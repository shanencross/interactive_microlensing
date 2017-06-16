# interactive_microlensing

## Introduction

Development of educational interactive microlensing web app using HTML5 canvas

## Django Website Installation Instructions

### Install NPM, git repo, and NPM dependencies

* Install NPM, the Node Package Manager.

  NPM is packaged with NodeJS. You can install NodeJS with NPM directly from:
  https://nodejs.org/

  Or, you can install NodeJS/NPM using a package manager:
  https://nodejs.org/en/download/package-manager/

  For example, on Ubuntu/Debian-based distributions, you can do:
  ```
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

* Navigate to your workspace in the command line, and clone this repository:
  ```
  git clone https://github.com/shanencross/interactive_microlensing.git
  ```

* Navigate your console to the top folder of the repo:
  ```
  cd interactive_microlensing
  ```

* Switch to the binary branch:
  ```
  git checkout binary
  ```

* In the top folder of the repo, install the dependencies with NPM:
  ```
  npm install
  ```

### Building project

Note: This assumes you are using a Bash shell. Otherwise, the custom NPM
scripts won't work.

To build the JavaScript bundle for distribution, run the build script:
```
npm run build
```
This executes the "build" script in package.json, which makes Browserify build
the bundle and output it to a file.

The bundle will be located at:
build/PSBL_bundle.js.

The Django-compatible HTML page is located at:
html/django_pages/tools_PSBL_microlensing_event.html

You can copy these into the Django website project.

## Updating project with latest version after installation

After installing NPM and cloning the git repo, follow these steps to download
the newest version whenever the repo is updated.

* First, make sure you're on the binary branch:
  ```
  git checkout binary
  ```

* Pull the repo:
  ```
  git pull
  ```

* Install NPM dependencies again (since dependencies may have changed):
  ```
  npm install
  ```

* Run the NPM build script:
  ```
  npm run build
  ```
  ...which will generate generate the build/PSBL_bundle.js file.

## Other NPM scripts

There are some other useful scripts included in the package.json file.

Note: These scripts will only work with a Bash shell.

* Build with source maps, so that command line output traces the location of
  events back to their location in the src/ files, rather than their location
  in the Browserify bundle:
  ```
  npm run build-debug
  ```

* Run Watchify, which continually builds the Browserify bundle whenever the
  src/ code is modified:
  ```
  npm run watch
  ```
* Run Watchify with source maps:
  ```
  npm run watch-debug
  ```
* Build the in-line JSDoc documentation:
  ```
  npm run build-doc
  ```
  ...which outputs to the /documentation.md file.
