from flask import Flask, request, jsonify, redirect, url_for, render_template, session
import google.generativeai as genai
from flask_cors import CORS  # Import de CORS
import os
import bcrypt 
from flask_sqlalchemy import SQLAlchemy

# Configurer l'API Gemini
genai.configure(api_key="AIzaSyAfEB7q0Jd7LX_7hBeuzBEfVQegZOtHg78")

STATIC_FOLDER_PATH = os.path.abspath('src/static')
app = Flask(__name__, static_folder=STATIC_FOLDER_PATH)
app.secret_key = 'marcus'

# Appliquer CORS pour autoriser les requêtes depuis toutes les origines
CORS(app)

# DB configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class users(db.Model):
    _id = db.Column('id', db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(), unique=True, nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/save', methods=['POST'])
def save():
    print(request.form)
    username = request.form['username']
    email = request.form['email']
    password = hash_password(request.form['password'])
    
    for i in request.form:
        print(i)
    user = users(username, email, password)
    db.session.add(user)
    db.session.commit()
    
    session['user'] = username
    return jsonify({'status': 'success'})


@app.route('/')
def main():
    if 'user' in session:
        username = session['user']
        return render_template("index.html", username=username)
    return redirect(url_for('login'))


@app.route('/login')
def login():
    if 'user' in session:
        return redirect(url_for('main'))
    return render_template("login.html")

@app.route('/connect', methods=['POST'])
def connect():
    username = request.form['username'].lower()
    password = request.form['password']
    status = 'failed'
    
    found_user = users.query.filter_by(username=username).first()
    print(found_user.password.encode('utf-8'))
    if found_user and verify_password(password, found_user.password):
        session['user'] = username
        status = 'success'
    
    return jsonify({'status': status})


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main'))

@app.route('/upload', methods=['POST'])
def upload_file():
    model = genai.GenerativeModel("gemini-1.5-flash")
    sms = request.form['sms']
    file = request.files['file']
    
    if file.filename == '':
        response = model.generate_content(sms)
        return jsonify({"response": response.text})
    
    if file and file.filename != '':
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        img = file.filename
        dirname = 'uploads'
        filepath = os.path.join(dirname, img)
        myfile = genai.upload_file(filepath)
        response = model.generate_content([myfile, sms])
        print(response.text)
        return jsonify({ "response": response.text })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)