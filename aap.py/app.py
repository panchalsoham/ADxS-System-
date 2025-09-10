from flask import Flask, render_template, request, redirect, url_for, flash
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = '8203'

# Configure email
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'admin@gmail.com'
app.config['MAIL_PASSWORD'] = 'Admin@123'
app.config['MAIL_USE_TLS'] = True

mail = Mail(app)
s = URLSafeTimedSerializer(app.secret_key)

# Dummy user storage
users = {
    "panchalsoham123@gmail.com": {"password": "oldpassword"}
}


@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form["email"]
        if email in users:
            token = s.dumps(email, salt='password-reset')
            link = url_for('reset_password', token=token, _external=True)
            msg = Message("Reset Your Password", sender="panchalsoham123@gmail.com", recipients=[email])
            msg.body = f"Click this link to reset your password: {link}"
            mail.send(msg)
            return "Reset link sent! Check your email."
        else:
            return "Email not found!"
    return render_template("forgot_password.html")

@app.route("/reset-password/<token>", methods=["GET", "POST"])
def reset_password(token):
    try:
        email = s.loads(token, salt='password-reset', max_age=3600)
    except:
        return "Link expired or invalid."

    if request.method == "POST":
        new_password = request.form["new_password"]
        users[email]["password"] = new_password
        return "Password reset successful!"
    
    return render_template("reset_password.html", token=token)

if __name__ == "__main__":
    app.run(debug=True) import zipfile
import os

# Define the path to the uploaded ZIP file and extraction directory
zip_path = "/mnt/data/ADS-2.zip"
extract_dir = "/mnt/data/ADS-2"

# Extract the ZIP file
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_dir)

# List extracted files and folders
extracted_files = []
for root, dirs, files in os.walk(extract_dir):
    for file in files:
        extracted_files.append(os.path.relpath(os.path.join(root, file), extract_dir))

extracted_files[:20]  # Show first 20 files for preview S



from flask import send_file
import os
from datetime import datetime

@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    try:
        data = request.get_json()
        
        # Create a temporary HTML file
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Breast Cancer Risk Assessment</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                }}
                .header {{
                    text-align: center;
                    color: #ff69b4;
                    padding: 20px;
                    border-bottom: 2px solid #ff69b4;
                }}
                .section {{
                    margin: 20px 0;
                    padding: 15px;
                    background: #f9f9f9;
                    border-radius: 8px;
                }}
                .risk-level {{
                    font-size: 18px;
                    font-weight: bold;
                    color: #ff69b4;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>ADxS Breast Cancer Risk Assessment Report</h1>
                <p>Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
            </div>
            
            <div class="section">
                <h2>Risk Assessment Results</h2>
                <p class="risk-level">5-Year Risk: {data.get('fiveYearRisk', '0')}%</p>
                <p class="risk-level">Lifetime Risk: {data.get('lifetimeRisk', '0')}%</p>
            </div>
            
            <div class="section">
                <h2>Risk Factors</h2>
                <ul>
                    {' '.join(f'<li>{factor}</li>' for factor in data.get('riskFactors', []))}
                </ul>
            </div>
            
            <div class="section">
                <h2>Recommendations</h2>
                <ul>
                    {' '.join(f'<li>{rec}</li>' for rec in data.get('recommendations', []))}
                </ul>
            </div>
        </body>
        </html>
        """
        
        # Configure PDF options
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': 'UTF-8',
            'no-outline': None
        }
        
        # Generate PDF
        pdf = pdfkit.from_string(html_content, False, options=options)
        
        # Create response
        response = make_response(pdf)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = 'attachment; filename=breast_cancer_assessment.pdf'
        
        return response
        
    except Exception as e:
        print(f"PDF Generation Error: {str(e)}")  # For debugging
        return jsonify({'error': str(e)}), 500


