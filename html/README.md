HTML files in this directory are used for testing the simulators
during development. You can test a simulator just by opening the HTML file
in a browser.

The subdirectory "django_pages" contain the final Django-compatible versions
of the simulator pages.

Each Django page:
* Has a Django header
* contains only the <body> of the corresponding html page
* Has a <script> tag that looks for the .js bundle in a different directory
  than the testing page does
* * Django page looks in /static/site/
* * testing page looks in ../build/

Changes made to the HTML files should be adapted to the
corresponding files in the django_pages subdirectory, with these differences.
