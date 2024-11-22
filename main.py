from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route("/home")
def home():
    return render_template("index.html")


@app.route("/admin")
def admin():
    return redirect(url_for("home", name='Admin'))
if __name__ == "__main__":
    app.run()