
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export interface DatabaseConnection {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database?: string;
}
import { Loader2, Database, Plug, Eye, EyeOff } from "lucide-react";

interface DatabaseConnectionFormProps {
  onConnect: (connection: DatabaseConnection) => void;
  isConnecting: boolean;
}

export const DatabaseConnectionForm = ({ onConnect, isConnecting }: DatabaseConnectionFormProps) => {
  const [formData, setFormData] = useState<DatabaseConnection>({
    type: "mysql",
    host: "",
    port: "3306",
    username: "",
    password: "",
    database: ""
  });
  
  // 控制密码显示/隐藏的状态
  const [showPassword, setShowPassword] = useState(false);

  // 数据库类型配置
  const databaseTypes = [
    { value: "mysql", label: "MySQL", defaultPort: "3306" },
    { value: "postgresql", label: "PostgreSQL", defaultPort: "5432" },
    { value: "mongodb", label: "MongoDB", defaultPort: "27017" },
    { value: "mssql", label: "SQL Server", defaultPort: "1433" },
    { value: "oracle", label: "Oracle", defaultPort: "1521" },
    { value: "sqlite", label: "SQLite", defaultPort: "" }
  ];

  // 当数据库类型改变时，自动更新默认端口
  const handleTypeChange = (type: string) => {
    const dbType = databaseTypes.find(db => db.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      port: dbType?.defaultPort || ""
    }));
  };

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
          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-700 font-medium">
              数据库类型
            </Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="选择数据库类型" />
              </SelectTrigger>
              <SelectContent>
                {databaseTypes.map((dbType) => (
                  <SelectItem key={dbType.value} value={dbType.value}>
                    {dbType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                required={formData.type !== 'sqlite'}
                disabled={formData.type === 'sqlite'}
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
                placeholder={databaseTypes.find(db => db.value === formData.type)?.defaultPort || ""}
                className="border-slate-300 focus:border-blue-500"
                required={formData.type !== 'sqlite'}
                disabled={formData.type === 'sqlite'}
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
              required={formData.type !== 'sqlite'}
              disabled={formData.type === 'sqlite'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              密码
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="数据库密码"
                className="border-slate-300 focus:border-blue-500 pr-10"
                required={formData.type !== 'sqlite'}
                disabled={formData.type === 'sqlite'}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                disabled={formData.type === 'sqlite'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-500 hover:text-slate-700" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-500 hover:text-slate-700" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="database" className="text-slate-700 font-medium">
              {formData.type === 'sqlite' ? '数据库文件路径' : '数据库名称（可选）'}
            </Label>
            <Input
              id="database"
              type="text"
              value={formData.database}
              onChange={(e) => handleInputChange("database", e.target.value)}
              placeholder={
                formData.type === 'sqlite' 
                  ? "C:\\path\\to\\database.db" 
                  : "数据库名称"
              }
              className="border-slate-300 focus:border-blue-500"
              required={formData.type === 'sqlite'}
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
