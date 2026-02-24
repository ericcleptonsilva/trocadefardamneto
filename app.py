from flask import Flask, request, jsonify, send_file
from database import db
from models import Uniform, ExchangeHistory
import os
import csv
import io
from fpdf import FPDF
from sqlalchemy import inspect
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure instance folder exists at root level
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)

db_path = os.path.join(instance_path, 'uniforms.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    inspector = inspect(db.engine)
    try:
        if 'exchange_history' in inspector.get_table_names():
            columns = [c['name'] for c in inspector.get_columns('exchange_history')]
            if 'in_uniform_code' not in columns:
                logger.info("Old schema detected in exchange_history. Resetting database.")
                db.drop_all()
                db.create_all()
        else:
            logger.info("Tables not found. Creating all tables.")
            db.create_all()
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        db.create_all()

@app.route('/register_exchange', methods=['POST'])
def register_exchange():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Nenhum dado recebido."}), 400

        student_id = data.get('student_id')
        in_code = data.get('in_uniform_code')
        in_size = data.get('in_uniform_size')
        out_code = data.get('out_uniform_code')
        out_size = data.get('out_uniform_size')

        if not all([student_id, in_code, in_size, out_code, out_size]):
            return jsonify({"error": "Todos os campos (Matrícula, Entrada e Saída) são obrigatórios."}), 400

        new_exchange = ExchangeHistory(
            student_id=student_id,
            in_uniform_code=in_code,
            in_uniform_size=in_size,
            out_uniform_code=out_code,
            out_uniform_size=out_size
        )
        db.session.add(new_exchange)
        db.session.commit()

        logger.info(f"Exchange registered for student {student_id}")
        return jsonify({"message": "Troca registrada com sucesso!", "exchange": new_exchange.to_dict()}), 201
    except Exception as e:
        logger.error(f"Error in register_exchange: {e}")
        db.session.rollback()
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

@app.route('/history', methods=['GET'])
def get_history():
    try:
        history = ExchangeHistory.query.order_by(ExchangeHistory.timestamp.desc()).all()
        return jsonify([record.to_dict() for record in history])
    except Exception as e:
        logger.error(f"Error in get_history: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/uniforms', methods=['GET'])
def get_uniforms():
    try:
        uniforms = Uniform.query.all()
        return jsonify([u.to_dict() for u in uniforms])
    except Exception as e:
        logger.error(f"Error in get_uniforms: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/import_uniforms', methods=['POST'])
def import_uniforms():
    if 'file' not in request.files:
        return jsonify({"error": "Arquivo não encontrado na requisição."}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado."}), 400

    try:
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)

        imported_count = 0
        for row in csv_input:
            code = row.get('code')
            size = row.get('size')
            if code and size:
                existing = Uniform.query.filter_by(code=code, size=size).first()
                if not existing:
                    new_uniform = Uniform(code=code, size=size)
                    db.session.add(new_uniform)
                    imported_count += 1

        db.session.commit()
        logger.info(f"Imported {imported_count} uniforms.")
        return jsonify({"message": f"Sucesso! {imported_count} fardamentos importados para o catálogo."}), 201
    except Exception as e:
        logger.error(f"Error in import_uniforms: {e}")
        db.session.rollback()
        return jsonify({"error": f"Erro ao processar CSV: {str(e)}"}), 500

@app.route('/export_pdf', methods=['GET'])
def export_pdf():
    try:
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
    except Exception as e:
        logger.error(f"Error in export_pdf: {e}")
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
