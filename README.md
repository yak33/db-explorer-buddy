# DB Explorer Buddy 🗄️

一个现代化的数据库连接测试工具，支持多种主流数据库的连接测试和管理。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-%3E%3D16.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)

## ✨ 功能特性

### 🚀 核心功能
- **多数据库支持**: MySQL、PostgreSQL、MongoDB、SQL Server、Oracle、SQLite
- **实时连接测试**: 真实的数据库连接验证，非模拟测试
- **数据库列表**: 连接成功后自动获取可用数据库列表
- **智能表单**: 根据数据库类型自动配置默认端口
- **密码显示切换**: 支持密码明文/隐藏切换
- **网络信息**: 显示本地IP和公网IP地址

### 🛡️ 安全特性
- **CORS保护**: 跨域请求安全控制
- **参数验证**: 完整的输入参数验证
- **错误处理**: 详细的错误信息和调试支持
- **连接超时**: 防止长时间等待的超时保护

### 🎨 用户体验
- **响应式设计**: 支持桌面和移动设备
- **现代UI**: 基于shadcn/ui的美观界面
- **实时反馈**: 连接状态的实时显示
- **错误提示**: 友好的错误信息提示

## 🏗️ 项目架构

```
db-explorer-buddy/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义Hooks
│   │   └── lib/             # 工具函数
│   └── package.json
├── backend/                  # 后端服务
│   ├── services/            # 业务逻辑
│   ├── server.js           # 主服务器
│   └── package.json
└── README.md
```

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化的用户界面库
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **shadcn/ui** - 高质量的React组件库
- **Radix UI** - 无障碍的UI基础组件
- **React Query** - 数据获取和状态管理
- **Lucide React** - 美观的图标库

### 后端技术
- **Node.js** - JavaScript运行时
- **Express.js** - Web应用框架
- **多数据库驱动**:
  - `mysql2` - MySQL数据库
  - `pg` - PostgreSQL数据库
  - `mongodb` - MongoDB数据库
  - `tedious` - SQL Server数据库
  - `oracledb` - Oracle数据库
  - `sqlite3` - SQLite数据库

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 yarn
- Git

### 1. 克隆项目
```bash
git clone <YOUR_GIT_URL>
cd db-explorer-buddy
```

### 2. 安装前端依赖
```bash
# 安装前端依赖
npm install
```

### 3. 安装后端依赖
```bash
# 进入后端目录
cd backend

# 安装后端依赖
npm install

# 返回根目录
cd ..
```

### 4. 配置环境变量（可选）
```bash
# 复制后端环境变量模板
cp backend/.env.example backend/.env

# 根据需要编辑环境变量
# nano backend/.env
```

### 5. 启动服务

**启动后端服务**（新终端窗口）:
```bash
cd backend
npm run dev
```
后端服务将在 http://localhost:3001 启动

**启动前端服务**（另一个终端窗口）:
```bash
npm run dev
```
前端应用将在 http://localhost:8080 启动

### 6. 访问应用
打开浏览器访问: http://localhost:8080

## 📖 使用指南

### 基本使用流程

1. **选择数据库类型**
   - 从下拉菜单中选择要连接的数据库类型
   - 系统会自动填充该数据库的默认端口

2. **填写连接信息**
   - **主机地址**: 数据库服务器的IP地址或域名
   - **端口号**: 数据库服务端口（自动填充默认值）
   - **用户名**: 数据库用户名
   - **密码**: 数据库密码（支持显示/隐藏切换）
   - **数据库名**: 要连接的数据库名称（可选）

3. **测试连接**
   - 点击"测试连接"按钮
   - 等待连接结果
   - 查看连接状态和可用数据库列表

### 支持的数据库类型

| 数据库 | 默认端口 | 特殊说明 |
|--------|----------|----------|
| MySQL | 3306 | 最常用的关系型数据库 |
| PostgreSQL | 5432 | 功能强大的开源数据库 |
| MongoDB | 27017 | 流行的文档数据库 |
| SQL Server | 1433 | 微软的企业级数据库 |
| Oracle | 1521 | 企业级商业数据库 |
| SQLite | - | 文件型数据库，需要文件路径 |

### SQLite 特殊配置
SQLite是文件型数据库，使用时需要注意：
- 不需要填写主机地址、端口、用户名、密码
- 在"数据库文件路径"中填写.db文件的完整路径
- 例如: `C:\data\myapp.db` 或 `/home/user/data/myapp.db`

## 🔧 开发指南

### 项目结构说明

#### 前端结构
```
src/
├── components/              # 可复用组件
│   ├── ui/                 # 基础UI组件
│   ├── DatabaseConnectionForm.tsx  # 数据库连接表单
│   ├── ConnectionStatus.tsx        # 连接状态显示
│   ├── DatabaseList.tsx           # 数据库列表
│   └── IpDisplay.tsx             # IP地址显示
├── pages/                   # 页面组件
│   ├── Index.tsx           # 主页面
│   └── NotFound.tsx        # 404页面
├── hooks/                   # 自定义Hooks
├── lib/                     # 工具函数
└── main.tsx                # 应用入口
```

#### 后端结构
```
backend/
├── services/               # 业务逻辑层
│   └── databaseService.js  # 数据库连接服务
├── server.js              # Express服务器
├── package.json           # 依赖配置
└── .env.example          # 环境变量模板
```

### API 接口文档

#### 健康检查
```http
GET /api/health
```

**响应示例:**
```json
{
  "status": "ok",
  "message": "DB Explorer Buddy Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### 数据库连接测试
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

**成功响应:**
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

**失败响应:**
```json
{
  "success": false,
  "message": "连接失败: Access denied for user 'root'@'localhost'",
  "error": "ER_ACCESS_DENIED_ERROR"
}
```

#### 获取支持的数据库类型
```http
GET /api/database/supported-types
```

### 添加新数据库支持

1. **安装数据库驱动**
```bash
cd backend
npm install your-database-driver
```

2. **在 `databaseService.js` 中添加实现**
```javascript
// 添加连接测试函数
async function testYourDatabaseConnection(config) {
  // 实现连接逻辑
}

// 在主函数中添加 case
case 'yourdatabase':
  return await testYourDatabaseConnection(config);
```

3. **更新前端数据库类型列表**
在 `DatabaseConnectionForm.tsx` 中添加新的数据库类型。

## 🚀 部署指南

### Vercel 部署（推荐）

本项目已完全适配 Vercel 平台，支持前端和后端的一键部署。

**快速部署：**
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel

# 生产部署
vercel --prod
```

**详细部署指南：** 请查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 文件，包含完整的部署步骤、环境变量配置、问题排查等信息。

**部署后的项目结构：**
- 前端：静态文件托管
- 后端：Serverless 函数
- API 路由：`/api/*` 自动转发到后端函数

### Docker 部署

**后端 Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 3001
CMD ["npm", "start"]
```

**前端 Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 生产环境配置

1. **环境变量配置**
```bash
# backend/.env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
```

2. **反向代理配置 (Nginx)**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 故障排除

### 常见问题

**1. 后端服务无法启动**
```bash
# 检查端口是否被占用
netstat -tulpn | grep 3001

# 或者更改端口
PORT=3002 npm run dev
```

**2. 数据库连接超时**
- 检查数据库服务是否运行
- 验证网络连接和防火墙设置
- 确认数据库用户权限
- 检查数据库白名单配置

**3. Oracle 数据库连接问题**
```bash
# 安装 Oracle Instant Client
# 设置环境变量
export LD_LIBRARY_PATH=/path/to/instantclient
```

**4. 前端无法连接后端**
- 确认后端服务正在运行
- 检查CORS配置
- 验证API地址是否正确

### 调试技巧

**启用详细日志:**
```bash
# 后端调试模式
NODE_ENV=development npm run dev

# 前端开发者工具
# 打开浏览器开发者工具查看网络请求和控制台日志
```

**测试API接口:**
```bash
# 测试健康检查
curl http://localhost:3001/api/health

# 测试数据库连接
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

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献流程

1. **Fork 项目**
2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **提交更改**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **创建 Pull Request**

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置的代码规范
- 为新功能添加适当的注释
- 确保代码通过所有测试

### 提交信息规范

```
type(scope): description

[optional body]

[optional footer]
```

类型说明:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

感谢以下开源项目的支持:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Express.js](https://expressjs.com/)
- [Radix UI](https://www.radix-ui.com/)

## 📞 支持

如果您遇到问题或有建议，请:

1. 查看本文档的故障排除部分
2. 搜索现有的 [GitHub Issues](../../issues)
3. 创建新的 Issue 描述问题
4. 参与 [Discussions](../../discussions) 讨论

---

**DB Explorer Buddy** - 让数据库连接测试变得简单高效！ 🚀
