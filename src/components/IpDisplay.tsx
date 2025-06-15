
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const IpDisplay = () => {
  const [localIp, setLocalIp] = useState<string>("");
  const [publicIp, setPublicIp] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchIpAddresses = async () => {
    setIsLoading(true);
    
    // 获取公网IP - 使用多个备用API
    const publicIpApis = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip',
      'https://api.my-ip.io/ip.json'
    ];
    
    let publicIpFound = false;
    
    for (const apiUrl of publicIpApis) {
      if (publicIpFound) break;
      
      try {
        console.log(`尝试获取公网IP: ${apiUrl}`);
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          timeout: 5000 // 5秒超时
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        let ip = '';
        // 根据不同API的响应格式提取IP
        if (data.ip) {
          ip = data.ip;
        } else if (data.origin) {
          ip = data.origin;
        } else if (typeof data === 'string') {
          ip = data;
        }
        
        if (ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
          setPublicIp(ip);
          publicIpFound = true;
          console.log(`成功获取公网IP: ${ip}`);
          break;
        }
      } catch (error) {
        console.warn(`API ${apiUrl} 失败:`, error);
        continue;
      }
    }
    
    if (!publicIpFound) {
      console.error('所有公网IP API都失败了');
      toast({
        title: "获取公网IP失败",
        description: "所有IP获取服务都无法访问，请检查网络连接",
        variant: "destructive",
      });
    }
    
    // 获取本地IP（通过WebRTC）
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });
      
      pc.createDataChannel("");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      pc.onicecandidate = (ice) => {
        if (ice.candidate) {
          const candidate = ice.candidate.candidate;
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (ipMatch && !ipMatch[1].startsWith('169.254')) {
            setLocalIp(ipMatch[1]);
            console.log(`获取到本地IP: ${ipMatch[1]}`);
            pc.close();
          }
        }
      };
      
      // 5秒后关闭连接
      setTimeout(() => {
        pc.close();
      }, 5000);
      
    } catch (error) {
      console.warn('获取本地IP失败:', error);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIpAddresses();
  }, []);

  const copyToClipboard = (ip: string, type: string) => {
    navigator.clipboard.writeText(ip).then(() => {
      toast({
        title: "复制成功",
        description: `${type}IP地址已复制到剪贴板`,
      });
    });
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            IP地址信息
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-orange-800"
            onClick={fetchIpAddresses}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 公网IP */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-blue-800">公网IP地址</label>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                onClick={() => copyToClipboard(publicIp, "公网")}
                disabled={!publicIp}
              >
                <Copy className="h-3 w-3 mr-1" />
                复制
              </Button>
            </div>
            <div className="font-mono text-lg text-blue-900 bg-white p-2 rounded border">
              {isLoading ? "获取中..." : publicIp || "未获取到"}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              这是您的公网IP，通常需要加入数据库白名单
            </p>
          </div>

          {/* 本地IP */}
          {localIp && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-green-800">本地IP地址</label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={() => copyToClipboard(localIp, "本地")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  复制
                </Button>
              </div>
              <div className="font-mono text-lg text-green-900 bg-white p-2 rounded border">
                {localIp}
              </div>
              <p className="text-xs text-green-600 mt-1">
                这是您的本地网络IP地址
              </p>
            </div>
          )}

          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>提示：</strong>将公网IP地址提供给数据库管理员，要求加入访问白名单。
              如果您在内网环境，可能还需要提供本地IP地址。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
