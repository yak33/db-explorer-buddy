
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Table } from "lucide-react";

interface DatabaseListProps {
  databases: string[];
  isVisible: boolean;
}

export const DatabaseList = ({ databases, isVisible }: DatabaseListProps) => {
  if (!isVisible) {
    return (
      <Card className="shadow-lg border-slate-200 opacity-50">
        <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            数据库列表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-slate-500 py-8">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>请先成功连接数据库</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-slate-200 animate-in slide-in-from-right-5 duration-500">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            数据库列表
          </span>
          <span className="bg-green-800 px-2 py-1 rounded-full text-xs">
            {databases.length} 个数据库
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {databases.length === 0 ? (
          <div className="text-center text-slate-500 py-4">
            <p>没有发现数据库</p>
          </div>
        ) : (
          <div className="space-y-2">
            {databases.map((db, index) => (
              <div 
                key={db}
                className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <Table className="h-4 w-4 text-blue-600 mr-3" />
                <span className="font-medium text-slate-800">{db}</span>
                <div className="ml-auto">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
