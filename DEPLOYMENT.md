# Vercel 部署指南

本文档详细说明如何将 DB Explorer Buddy 全栈应用部署到 Vercel。

## 📋 部署前准备

### 1. 确保项目结构正确

```
db-explorer-buddy/
├── api/                    # Vercel serverless 函数
│   └── index.js           # API 入口文件
├── backend/               # 后端源码
│   ├── server.js         # Express 应用
│   ├── services/         # 业务逻辑
│   └── package.json      # 后端依赖
├── src/                  # 前端源码
├── dist/                 # 构建输出目录
├── package.json          # 前端依赖
├── vercel.json          # Vercel 配置文件
└── README.md
```

### 2. 检查关键文件

✅ `vercel.json` - Vercel 部署配置
✅ `api/index.js` - Serverless 函数入口
✅ `backend/server.js` - 已适配 Vercel 环境
✅ `src/pages/Index.tsx` - API 地址已配置为环境自适应

## 🚀 部署步骤

### 方法一：通过 Vercel CLI（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   # 在项目根目录执行
   vercel
   
   # 首次部署时会询问配置，按提示操作：
   # - Set up and deploy? [Y/n] Y
   # - Which scope? 选择你的账户
   # - Link to existing project? [y/N] N
   # - What's your project's name? db-explorer-buddy
   # - In which directory is your code located? ./
   ```

4. **生产部署**
   ```bash
   vercel --prod
   ```

### 方法二：通过 GitHub 集成

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: add Vercel deployment configuration"
   git push origin main
   ```

2. **在 Vercel 控制台导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置构建设置**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## ⚙️ 环境变量配置

在 Vercel 控制台中配置以下环境变量：

### 必需的环境变量

```bash
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### 可选的环境变量

```bash
# 数据库连接超时（毫秒）
DB_CONNECTION_TIMEOUT=10000

# 最大并发连接数
MAX_CONCURRENT_CONNECTIONS=10

# Oracle 客户端路径（如果使用 Oracle）
ORACLE_CLIENT_PATH=/opt/oracle/instantclient

# 应用信息
APP_NAME=DB Explorer Buddy
APP_VERSION=1.0.0
```

### 设置环境变量的方法

1. **通过 Vercel 控制台**
   - 进入项目设置
   - 点击 "Environment Variables"
   - 添加变量

2. **通过 Vercel CLI**
   ```bash
   vercel env add NODE_ENV
   # 输入值: production
   # 选择环境: Production
   ```

## 🔧 配置文件说明

### vercel.json 配置解释

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  }
}
```

**配置说明：**
- `builds`: 定义构建配置，包括静态文件构建和 Node.js 函数
- `routes`: 路由配置，API 请求转发到 serverless 函数，其他请求转发到静态文件
- `functions`: 函数配置，设置最大执行时间为 30 秒

## 🧪 部署后测试

### 1. 测试前端
访问你的 Vercel 应用地址，确保页面正常加载。

### 2. 测试后端 API

**健康检查：**
```bash
curl https://your-app-name.vercel.app/api/health
```

**数据库连接测试：**
```bash
curl -X POST https://your-app-name.vercel.app/api/database/test-connection \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mysql",
    "host": "your-db-host",
    "port": "3306",
    "username": "your-username",
    "password": "your-password"
  }'
```

### 3. 测试完整功能
在前端界面中测试数据库连接功能，确保前后端通信正常。

## 🔍 常见问题排查

### 1. API 请求失败

**问题：** 前端无法连接到后端 API

**解决方案：**
- 检查 `vercel.json` 中的路由配置
- 确认 `api/index.js` 文件存在且正确导入了 Express 应用
- 查看 Vercel 函数日志

### 2. 数据库连接超时

**问题：** 数据库连接在 Vercel 上超时

**解决方案：**
- Vercel 免费版函数执行时间限制为 10 秒
- 升级到 Pro 版本获得更长的执行时间
- 优化数据库连接代码，减少连接时间

### 3. 环境变量未生效

**问题：** 环境变量在生产环境中未正确读取

**解决方案：**
- 确认在 Vercel 控制台中正确设置了环境变量
- 重新部署应用使环境变量生效
- 检查变量名称是否正确

### 4. 构建失败

**问题：** Vercel 构建过程中出现错误

**解决方案：**
- 检查 `package.json` 中的依赖版本
- 确认构建命令正确
- 查看构建日志中的具体错误信息

## 📊 性能优化建议

### 1. 函数冷启动优化
- 减少依赖包大小
- 使用连接池复用数据库连接
- 实现适当的缓存策略

### 2. 静态资源优化
- 启用 Vercel 的 CDN 加速
- 压缩静态资源
- 使用适当的缓存头

### 3. 数据库连接优化
- 使用连接池
- 设置合理的超时时间
- 实现重试机制

## 🔒 安全注意事项

1. **环境变量安全**
   - 不要在代码中硬编码敏感信息
   - 使用 Vercel 环境变量管理敏感配置

2. **API 安全**
   - 实现适当的请求频率限制
   - 验证输入参数
   - 使用 HTTPS

3. **数据库安全**
   - 使用最小权限原则
   - 启用数据库防火墙
   - 定期更新数据库密码

## 📞 获取帮助

如果在部署过程中遇到问题：

1. 查看 [Vercel 官方文档](https://vercel.com/docs)
2. 检查 [Vercel 社区论坛](https://github.com/vercel/vercel/discussions)
3. 查看项目的 GitHub Issues
4. 联系项目维护者

---

**祝你部署成功！** 🎉