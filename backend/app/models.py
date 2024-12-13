# 数据库模型定义文件
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

# 创建基类
Base = declarative_base()

class Student(Base):
    """学生信息模型"""
    __tablename__ = 'students'
    
    # 定义字段
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    age = Column(Integer)
    grade = Column(String)
    email = Column(String, unique=True)  # 邮箱唯一

    def to_dict(self):
        """转换为字典格式,用于JSON响应"""
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'grade': self.grade,
            'email': self.email
        }

# 创建数据库引擎和会话
engine = create_engine('sqlite:///students.db')
SessionLocal = sessionmaker(bind=engine)

def init_db():
    """初始化数据库，创建所有表"""
    Base.metadata.create_all(bind=engine)

@contextmanager
def get_db():
    """数据库会话上下文管理器"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
