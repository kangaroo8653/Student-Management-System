# 学生管理系统后端入口文件
from app import create_app

# 创建Flask应用实例
app = create_app()

if __name__ == '__main__':
    # 启动服务器：
    # host='0.0.0.0' 允许外部访问
    # port=5000 指定端口号
    # debug=True 开启调试模式，代码修改后自动重启
    app.run(host='0.0.0.0', port=5000, debug=True)
