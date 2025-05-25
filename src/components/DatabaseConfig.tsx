import React, { useState } from 'react';
import { Database, TestTube, Shield, Settings, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  table: string;
}

const DatabaseConfig = () => {
  const [config, setConfig] = useState<DatabaseConfig>({
    host: '192.168.100.70',
    port: 5432,
    database: 'superset',
    username: 'postgres',
    password: 'grespost',
    table: 'ipd_visit'
  });

  const [isConnected, setIsConnected] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastTestTime, setLastTestTime] = useState('2025-01-20 15:45:00');
  const { toast } = useToast();

  const handleConfigChange = (field: keyof DatabaseConfig, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.2; // 80% success rate for demo
    setIsConnected(success);
    setLastTestTime(new Date().toLocaleString('sv-SE').replace('T', ' '));
    
    if (success) {
      toast({
        title: "Connection Successful",
        description: `Connected to ${config.database} at ${config.host}:${config.port}`,
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to the database. Please check your configuration.",
        variant: "destructive"
      });
    }
    
    setIsTestingConnection(false);
  };

  const resetToDefaults = () => {
    setConfig({
      host: '192.168.100.70',
      port: 5432,
      database: 'superset',
      username: 'postgres',
      password: 'grespost',
      table: 'ipd_visit'
    });
    toast({
      title: "Configuration Reset",
      description: "Database configuration has been reset to default values",
    });
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className={isConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className={`h-5 w-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span>Database Connection Status</span>
            {isConnected ? (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 border-red-200">
                <XCircle className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Last connection test: {lastTestTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Host:</span>
              <div className="font-medium">{config.host}</div>
            </div>
            <div>
              <span className="text-gray-600">Port:</span>
              <div className="font-medium">{config.port}</div>
            </div>
            <div>
              <span className="text-gray-600">Database:</span>
              <div className="font-medium">{config.database}</div>
            </div>
            <div>
              <span className="text-gray-600">Target Table:</span>
              <div className="font-medium">{config.table}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <span>Database Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure PostgreSQL database connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  value={config.host}
                  onChange={(e) => handleConfigChange('host', e.target.value)}
                  placeholder="Database host"
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={config.port}
                  onChange={(e) => handleConfigChange('port', parseInt(e.target.value))}
                  placeholder="Database port"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                value={config.database}
                onChange={(e) => handleConfigChange('database', e.target.value)}
                placeholder="Database name"
              />
            </div>

            <div>
              <Label htmlFor="table">Target Table</Label>
              <Input
                id="table"
                value={config.table}
                onChange={(e) => handleConfigChange('table', e.target.value)}
                placeholder="Target table name"
              />
              <p className="text-xs text-gray-500 mt-1">
                Table where DBF data will be inserted
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Authentication</span>
            </CardTitle>
            <CardDescription>
              Database user credentials for authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                placeholder="Database username"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                placeholder="Database password"
              />
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={testConnection}
                disabled={isTestingConnection}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
              >
                <TestTube className="h-4 w-4" />
                <span>
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </span>
              </Button>

              <Button
                onClick={resetToDefaults}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Reset to Defaults</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Transformation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Data Transformation Rules</CardTitle>
          <CardDescription>
            Applied automatically during DBF to PostgreSQL migration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-gray-900">Field Mappings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">NAMEPAT:</span>
                  <span className="font-medium">→ SHA256 hash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PERSON_ID:</span>
                  <span className="font-medium">→ SHA256 hash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DATEADM:</span>
                  <span className="font-medium">→ YYYY-MM-DD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DATEDSC:</span>
                  <span className="font-medium">→ YYYY-MM-DD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SEX:</span>
                  <span className="font-medium">→ 1=ชาย, 2=หญิง</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-gray-900">Calculated Fields</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">byear:</span>
                  <span className="font-medium">Fiscal year from DATEDSC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CHANGWAT:</span>
                  <span className="font-medium">Province name lookup</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AMPHUR:</span>
                  <span className="font-medium">District name lookup</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfig;
