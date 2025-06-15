import mysql from 'mysql2/promise';
import pkg from 'pg';
const { Client: PostgreSQLClient } = pkg;
import { MongoClient } from 'mongodb';
import { Connection as SQLServerConnection, Request as SQLServerRequest } from 'tedious';
import oracledb from 'oracledb';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

/**
 * 测试数据库连接
 * @param {Object} config - 数据库连接配置
 * @param {string} config.type - 数据库类型 (mysql, postgresql, mongodb, mssql, oracle, sqlite)
 * @param {string} config.host - 主机地址
 * @param {number} config.port - 端口号
 * @param {string} config.username - 用户名
 * @param {string} config.password - 密码
 * @param {string} config.database - 数据库名（可选）
 * @returns {Promise<Object>} 连接结果
 */
export async function testDatabaseConnection(config) {
  const { type, host, port, username, password, database } = config;

  try {
    switch (type.toLowerCase()) {
      case 'mysql':
        return await testMySQLConnection(config);
      case 'postgresql':
      case 'postgres':
        return await testPostgreSQLConnection(config);
      case 'mongodb':
      case 'mongo':
        return await testMongoDBConnection(config);
      case 'mssql':
      case 'sqlserver':
        return await testSQLServerConnection(config);
      case 'oracle':
        return await testOracleConnection(config);
      case 'sqlite':
        return await testSQLiteConnection(config);
      default:
        return {
          success: false,
          message: `不支持的数据库类型: ${type}`,
          error: 'UNSUPPORTED_DATABASE_TYPE'
        };
    }
  } catch (error) {
    console.error(`数据库连接测试失败 (${type}):`, error);
    return {
      success: false,
      message: `连接失败: ${error.message}`,
      error: error.code || 'CONNECTION_ERROR'
    };
  }
}

/**
 * 获取数据库列表
 * @param {Object} config - 数据库连接配置
 * @returns {Promise<Array>} 数据库列表
 */
export async function getDatabaseList(config) {
  const { type } = config;

  try {
    switch (type.toLowerCase()) {
      case 'mysql':
        return await getMySQLDatabases(config);
      case 'postgresql':
      case 'postgres':
        return await getPostgreSQLDatabases(config);
      case 'mongodb':
      case 'mongo':
        return await getMongoDatabases(config);
      case 'mssql':
      case 'sqlserver':
        return await getSQLServerDatabases(config);
      case 'oracle':
        return await getOracleDatabases(config);
      case 'sqlite':
        return await getSQLiteDatabases(config);
      default:
        return [];
    }
  } catch (error) {
    console.error(`获取数据库列表失败 (${type}):`, error);
    return [];
  }
}

// MySQL 连接测试
async function testMySQLConnection(config) {
  const { host, port, username, password, database } = config;
  let connection;

  try {
    connection = await mysql.createConnection({
      host,
      port,
      user: username,
      password,
      database,
      connectTimeout: 10000, // 10秒超时
      acquireTimeout: 10000,
      timeout: 10000
    });

    // 测试连接
    await connection.ping();
    
    return {
      success: true,
      message: 'MySQL连接成功',
      version: await getMySQLVersion(connection)
    };
  } catch (error) {
    return {
      success: false,
      message: `MySQL连接失败: ${error.message}`,
      error: error.code
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PostgreSQL 连接测试
async function testPostgreSQLConnection(config) {
  const { host, port, username, password, database } = config;
  const client = new PostgreSQLClient({
    host,
    port,
    user: username,
    password,
    database: database || 'postgres',
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    const result = await client.query('SELECT version()');
    
    return {
      success: true,
      message: 'PostgreSQL连接成功',
      version: result.rows[0].version
    };
  } catch (error) {
    return {
      success: false,
      message: `PostgreSQL连接失败: ${error.message}`,
      error: error.code
    };
  } finally {
    await client.end();
  }
}

// MongoDB 连接测试
async function testMongoDBConnection(config) {
  const { host, port, username, password, database } = config;
  
  // 构建连接字符串
  let connectionString;
  if (username && password) {
    connectionString = `mongodb://${username}:${password}@${host}:${port}`;
  } else {
    connectionString = `mongodb://${host}:${port}`;
  }
  
  if (database) {
    connectionString += `/${database}`;
  }

  const client = new MongoClient(connectionString, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
  });

  try {
    await client.connect();
    const adminDb = client.db('admin');
    const result = await adminDb.command({ buildInfo: 1 });
    
    return {
      success: true,
      message: 'MongoDB连接成功',
      version: result.version
    };
  } catch (error) {
    return {
      success: false,
      message: `MongoDB连接失败: ${error.message}`,
      error: error.code
    };
  } finally {
    await client.close();
  }
}

// SQL Server 连接测试
async function testSQLServerConnection(config) {
  const { host, port, username, password, database } = config;
  
  return new Promise((resolve) => {
    const connectionConfig = {
      server: host,
      options: {
        port: port,
        database: database,
        connectTimeout: 10000,
        requestTimeout: 10000,
        encrypt: false // 根据需要调整
      },
      authentication: {
        type: 'default',
        options: {
          userName: username,
          password: password
        }
      }
    };

    const connection = new SQLServerConnection(connectionConfig);
    
    connection.on('connect', (err) => {
      if (err) {
        resolve({
          success: false,
          message: `SQL Server连接失败: ${err.message}`,
          error: err.code
        });
      } else {
        resolve({
          success: true,
          message: 'SQL Server连接成功'
        });
      }
      connection.close();
    });

    connection.connect();
  });
}

// Oracle 连接测试
async function testOracleConnection(config) {
  const { host, port, username, password, database } = config;
  let connection;

  try {
    const connectionString = `${host}:${port}/${database || 'XE'}`;
    
    connection = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connectionString,
      connectTimeout: 10
    });

    const result = await connection.execute('SELECT * FROM v$version WHERE rownum = 1');
    
    return {
      success: true,
      message: 'Oracle连接成功',
      version: result.rows[0] ? result.rows[0][0] : 'Unknown'
    };
  } catch (error) {
    return {
      success: false,
      message: `Oracle连接失败: ${error.message}`,
      error: error.code
    };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// SQLite 连接测试
async function testSQLiteConnection(config) {
  const { database } = config;
  
  if (!database) {
    return {
      success: false,
      message: 'SQLite需要指定数据库文件路径',
      error: 'MISSING_DATABASE_PATH'
    };
  }

  return new Promise((resolve) => {
    const db = new sqlite3.Database(database, (err) => {
      if (err) {
        resolve({
          success: false,
          message: `SQLite连接失败: ${err.message}`,
          error: err.code
        });
      } else {
        resolve({
          success: true,
          message: 'SQLite连接成功'
        });
      }
      db.close();
    });
  });
}

// 获取MySQL数据库列表
async function getMySQLDatabases(config) {
  const { host, port, username, password } = config;
  let connection;

  try {
    connection = await mysql.createConnection({
      host,
      port,
      user: username,
      password,
      connectTimeout: 10000
    });

    const [rows] = await connection.execute('SHOW DATABASES');
    return rows.map(row => row.Database).filter(db => 
      !['information_schema', 'performance_schema', 'mysql', 'sys'].includes(db)
    );
  } catch (error) {
    console.error('获取MySQL数据库列表失败:', error);
    return [];
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 获取PostgreSQL数据库列表
async function getPostgreSQLDatabases(config) {
  const { host, port, username, password } = config;
  const client = new PostgreSQLClient({
    host,
    port,
    user: username,
    password,
    database: 'postgres',
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false AND datname != 'postgres'"
    );
    return result.rows.map(row => row.datname);
  } catch (error) {
    console.error('获取PostgreSQL数据库列表失败:', error);
    return [];
  } finally {
    await client.end();
  }
}

// 获取MongoDB数据库列表
async function getMongoDatabases(config) {
  const { host, port, username, password } = config;
  
  let connectionString;
  if (username && password) {
    connectionString = `mongodb://${username}:${password}@${host}:${port}`;
  } else {
    connectionString = `mongodb://${host}:${port}`;
  }

  const client = new MongoClient(connectionString, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await client.connect();
    const adminDb = client.db('admin');
    const result = await adminDb.admin().listDatabases();
    return result.databases
      .filter(db => !['admin', 'local', 'config'].includes(db.name))
      .map(db => db.name);
  } catch (error) {
    console.error('获取MongoDB数据库列表失败:', error);
    return [];
  } finally {
    await client.close();
  }
}

// 获取SQL Server数据库列表
async function getSQLServerDatabases(config) {
  // SQL Server数据库列表获取实现
  return ['master', 'model', 'msdb', 'tempdb']; // 示例返回
}

// 获取Oracle数据库列表
async function getOracleDatabases(config) {
  // Oracle数据库列表获取实现
  return ['XE', 'ORCL']; // 示例返回
}

// 获取SQLite数据库列表
async function getSQLiteDatabases(config) {
  // SQLite通常是单个文件，返回文件信息
  return [config.database || 'database.db'];
}

// 获取MySQL版本信息
async function getMySQLVersion(connection) {
  try {
    const [rows] = await connection.execute('SELECT VERSION() as version');
    return rows[0].version;
  } catch (error) {
    return 'Unknown';
  }
}