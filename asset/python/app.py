from flask import app, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from app.py import db  # Adjust this import as per your project
<<<<<<< Tabnine <<<<<<<

from flask import app, request, jsonify#+
from werkzeug.security import check_password_hash, generate_password_hash#+
from app import db  # Adjust this import as per your project#+

>>>>>>> Tabnine >>>>>>># {"conversationId":"ea954b1b-62ed-4b78-bb9d-ff71cfbc42c1","source":"instruct"}

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email', '').strip()
    current_password = data.get('current_password', '').strip()
    new_password = data.get('new_password', '').strip()
    confirm_password = data.get('confirm_password', '').strip()

    # Validate user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'})

    # Check current password
    if not check_password_hash(user.password, current_password):
        return jsonify({'success': False, 'message': 'Current password is incorrect'})
    
    if len(new_password) < 6:
    return jsonify({'success': False, 'message': 'Password must be at least 6 characters'})


    # Check new password match
    if new_password != confirm_password:
        return jsonify({'success': False, 'message': 'Passwords do not match'})

    # Check if new password is same as current
    if check_password_hash(user.password, new_password):
        return jsonify({'success': False, 'message': 'New password must be different from current password'})

    # Save new password
    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Password updated successfully'})
