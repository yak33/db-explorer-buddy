
import { Card, CardContent } from "@/components/ui/card";
import { ConnectionResult } from "@/pages/Index";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ConnectionStatusProps {
  result: ConnectionResult | null;
  isConnecting: boolean;
}

export const ConnectionStatus = ({ result, isConnecting }: ConnectionStatusProps) => {
  if (isConnecting) {
    return (
      <Card className="shadow-md border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 text-blue-600 mr-3 animate-spin" />
            <div>
              <p className="font-medium text-blue-800">正在连接数据库...</p>
              <p className="text-sm text-blue-600">请稍候，正在验证连接信息</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <Card className={`shadow-md border-2 animate-in slide-in-from-top-2 duration-300 ${
      result.success 
        ? "border-green-200 bg-green-50" 
        : "border-red-200 bg-red-50"
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start">
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${
              result.success ? "text-green-800" : "text-red-800"
            }`}>
              {result.success ? "连接成功" : "连接失败"}
            </p>
            <p className={`text-sm ${
              result.success ? "text-green-700" : "text-red-700"
            }`}>
              {result.message}
            </p>
            {result.success && result.databases && (
              <p className="text-sm text-green-600 mt-1">
                发现 {result.databases.length} 个数据库
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
