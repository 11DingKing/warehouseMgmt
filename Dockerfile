FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# 安装系统依赖（curl 用于健康检查）
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 配置 pip 使用清华镜像源（内网可用）
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 复制依赖文件并安装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目文件
COPY warehouse/ /app/

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 8000

# 注意：
# 1. 数据库迁移和 superuser 创建在 docker-compose.yml 的 command 中执行
# 2. 这样可以使用环境变量，避免构建时失败
# 3. collectstatic 也在启动时执行，确保静态文件就绪
# 4. 数据目录 /app/data 用于存储 SQLite 数据库

# 默认命令（可被 docker-compose.yml 覆盖）
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
