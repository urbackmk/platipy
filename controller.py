from flask import Flask, render_template, request, redirect, flash, session, url_for
import model
import datetime

app = Flask(__name__)


@app.route("/comment/")
def show_comments():
    html_section = request.args.get("html_section")
    userId = get_user_id()
    section = model.session.query(model.Section).filter_by(html_section=html_section).first()
    favorite = None
    if section:
        favorite = model.session.query(model.Favorite).filter_by(user_id=userId, section_id=section.id).first()

    return render_template("comments.html", section=section, favorite=favorite, html_section=html_section)

# hardcoded user id to always be user 1 for now
@app.route("/comment/", methods=["POST"])
def make_comment():
    html_section = request.args.get("html_section")
    comment = request.form.get("comment")
    section = get_section_object(html_section)

    new_comment = model.Comment(comment=comment, section_id=section.id, user_id=1)
    model.session.add(new_comment)
    model.session.commit()

    return redirect(url_for('show_comments', html_section=html_section))

@app.route("/favorite", methods=["POST"])
def set_favorite():
    """updates favorites table with section id and user id 
    and updates section table with number of favorites"""

    html_section= request.form.get("html_section")
    section = get_section_object(html_section)
    user_id = get_user_id()
    favorited_status = request.form.get("favorited_status")

    if favorited_status == "false":
        new_favorite = model.Favorite(section_id=section.id, user_id=user_id)
        section.num_favorites += 1
        model.session.add(new_favorite)
        model.session.commit()
    else:
        favorite = model.session.query(model.Favorite).filter_by(user_id=user_id, section_id=section.id).first()
        model.session.delete(favorite)
        section.num_favorites -= 1
        model.session.commit()

    return redirect(url_for('show_comments', html_section=html_section))

def get_section_object(html_section):
    """takes in html_section hash and sees if the section object exists.
    if it exists, return the object.  if it does not, create and return the object"""

    section = model.session.query(model.Section).filter_by(html_section=html_section).first()
    if section:
        return section
    else:
        new_section = model.Section(html_section=html_section)
        model.session.add(new_section)
        model.session.commit()
        return new_section

def get_user_id():
    userId = 1
    return userId

@app.template_filter("datefilter")
def datefilter(dt):
    return dt.strftime("%d %B %Y")

if __name__=="__main__":
    app.run(debug=True)

