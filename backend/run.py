# 学生管理系统后端入口文件
from app import create_app
import os

# 创建Flask应用实例
app = create_app()

if __name__ == '__main__':
    # 从环境变量读取服务器配置
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    
    # 启动服务器
    app.run(host=host, port=port, debug=debug)
