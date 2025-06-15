
import { useState } from "react";
import { DatabaseConnectionForm } from "@/components/DatabaseConnectionForm";
import { DatabaseList } from "@/components/DatabaseList";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Database, Server } from "lucide-react";

export interface DatabaseConnection {
  host: string;
  port: string;
  username: string;
  password: string;
}

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
      // 模拟数据库连接测试 - 在实际应用中，这里会调用后端API
      console.log("尝试连接数据库:", connectionData);
      
      // 模拟连接延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟连接结果（这里可以根据输入判断成功或失败）
      if (connectionData.username === "admin" && connectionData.password === "password") {
        const mockDatabases = [
          "user_management",
          "product_catalog", 
          "order_system",
          "analytics_data",
          "configuration",
          "logs_database"
        ];
        
        setConnectionResult({
          success: true,
          message: "数据库连接成功！",
          databases: mockDatabases
        });
      } else {
        setConnectionResult({
          success: false,
          message: "连接失败：用户名或密码错误。请检查您的凭据。"
        });
      }
    } catch (error) {
      setConnectionResult({
        success: false,
        message: "连接失败：网络错误或服务器不可达。"
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

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connection Form */}
          <div className="space-y-6">
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

          {/* Database List */}
          <div className="space-y-6">
            <DatabaseList 
              databases={connectionResult?.databases || []}
              isVisible={connectionResult?.success || false}
            />
            
            {/* Tips Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <div className="flex items-center mb-3">
                <Server className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-slate-800">测试提示</h3>
              </div>
              <div className="text-sm text-slate-600 space-y-2">
                <p>• 测试账户：用户名 "admin"，密码 "password"</p>
                <p>• 支持 MySQL、PostgreSQL、SQL Server 等</p>
                <p>• 请确保数据库服务器允许远程连接</p>
                <p>• 检查防火墙和网络安全组设置</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
