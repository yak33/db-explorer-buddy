# DB Explorer Buddy - 后端服务

这是 DB Explorer Buddy 数据库连接测试工具的后端服务，提供真实的数据库连接测试功能。

## 功能特性

### 🚀 核心功能
- **多数据库支持**: MySQL、PostgreSQL、MongoDB、SQL Server、Oracle、SQLite
- **连接测试**: 实时测试数据库连接状态
- **数据库列表**: 获取可用数据库列表
- **安全连接**: 支持加密连接和身份验证
- **错误处理**: 详细的错误信息和调试支持

### 🛡️ 安全特性
- CORS 跨域保护
- 请求头安全配置
- 连接超时保护
- 参数验证和清理
- 错误信息脱敏

### 📊 监控特性
- 健康检查接口
- 请求日志记录
- 连接状态监控
- 性能指标收集

## 支持的数据库

| 数据库类型 | 默认端口 | 驱动包 | 状态 |
|-----------|---------|--------|------|
| MySQL | 3306 | mysql2 | ✅ 完全支持 |
| PostgreSQL | 5432 | pg | ✅ 完全支持 |
| MongoDB | 27017 | mongodb | ✅ 完全支持 |
| SQL Server | 1433 | tedious | ✅ 完全支持 |
| Oracle | 1521 | oracledb | ⚠️ 需要客户端 |
| SQLite | - | sqlite3 | ✅ 完全支持 |

## 快速开始

### 1. 环境要求
- Node.js >= 16.0.0
- npm 或 yarn
- 对应数据库的客户端工具（可选）

### 2. 安装依赖
```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

### 3. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（可选）
nano .env
```

### 4. 启动服务
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

### 5. 验证安装
访问健康检查接口：
```bash
curl http://localhost:3001/api/health
```

预期响应：
```json
{
  "status": "ok",
  "message": "DB Explorer Buddy Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## API 接口文档

### 健康检查
```http
GET /api/health
```

**响应示例：**
```json
{
  "status": "ok",
  "message": "DB Explorer Buddy Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 数据库连接测试
```http
POST /api/database/test-connection
Content-Type: application/json

{
  "type": "mysql",
  "host": "localhost",
  "port": "3306",
  "username": "root",
  "password": "password",
  "database": "test_db"
}
```

**参数说明：**
- `type`: 数据库类型（mysql, postgresql, mongodb, mssql, oracle, sqlite）
- `host`: 主机地址
- `port`: 端口号
- `username`: 用户名
- `password`: 密码
- `database`: 数据库名（可选，某些数据库类型必需）

**成功响应：**
```json
{
  "success": true,
  "message": "数据库连接成功！",
  "databases": ["db1", "db2", "db3"],
  "connectionInfo": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "connectedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**失败响应：**
```json
{
  "success": false,
  "message": "连接失败: Access denied for user 'root'@'localhost'",
  "error": "ER_ACCESS_DENIED_ERROR"
}
```

### 获取支持的数据库类型
```http
GET /api/database/supported-types
```

**响应示例：**
```json
{
  "success": true,
  "supportedTypes": [
    {
      "type": "mysql",
      "name": "MySQL",
      "defaultPort": 3306,
      "description": "MySQL数据库"
    }
  ]
}
```

## 配置说明

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| PORT | 3001 | 服务器端口 |
| NODE_ENV | development | 运行环境 |
| FRONTEND_URL | http://localhost:8080 | 前端地址（CORS） |
| DB_CONNECTION_TIMEOUT | 10000 | 数据库连接超时（毫秒） |
| DB_QUERY_TIMEOUT | 5000 | 查询超时（毫秒） |

### 数据库特殊配置

#### Oracle 数据库
Oracle 数据库需要安装客户端：

1. **下载 Oracle Instant Client**
   - 访问 [Oracle 官网](https://www.oracle.com/database/technologies/instant-client.html)
   - 下载适合您系统的客户端

2. **配置环境变量**
   ```bash
   # Linux/Mac
   export LD_LIBRARY_PATH=/path/to/instantclient
   
   # Windows
   set PATH=%PATH%;C:\path\to\instantclient
   ```

3. **更新 .env 文件**
   ```env
   ORACLE_CLIENT_PATH=/path/to/instantclient
   ```

#### SQL Server 数据库
SQL Server 连接可能需要额外配置：

```javascript
// 如果使用加密连接
{
  "type": "mssql",
  "host": "localhost",
  "port": "1433",
  "username": "sa",
  "password": "password",
  "database": "master",
  "encrypt": true,
  "trustServerCertificate": true
}
```

## 开发指南

### 项目结构
```
backend/
├── server.js              # 主服务器文件
├── services/
│   └── databaseService.js  # 数据库服务模块
├── package.json           # 项目配置
├── .env.example          # 环境变量模板
└── README.md             # 项目文档
```

### 添加新数据库支持

1. **安装数据库驱动**
   ```bash
   npm install your-database-driver
   ```

2. **在 databaseService.js 中添加实现**
   ```javascript
   // 添加连接测试函数
   async function testYourDatabaseConnection(config) {
     // 实现连接逻辑
   }
   
   // 添加数据库列表获取函数
   async function getYourDatabaseList(config) {
     // 实现列表获取逻辑
   }
   
   // 在主函数中添加 case
   case 'yourdatabase':
     return await testYourDatabaseConnection(config);
   ```

3. **更新支持的数据库类型列表**
   在 `server.js` 的 `/api/database/supported-types` 接口中添加新类型。

### 调试技巧

1. **启用详细日志**
   ```bash
   NODE_ENV=development npm run dev
   ```

2. **测试单个数据库连接**
   ```bash
   curl -X POST http://localhost:3001/api/database/test-connection \
     -H "Content-Type: application/json" \
     -d '{
       "type": "mysql",
       "host": "localhost",
       "port": "3306",
       "username": "root",
       "password": "password"
     }'
   ```

3. **查看错误日志**
   错误信息会输出到控制台，包含详细的堆栈跟踪。

## 部署指南

### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3001

CMD ["npm", "start"]
```

```bash
# 构建镜像
docker build -t db-explorer-buddy-backend .

# 运行容器
docker run -p 3001:3001 -e NODE_ENV=production db-explorer-buddy-backend
```

### PM2 部署
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "db-explorer-buddy-backend"

# 查看状态
pm2 status

# 查看日志
pm2 logs db-explorer-buddy-backend
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   netstat -tulpn | grep 3001
   
   # 或者更改端口
   PORT=3002 npm start
   ```

2. **数据库连接超时**
   - 检查数据库服务是否运行
   - 验证网络连接
   - 检查防火墙设置
   - 增加超时时间

3. **Oracle 客户端问题**
   ```bash
   # 检查客户端安装
   echo $LD_LIBRARY_PATH
   
   # 测试客户端
   sqlplus username/password@host:port/service
   ```

4. **权限问题**
   - 确保数据库用户有足够权限
   - 检查数据库白名单设置
   - 验证用户名和密码

### 性能优化

1. **连接池配置**
   ```javascript
   // 在生产环境中使用连接池
   const pool = mysql.createPool({
     connectionLimit: 10,
     host: 'localhost',
     user: 'root',
     password: 'password',
     acquireTimeout: 60000,
     timeout: 60000
   });
   ```

2. **缓存优化**
   - 缓存数据库列表结果
   - 使用 Redis 进行分布式缓存
   - 设置合理的缓存过期时间

3. **监控指标**
   - 连接响应时间
   - 错误率统计
   - 并发连接数
   - 内存使用情况

## 安全注意事项

1. **敏感信息保护**
   - 不要在日志中记录密码
   - 使用环境变量存储敏感配置
   - 定期轮换数据库密码

2. **网络安全**
   - 使用 HTTPS 传输
   - 配置防火墙规则
   - 限制访问来源 IP

3. **输入验证**
   - 验证所有输入参数
   - 防止 SQL 注入攻击
   - 限制连接频率

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 支持

如果您遇到问题或有建议，请：
- 查看本文档的故障排除部分
- 检查 GitHub Issues
- 创建新的 Issue 描述问题

---

**DB Explorer Buddy Backend** - 让数据库连接测试变得简单可靠！