from flask import Flask, render_template, request, redirect, flash, session, url_for
import model
import datetime

app = Flask(__name__)

@app.route("/<sectionid>")
def show_comments(sectionid):
    section_comments = model.session.query(model.Comment).filter_by(section_id=sectionid).all()
    return render_template("comments.html", section_comments=section_comments)

# hardcoded user id to always be user 1 for now
@app.route("/<sectionid>", methods=["POST"])
def make_comment(sectionid):
    comment = request.form.get("comment")
    new_comment = model.Comment(comment=comment, section_id=sectionid, user_id=1)
    model.session.add(new_comment)
    model.session.commit()
    return redirect(url_for('show_comments', sectionid=sectionid))


# updates favorites table with section id and user id
# updates section table with number of favorites for the section
@app.route("/favorite/<sectionid>/<userid>", methods=["POST"])
def set_favorite(sectionid, userid):
    pass

@app.template_filter("datefilter")
def datefilter(dt):
    return dt.strftime("%d %B %Y")

if __name__=="__main__":
    app.run(debug=True)

