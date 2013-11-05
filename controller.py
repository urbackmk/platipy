from flask import Flask, render_template, redirect, flash, session, url_for
import model

app = Flask(__name__)

@app.route("/<sectionid>")
def showcomments(sectionid):
    section_comments = model.session.query(model.Comment).filter_by(section_id=sectionid).all()
    return render_template("comments.html", section_comments=section_comments)
#     return "You're in this section: %s" % sectionid

if __name__=="__main__":
    app.run(debug=True)

