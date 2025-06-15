import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testDatabaseConnection, getDatabaseList } from './services/databaseService.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(helmet()); // 安全头部
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
})); // 跨域支持
app.use(express.json({ limit: '10mb' })); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DB Explorer Buddy Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 数据库连接测试接口
app.post('/api/database/test-connection', async (req, res) => {
  try {
    const { host, port, username, password, database, type = 'mysql' } = req.body;

    // 参数验证
    if (!host || !port || !username || !password) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的连接参数：主机地址、端口、用户名和密码都是必需的'
      });
    }

    // 端口号验证
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return res.status(400).json({
        success: false,
        message: '端口号必须是1-65535之间的有效数字'
      });
    }

    console.log(`尝试连接数据库: ${type}://${username}@${host}:${port}`);

    // 测试数据库连接
    const connectionResult = await testDatabaseConnection({
      type,
      host,
      port: portNum,
      username,
      password,
      database
    });

    if (connectionResult.success) {
      // 如果连接成功，获取数据库列表
      const databases = await getDatabaseList({
        type,
        host,
        port: portNum,
        username,
        password,
        database
      });

      res.json({
        success: true,
        message: '数据库连接成功！',
        databases: databases || [],
        connectionInfo: {
          type,
          host,
          port: portNum,
          username,
          connectedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: connectionResult.message || '数据库连接失败',
        error: connectionResult.error
      });
    }

  } catch (error) {
    console.error('数据库连接测试错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取支持的数据库类型
app.get('/api/database/supported-types', (req, res) => {
  res.json({
    success: true,
    supportedTypes: [
      {
        type: 'mysql',
        name: 'MySQL',
        defaultPort: 3306,
        description: 'MySQL数据库'
      },
      {
        type: 'postgresql',
        name: 'PostgreSQL',
        defaultPort: 5432,
        description: 'PostgreSQL数据库'
      },
      {
        type: 'mongodb',
        name: 'MongoDB',
        defaultPort: 27017,
        description: 'MongoDB文档数据库'
      },
      {
        type: 'mssql',
        name: 'SQL Server',
        defaultPort: 1433,
        description: 'Microsoft SQL Server'
      },
      {
        type: 'oracle',
        name: 'Oracle',
        defaultPort: 1521,
        description: 'Oracle数据库'
      },
      {
        type: 'sqlite',
        name: 'SQLite',
        defaultPort: null,
        description: 'SQLite文件数据库'
      }
    ]
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
  console.error('全局错误处理:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 DB Explorer Buddy Backend 服务器已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🏥 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString()}\n`);
});

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('\n收到SIGTERM信号，正在优雅关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n收到SIGINT信号，正在优雅关闭服务器...');
  process.exit(0);
});

export default app;