from database import db
from datetime import datetime, timezone

class Uniform(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    size = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "size": self.size
        }

class ExchangeHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50), nullable=False)
    uniform_code = db.Column(db.String(50), nullable=False)
    uniform_size = db.Column(db.String(10), nullable=False)
    reason = db.Column(db.String(100), nullable=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "uniform_code": self.uniform_code,
            "uniform_size": self.uniform_size,
            "reason": self.reason,
            "timestamp": self.timestamp.isoformat()
        }
