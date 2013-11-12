from flask import Flask, render_template, request, redirect, flash, session, url_for
import model
import datetime

from requests_oauthlib import OAuth2Session
from flask.json import jsonify
import os
import config
import re

from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter
from pygments.styles import get_style_by_name

import json

app = Flask(__name__)

client_id = config.client_id
client_secret = config.client_secret
authorization_base_url = 'https://github.com/login/oauth/authorize'
token_url = 'https://github.com/login/oauth/access_token'

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
    user_id = get_user_id()
    section = model.Section.from_html_section(html_section)    
    
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

# hardcoded user id to always be user 1 for now
@app.route("/comment", methods=["POST"])
def make_comment():
    html_section = request.args.get("html_section")
    comment = request.form.get("comment")
    section = model.Section.from_html_section(html_section)
    user_id = get_user_id()

    new_comment = model.Comment(comment=comment, section_id=section.id, user_id=user_id)
    model.session.add(new_comment)
    model.session.commit()

    return redirect(url_for('show_comments', html_section=html_section))

@app.route("/favorite", methods=["POST"])
def set_favorite():
    """updates favorites table with section id and user id 
    and updates section table with number of favorites"""

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

@app.route("/vote", methods=["POST"])
def vote():
    """adjusts rating of a comment according to upvote or downvote"""

    comment_id = request.form.get("comment_id")
    vote = request.form.get("vote")
    html_section = request.form.get("html_section")
    comment = model.session.query(model.Comment).filter_by(id=comment_id).first()

    if vote == "up":
        comment.rating += 1
        model.session.commit()
    elif vote == "down":
        comment.rating -= 1
        model.session.commit()

    return redirect(url_for('show_comments', html_section=html_section))
    

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

@app.template_filter("datefilter")
def datefilter(dt):
    return dt.strftime("%d %B %Y")

@app.template_filter("codefilter")
def codefilter(incoming_string):
    pattern = re.compile('\[code\](.*?)\[/code\]', re.DOTALL)
    result = pattern.match(incoming_string)

    capture_text = result.group(1)
    return highlight(capture_text, PythonLexer(), HtmlFormatter())

if __name__=="__main__":
    # This allows us to use a plain HTTP callback
    os.environ['DEBUG'] = "1"

    app.secret_key = config.flask_secret_key
    app.run(debug=True)

