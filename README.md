Platipy: making documentation more useful
-----------------------------------------

Platipy is a chrome extension that enables developers to annotate and clarify confusing documentation.

Platipy works with all documentation hosted by Read the Docs and enables developers to insert comments and example code directly into a portion of the documentation that could use clarification.  Users can favorite sections of documentation and pose questions to other users. These comments and questions can then be seen by all future developers who come to a piece of documentation looking for answers or implementation assistance.

Platipy is written in Python, Javascript, HTML and CSS.  It uses Flask as a web framework and Jinja as a template engine.  Github's OAuth API enables user authentication.  The Pygments python library is used for syntax highlighting.  The backend uses SQLAlchemy to interface with a Postgres database hosted on Heroku.

Directions for installing the extension can be found here: www.platipy.com

###Extension files

**manifest.json** contains information about the extension.  Platipy is a page-action extension.  The web pages that it acts on are specified in the **content scripts** section.  Because the extension makes cross-domain ajax calls from many websites to my server, I list all websites under **permissions**.

**myscript.js** is the main content script for the extension.  Here, I parse the html of a documentation page and insert information icons into certain types of sections.  Each info icon loads an iframe which points to the **comment** handler on my server when clicked.

A unique id is created for each section on the page which loads an iframe.  The id consists of the url for the page, the id of the nearest parent div with the class "section" (provided by ReadtheDocs), and a hash of the section text.  I use the md5 cryptographic hash function.

**event.js** specifies which web pages should display the Platipy icon in the URL bar.

I use the jquery plugin **iframeResizer** for cross-domain iframe resizing, which is triggered when the iframe changes size.

###Web Framework

**controller.py** uses Flask handlers to route requests to the server.  I use the **Pygments** library to implement syntax highlighting of user's comments which contain example code.  All comments are filtered through two custom Jinja filters (extract_code and detect_url_and_make_link), which filter out example code and urls.  All comments are html escaped using cgi.escape.

I use Github's OAuth API to allow users to sign in with github.  All comments are tagged with a link to the user's github profile, enforcing a small degree of user responsibility to provide useful comments.

###Database

SQLAlchemy interfaces with a Heroku Postgres database.  I store each user's github name and comments.  Each comment and favorite is identified by their unique string (html_section) created in myscript.js.










