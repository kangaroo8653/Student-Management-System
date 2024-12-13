# Flask应用初始化配置文件
from flask import Flask, jsonify
from flask_cors import CORS
from .routes import students_bp
from .models import init_db

def create_app():
    """创建并配置Flask应用"""
    # 创建Flask应用实例
    app = Flask(__name__)
    
    # 启用跨域资源共享，允许前端访问
    CORS(app)
    
    # 注册404错误处理器
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "接口不存在"}), 404
    
    # 注册路由蓝图，设置URL前缀为/api
    app.register_blueprint(students_bp, url_prefix='/api')
    
    # 初始化数据库，创建表结构
    init_db()
    
    return app
