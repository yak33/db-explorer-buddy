
import { useState } from "react";
import { DatabaseConnectionForm, DatabaseConnection } from "@/components/DatabaseConnectionForm";
import { DatabaseList } from "@/components/DatabaseList";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { IpDisplay } from "@/components/IpDisplay";
import { Database, Server } from "lucide-react";

export interface ConnectionResult {
  success: boolean;
  message: string;
  databases?: string[];
}

const Index = () => {
  const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnection = async (connectionData: DatabaseConnection) => {
    setIsConnecting(true);
    setConnectionResult(null);

    try {
      console.log("尝试连接数据库:", connectionData);
      
      // 调用后端API进行真实的数据库连接测试
      const response = await fetch('http://localhost:3001/api/database/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           type: connectionData.type,
           host: connectionData.host,
           port: connectionData.port,
           username: connectionData.username,
           password: connectionData.password,
           database: connectionData.database || undefined
         })
      });

      const result = await response.json();
      
      if (result.success) {
        setConnectionResult({
          success: true,
          message: result.message || "数据库连接成功！",
          databases: result.databases || []
        });
      } else {
        setConnectionResult({
          success: false,
          message: result.message || "数据库连接失败"
        });
      }
    } catch (error) {
      console.error('连接错误:', error);
      setConnectionResult({
        success: false,
        message: "连接失败：无法连接到后端服务器。请确保后端服务正在运行。"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Database className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            数据库连接测试工具
          </h1>
          <p className="text-slate-600 text-lg">
            输入数据库连接信息，测试连接状态并查看可用数据库
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Connection Form and Status */}
          <div className="lg:col-span-1 space-y-6">
            <DatabaseConnectionForm 
              onConnect={handleConnection}
              isConnecting={isConnecting}
            />
            
            {/* Connection Status */}
            {(connectionResult || isConnecting) && (
              <ConnectionStatus 
                result={connectionResult}
                isConnecting={isConnecting}
              />
            )}
          </div>

          {/* Middle Column - IP Information */}
          <div className="lg:col-span-1 space-y-6">
            <IpDisplay />
            
            {/* Tips Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <div className="flex items-center mb-3">
                <Server className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-slate-800">连接提示</h3>
              </div>
              <div className="text-sm text-slate-600 space-y-2">
                <p>• 测试账户：用户名 "admin"，密码 "password"</p>
                <p>• 支持 MySQL、PostgreSQL、SQL Server 等</p>
                <p>• 请确保数据库服务器允许远程连接</p>
                <p>• 检查防火墙和网络安全组设置</p>
                <p>• 将公网IP提供给管理员加入白名单</p>
              </div>
            </div>
          </div>

          {/* Right Column - Database List */}
          <div className="lg:col-span-1 space-y-6">
            <DatabaseList 
              databases={connectionResult?.databases || []}
              isVisible={connectionResult?.success || false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
