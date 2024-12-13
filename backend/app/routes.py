# API路由定义文件
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
from .models import Student, get_db

# 创建蓝图
students_bp = Blueprint('students', __name__)

@students_bp.route('/login', methods=['POST'])
def login():
    """用户登录,固定用户名密码,admin/password"""
    data = request.json
    if data.get('username') == 'admin' and data.get('password') == 'password':
        return jsonify({'success': True, 'message': '登录成功'})
    return jsonify({'success': False, 'message': '用户名或密码错误'}), 401

@students_bp.route('/students', methods=['GET'])
def get_students():
    """获取学生列表，支持分页和搜索"""
    # 获取查询参数
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    search = request.args.get('search', '')

    with get_db() as db:
        # 构建查询
        query = db.query(Student)
        if search:
            query = query.filter(
                (Student.name.contains(search)) | 
                (Student.email.contains(search))
            )
        
        # 执行分页查询
        total = query.count()
        students = query.offset((page-1)*per_page).limit(per_page).all()
        
        return jsonify({
            'students': [student.to_dict() for student in students],
            'total': total,
            'page': page,
            'per_page': per_page,
            'allowed_page_sizes': [10, 20, 50, 100]
        })

@students_bp.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """获取单个学生信息"""
    with get_db() as db:
        student = db.query(Student).get(student_id)
        if not student:
            return jsonify({'error': '未找到该学生'}), 404
        return jsonify(student.to_dict())

@students_bp.route('/students', methods=['POST'])
def create_student():
    """创建新学生"""
    try:
        with get_db() as db:
            student = Student(**request.json)
            db.add(student)
            db.commit()
            db.refresh(student)
            return jsonify(student.to_dict()), 201
    except IntegrityError:
        return jsonify({'error': '邮箱已存在'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@students_bp.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """更新学生信息"""
    try:
        with get_db() as db:
            student = db.query(Student).get(student_id)
            if not student:
                return jsonify({'error': '未找到该学生'}), 404
            
            # 更新字段
            for key, value in request.json.items():
                setattr(student, key, value)
            
            db.commit()
            return jsonify(student.to_dict())
    except IntegrityError:
        return jsonify({'error': '邮箱已存在'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@students_bp.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """删除学生"""
    with get_db() as db:
        student = db.query(Student).get(student_id)
        if not student:
            return jsonify({'error': '未找到该学生'}), 404
        db.delete(student)
        db.commit()
        return '', 204

@students_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """获取统计信息：总人数、平均年龄、年级分布"""
    with get_db() as db:
        total = db.query(Student).count()
        avg_age = db.query(func.avg(Student.age)).scalar()
        grades = db.query(Student.grade, func.count(Student.grade))\
            .group_by(Student.grade).all()
        
        return jsonify({
            'total_students': total,
            'average_age': float(avg_age) if avg_age else 0,
            'grade_distribution': dict(grades)
        })

@students_bp.route('/backup', methods=['GET'])
def backup_database():
    """导出数据库内容"""
    with get_db() as db:
        students = db.query(Student).all()
        return jsonify({'backup': [s.to_dict() for s in students]})

@students_bp.route('/restore', methods=['POST'])
def restore_database():
    """从备份恢复数据库"""
    try:
        with get_db() as db:
            # 清空现有数据
            db.query(Student).delete()
            # 导入备份数据
            for data in request.json.get('backup', []):
                data.pop('id', None)  # 移除ID，使用自增ID
                db.add(Student(**data))
            db.commit()
            return jsonify({'message': '数据恢复成功'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@students_bp.route('/reset-database', methods=['POST'])
def reset_database():
    """清空数据库"""
    with get_db() as db:
        db.query(Student).delete()
        db.commit()
        return jsonify({'message': '数据库已重置'})
