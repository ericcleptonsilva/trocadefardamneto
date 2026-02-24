from database import db
from datetime import datetime, timezone

class Uniform(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(10), nullable=False)
    __table_args__ = (db.UniqueConstraint('code', 'size', name='_code_size_uc'),)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "size": self.size
        }

class ExchangeHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50), nullable=False)
    in_uniform_code = db.Column(db.String(50), nullable=False)
    in_uniform_size = db.Column(db.String(10), nullable=False)
    out_uniform_code = db.Column(db.String(50), nullable=False)
    out_uniform_size = db.Column(db.String(10), nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "in_uniform_code": self.in_uniform_code,
            "in_uniform_size": self.in_uniform_size,
            "out_uniform_code": self.out_uniform_code,
            "out_uniform_size": self.out_uniform_size,
            "timestamp": self.timestamp.isoformat()
        }
