from flask import Flask, render_template, request, redirect, flash, session, url_for
import model
import datetime

app = Flask(__name__)

@app.route("/<sectionid>")
def showcomments(sectionid):
    section_comments = model.session.query(model.Comment).filter_by(section_id=sectionid).all()
    return render_template("comments.html", section_comments=section_comments)

# hardcoded user id to always be user 1 for now
@app.route("/<sectionid>", methods=["POST"])
def makecomment(sectionid):
    comment = request.form.get("comment")
    new_comment = model.Comment(comment=comment, section_id=sectionid, user_id=1)
    model.session.add(new_comment)
    model.session.commit()
    return redirect(url_for('showcomments', sectionid=sectionid))

@app.template_filter("datefilter")
def datefilter(dt):
    return dt.strftime("%d %B %Y")

if __name__=="__main__":
    app.run(debug=True)

