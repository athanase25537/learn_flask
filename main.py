from flask import Flask, request, jsonify, redirect, url_for, render_template, session
import google.generativeai as genai
from flask_cors import CORS  # Import de CORS
import os 

# Configurer l'API Gemini
genai.configure(api_key="AIzaSyAfEB7q0Jd7LX_7hBeuzBEfVQegZOtHg78")

STATIC_FOLDER_PATH = os.path.abspath('src/static')
app = Flask(__name__, static_folder=STATIC_FOLDER_PATH)
app.secret_key = 'marcus'
# Appliquer CORS pour autoriser les requêtes depuis toutes les origines
CORS(app)

UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
    username = request.form['username']
    password = request.form['password']
    status = 'failed'
    if username == 'athanase' and password == 'password':
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
    app.run(debug=True)