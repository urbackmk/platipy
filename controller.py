from flask import Flask, render_template, request, redirect, flash, session, url_for
import model
import datetime

app = Flask(__name__)

# section.comment is a list of object comments
@app.route("/<htmlsection>")
def show_comments(htmlsection):
    section = model.session.query(model.Section).filter_by(html_section=htmlsection).first()
    section_comments = []
    if section:
        section_comments = section.comment
    return render_template("comments.html", section_comments=section_comments)

# hardcoded user id to always be user 1 and site_id 1 for now
@app.route("/<htmlsection>", methods=["POST"])
def make_comment(htmlsection):
    comment = request.form.get("comment")
    section = model.session.query(model.Section).filter_by(html_section=htmlsection).first()
    if section:
        new_comment = model.Comment(comment=comment, section_id=section.id, user_id=1)
        model.session.add(new_comment)
        model.session.commit()
    else:
        new_section = model.Section(html_section=htmlsection, site_id=1)
        model.session.add(new_section)
        model.session.commit()

        section = model.session.query(model.Section).filter_by(html_section=htmlsection).first()
        new_comment = model.Comment(comment=comment, section_id=section.id, user_id=1)
        model.session.add(new_comment)
        model.session.commit()

    return redirect(url_for('show_comments', htmlsection=htmlsection))


# updates favorites table with section id and user id
# updates section table with number of favorites for the section
# @app.route("/favorite/<htmlsection>/<userid>", methods=["POST"])
# def set_favorite(htmlsection, userid):
#     section_id = model.session.query(model.Session).filter_by(html_section=htmlsection)

#     new_favorite = model.Favorite(section_id=section_id, user_id=userid)

@app.template_filter("datefilter")
def datefilter(dt):
    return dt.strftime("%d %B %Y")

if __name__=="__main__":
    app.run(debug=True)

