# interactive_microlensing

## Introduction

Development of educational interactive microlensing web app using HTML5 canvas

### Django Website Installation Instructions

## Install NPM

Install NPM, the Node Package Manager.

NPM is packaged with NodeJS: https://nodejs.org/

To install NPM using a package manager, see instructions here: https://nodejs.org/en/download/package-manager/

For example, on Ubuntu/Debian-based distributions, do:
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Navigate to your workspace in the command line, and clone this repository:
```
git clone https://github.com/shanencross/interactive_microlensing.git
```

Switch to the binary branch:
```
git checkout binary
```

In the top folder of the repo, install the dependencies with NPM:
```
npm install
```

## Building project

Note: this assumes you are using a Bash shell.

To build the JavaScript bundle for distribution, use run the build script:
```
npm run build
```
This executes the "build" script in package.json, which has Browserify build
the bundle and output it to a file.

The bundle will be located at build/PSBL_bundle.js.

The Django-compatible HTML page is located at:
html/django_pages/tools_PSBL_microlensing_event.html
