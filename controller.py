from flask import Flask, render_template, redirect, flash, session, url_for

app = Flask(__name__)

@app.route("/<sectionid>")
def showcomments(sectionid):
    return "You're in this section: %s" % sectionid

if __name__=="__main__":
    app.run(debug=True)

