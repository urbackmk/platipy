from flask import Flask, render_template, request, redirect, flash, session, url_for
import model
import datetime

from requests_oauthlib import OAuth2Session
from flask.json import jsonify
import os
import config
import re
import cgi
import random
import pprint

from pygments import highlight
from pygments.lexers import PythonLexer, guess_lexer
from pygments.formatters import HtmlFormatter
from pygments.styles import get_style_by_name

import json

app = Flask(__name__)
app.debug = True

app.secret_key = os.environ.get("FLASK_SECRET_KEY", "something")

client_id = config.client_id
client_secret = config.client_secret
authorization_base_url = 'https://github.com/login/oauth/authorize'
token_url = 'https://github.com/login/oauth/access_token'

@app.route("/")
def landing_page():
    return render_template("landing_page.html")

# Call this when a user pushes a Sign In to Github button
@app.route("/authenticate")
def authenticate():
    """Step 1: User Authentication
    Redirect the user/resource owner to the OAuth provider
    using a URL with a few key OAuth parameters. """

    session["last_visited"] = request.args.get("html_section")
    github = OAuth2Session(client_id)
    authorization_url, state = github.authorization_url(authorization_base_url)

    # State is used to prevent CSRF, keep this for later
    session['oauth_state'] = state
    return redirect(authorization_url)

def obtain_access_token():
    """Use an authorization code to obtain an access token
     and store the access token in the browser session"""

    github = OAuth2Session(client_id, state=session['oauth_state'])
    token = github.fetch_token(
        token_url, client_secret=client_secret, authorization_response=request.url)

    # At this point you can fetch protected resources
    session['oauth_token'] = token

def fetch_github_name():
    """Access a protected resource"""
    github=OAuth2Session(client_id, token=session['oauth_token'])
    session['github_name'] = github.get('https://api.github.com/user').json()["login"]

    return session['github_name']

@app.route("/return_to_last")
def return_to_last():
    obtain_access_token()
    github_name = fetch_github_name()

    return redirect(session["last_visited"])

@app.route("/log_out")
def log_out():
    html_section=request.args.get("html_section")
    session.clear()
    return redirect(url_for("show_comments", html_section=html_section))

@app.route("/clear")
def clear():
    session.clear()
    return redirect("/comment")

@app.route("/comment")
def show_comments():
    html_section = request.args.get("html_section")
    segment_text = request.args.get("segmentText")

    print segment_text

    user_id = get_user_id()
    section = model.Section.from_html_section(html_section, segment_text)
    
    favorite = None
    if section:
        favorite = model.session.query(model.Favorite).filter_by(
            user_id=user_id, section_id=section.id).first()

    if session.get('oauth_state') and session.get('github_name'):
        github_name = session['github_name']
    elif session.get('oauth_state'):
        obtain_access_token()
        github_name = fetch_github_name()
    else:
        github_name = None

    return render_template(
        "comments.html",
        section=section,
        favorite=favorite,
        html_section=html_section,
        github_name=github_name
        )

@app.route("/comment", methods=["POST"])
def make_comment():
    assert_is_authenticated()
    html_section = request.args.get("html_section")
    comment = request.form.get("comment")
    section = model.Section.from_html_section(html_section)
    user_id = get_user_id()

    new_comment = model.Comment(comment=comment, section_id=section.id, user_id=user_id)
    model.session.add(new_comment)
    model.session.commit()

    return redirect(url_for('show_comments', html_section=html_section))

@app.route("/delete_comment", methods=["POST"])
def delete_comment():
    assert_is_authenticated()
    html_section = request.form.get("html_section")
    print html_section
    comment_id = request.form.get("comment_id")
    print comment_id
    user_id = get_user_id()
    print user_id

    comment = model.session.query(model.Comment).filter_by(id=comment_id).first()
    print comment
    if user_id == comment.user.id:
        model.session.delete(comment)
        model.session.commit()

    return redirect(url_for('show_comments', html_section=html_section))


@app.route("/favorite", methods=["POST"])
def set_favorite():
    """updates favorites table with section id and user id 
    and updates section table with number of favorites"""

    assert_is_authenticated()
    html_section= request.form.get("html_section")
    section = model.Section.from_html_section(html_section)
    user_id = get_user_id()
    favorited_status = request.form.get("favorited_status")

    if favorited_status == "false":
        new_favorite = model.Favorite(section_id=section.id, user_id=user_id)
        section.num_favorites += 1
        model.session.add(new_favorite)
        model.session.commit()
    else:
        favorite = model.session.query(model.Favorite).filter_by(
            user_id=user_id, section_id=section.id).first()
        model.session.delete(favorite)
        section.num_favorites -= 1
        model.session.commit()

    return redirect(url_for('show_comments', html_section=html_section))

@app.route("/favorites")
def favorites():
    user_id = get_user_id()
    user = model.session.query(model.User).filter_by(id = user_id).first()
    favorites_list = model.session.query(model.Favorite).filter_by(user_id=user_id).all()

    websites_dict = {}

    # {website: {page title:{section id:[(segment text, segment url)]}}}
    # {website: {section id:[(segment text, segment url)]}}
    for favorite in favorites_list:
        website = favorite.section.html_section.split("http://")[1].split("/")[0]
        section_id = favorite.section.html_section.split("#")[1].split(":")[0]
        segment_path = favorite.section.html_section
        segment_text = favorite.section.segment_text

        # if there is a website entry:
        if websites_dict.get(website):
        
            # if there is a matching section id:
                # append (segment_text, segment_path)
                # otherwise set the key as the section id and the value as an empty list
            websites_dict[website].setdefault(section_id, []).append((segment_text, segment_path))

        # if there is no website key:
            # set the key as the website and the value as a new dictionary
            # where the key is the section id and the value is a list of tuples
        else:
            websites_dict.setdefault(website, {section_id: [(segment_text, segment_path)]})

    return render_template("favorites.html", websites_dict = websites_dict, github_name = user.github_name)

@app.route("/vote", methods=["POST"])
def vote():
    """adjusts rating of a comment according to upvote or downvote"""
    assert_is_authenticated()
    comment_id = request.form.get("comment_id")
    vote = request.form.get("vote")
    html_section = request.form.get("html_section")
    user_id = get_user_id()

    # check to see if ratings table already has data for that user_id and comment_id
    rating_object = model.session.query(model.Rating).filter_by(comment_id=comment_id, 
        user_id=user_id).first()

    if rating_object:
        pass
    else:
        if vote == "up":
            rating_object = model.Rating(user_id=user_id, comment_id=comment_id, rating=1)
            model.session.add(rating_object)
            model.session.commit()
            rating_object.comment.sum_ratings += 1
            model.session.commit()
        else:
            rating_object = model.Rating(user_id=user_id, comment_id=comment_id, rating=-1)
            model.session.add(rating_object)
            model.session.commit()
            rating_object.comment.sum_ratings -= 1
            model.session.commit()


    return redirect(url_for('show_comments', html_section=html_section))
    

# @app.route("/page_favorites")
# def show_page_favorites(url):

#     return json.dumps(favorites)


def get_user_id():
    if session.get('github_name'):
        github_name = session['github_name']
        user = model.session.query(model.User).filter_by(github_name=github_name).first()

        if user:
            return user.id
        else:
            user = model.User(github_name=github_name)
            model.session.add(user)
            model.session.commit
            return user.id
    return None

def assert_is_authenticated():
    if not get_user_id():
        raise Exception("Request was unauthenticated")

@app.template_filter("datefilter")
def datefilter(dt):
    return dt.strftime("%d %B %Y")

# def encode_string_with_link(incoming_string):
#     url_regex = re.compile(r"""((?:mailto:|ftp://|http://)[^ <>'"{}|\\^`[\]]*)""")
#     return url_regex.sub(r'<a href="\1">\1</a>', incoming_string)

@app.template_filter("detect_url_and_make_link")
def detect_url_and_make_link(incoming_string):
    pat1 = re.compile(r"(^|[\n ])(([\w]+?://[\w\#$%&~.\-;:=,?@\[\]+]*)(/[\w\#$%&~/.\-;:=,?@\[\]+]*)?)", re.IGNORECASE | re.DOTALL)
    pat2 = re.compile(r"#(^|[\n ])(((www|ftp)\.[\w\#$%&~.\-;:=,?@\[\]+]*)(/[\w\#$%&~/.\-;:=,?@\[\]+]*)?)", re.IGNORECASE | re.DOTALL)

    incoming_string = pat1.sub(r'\1<a href="\2" target="_blank">\3</a>', incoming_string)
    incoming_string = pat2.sub(r'\1<a href="http:/\2" target="_blank">\3</a>', incoming_string)
    # safe_string = cgi.escape(incoming_string)

    # return safe_string
    return incoming_string

@app.template_filter("extract_code")
def extract_code(s):
    return_string = ""
    while len(s) > 0:
        start_code = s.find("[code]")
        intro_text = s[:start_code]
        return_string += cgi.escape(intro_text)

        s = s[start_code+6:]
        end_code = s.find("[/code]")
        code = s[:end_code]
        return_string += pygmentsfilter(code)

        s = s[end_code+7:]

    return return_string

def pygmentsfilter(incoming_string):
    return highlight(incoming_string, PythonLexer(), HtmlFormatter())
    # return highlight(incoming_string, guess_lexer(incoming_string), HtmlFormatter)

if __name__=="__main__":
    # This allows us to use a plain HTTP callback
    os.environ['DEBUG'] = "1"

    app.secret_key = os.environ.get("FLASK_SECRET_KEY", "something")
    app.run(debug=True)

