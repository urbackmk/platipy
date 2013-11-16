import os

DB_URL = os.environ.get("DATABASE_URL", "sqlite:///platipy_app.db")


client_id = os.environ.get("GITHUB_CLIENT_ID", "")
client_secret = os.environ.get("GITHUB_CLIENT_SECRET", "")
flask_secret_key = os.environ.get("FLASK_SECRET_KEY", "")


