import unittest
import os
import json
import io
from app import app, db
from models import Uniform, ExchangeHistory

class SystemTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_import_uniforms(self):
        data = {
            'file': (io.BytesIO(b"code,size\nU001,P\nU002,M"), 'uniforms.csv')
        }
        response = self.client.post('/import_uniforms', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 201)
        self.assertIn(b"Imported 2 uniforms", response.data)

    def test_register_exchange(self):
        payload = {
            "student_id": "STU001",
            "uniform_code": "U001",
            "uniform_size": "L"
        }
        response = self.client.post('/register_exchange',
                                    data=json.dumps(payload),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_get_history(self):
        with app.app_context():
            h1 = ExchangeHistory(student_id="S1", uniform_code="C1", uniform_size="S")
            db.session.add(h1)
            db.session.commit()

        response = self.client.get('/history')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 1)

    def test_get_uniforms(self):
        with app.app_context():
            u1 = Uniform(code="C1", size="S")
            db.session.add(u1)
            db.session.commit()
        response = self.client.get('/uniforms')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 1)

if __name__ == '__main__':
    unittest.main()
