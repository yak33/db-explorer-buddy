
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseConnection } from "@/pages/Index";
import { Loader2, Database, Plug } from "lucide-react";

interface DatabaseConnectionFormProps {
  onConnect: (connection: DatabaseConnection) => void;
  isConnecting: boolean;
}

export const DatabaseConnectionForm = ({ onConnect, isConnecting }: DatabaseConnectionFormProps) => {
  const [formData, setFormData] = useState<DatabaseConnection>({
    host: "localhost",
    port: "3306",
    username: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(formData);
  };

  const handleInputChange = (field: keyof DatabaseConnection, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Plug className="h-5 w-5 mr-2" />
          数据库连接配置
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host" className="text-slate-700 font-medium">
                主机地址
              </Label>
              <Input
                id="host"
                type="text"
                value={formData.host}
                onChange={(e) => handleInputChange("host", e.target.value)}
                placeholder="localhost 或 IP 地址"
                className="border-slate-300 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port" className="text-slate-700 font-medium">
                端口号
              </Label>
              <Input
                id="port"
                type="text"
                value={formData.port}
                onChange={(e) => handleInputChange("port", e.target.value)}
                placeholder="3306"
                className="border-slate-300 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-700 font-medium">
              用户名
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="数据库用户名"
              className="border-slate-300 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              密码
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="数据库密码"
              className="border-slate-300 focus:border-blue-500"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                正在连接...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                测试连接
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
