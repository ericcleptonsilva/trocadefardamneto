from flask import Flask, request, jsonify, render_template, send_file
from database import db
from models import Uniform, ExchangeHistory
import os
import csv
import io
from fpdf import FPDF

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///uniforms.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register_exchange', methods=['POST'])
def register_exchange():
    data = request.json
    student_id = data.get('student_id')
    in_code = data.get('in_uniform_code')
    in_size = data.get('in_uniform_size')
    out_code = data.get('out_uniform_code')
    out_size = data.get('out_uniform_size')

    if not all([student_id, in_code, in_size, out_code, out_size]):
        return jsonify({"error": "Missing data"}), 400

    new_exchange = ExchangeHistory(
        student_id=student_id,
        in_uniform_code=in_code,
        in_uniform_size=in_size,
        out_uniform_code=out_code,
        out_uniform_size=out_size
    )
    db.session.add(new_exchange)
    db.session.commit()

    return jsonify({"message": "Exchange registered successfully", "exchange": new_exchange.to_dict()}), 201

@app.route('/history', methods=['GET'])
def get_history():
    history = ExchangeHistory.query.order_by(ExchangeHistory.timestamp.desc()).all()
    return jsonify([record.to_dict() for record in history])

@app.route('/uniforms', methods=['GET'])
def get_uniforms():
    uniforms = Uniform.query.all()
    return jsonify([u.to_dict() for u in uniforms])

@app.route('/import_uniforms', methods=['POST'])
def import_uniforms():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)

        imported_count = 0
        for row in csv_input:
            code = row.get('code')
            size = row.get('size')
            if code and size:
                # Check if already exists
                existing = Uniform.query.filter_by(code=code, size=size).first()
                if not existing:
                    new_uniform = Uniform(code=code, size=size)
                    db.session.add(new_uniform)
                    imported_count += 1

        db.session.commit()
        return jsonify({"message": f"Imported {imported_count} uniforms"}), 201

@app.route('/export_pdf', methods=['GET'])
def export_pdf():
    history = ExchangeHistory.query.order_by(ExchangeHistory.timestamp.desc()).all()

    pdf = FPDF(orientation='L', unit='mm', format='A4')
    pdf.add_page()
    pdf.set_font("helvetica", 'B', 16)
    pdf.cell(277, 10, "Historico de Troca de Fardamento", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)

    pdf.set_font("helvetica", 'B', 10)
    pdf.cell(30, 10, "Matricula", border=1)
    pdf.cell(50, 10, "Entrou (Cod/Tam)", border=1)
    pdf.cell(50, 10, "Saiu (Cod/Tam)", border=1)
    pdf.cell(40, 10, "Data/Hora", border=1)
    pdf.ln()

    pdf.set_font("helvetica", '', 9)
    for record in history:
        pdf.cell(30, 10, str(record.student_id), border=1)
        pdf.cell(50, 10, f"{record.in_uniform_code} / {record.in_uniform_size}", border=1)
        pdf.cell(50, 10, f"{record.out_uniform_code} / {record.out_uniform_size}", border=1)
        pdf.cell(40, 10, record.timestamp.strftime("%Y-%m-%d %H:%M:%S"), border=1)
        pdf.ln()

    pdf_out = pdf.output()
    output = io.BytesIO(pdf_out)

    return send_file(output, as_attachment=True, download_name="historico_fardamento.pdf", mimetype='application/pdf')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
