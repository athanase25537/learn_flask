from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from flask_cors import CORS  # Import de CORS
import os 

# Configurer l'API Gemini
genai.configure(api_key="AIzaSyAfEB7q0Jd7LX_7hBeuzBEfVQegZOtHg78")
app = Flask(__name__)

# Appliquer CORS pour autoriser les requêtes depuis toutes les origines
CORS(app)

UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
        # return jsonify({"response": "Je suis une reponse"})


if __name__ == '__main__':
    app.run(debug=True)