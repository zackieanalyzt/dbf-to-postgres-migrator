import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: string;
  message: string;
  details?: string;
}

const SystemLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-001',
      timestamp: '2025-01-20 15:45:32',
      level: 'success',
      category: 'Migration',
      message: 'Successfully migrated 1,250 records from patient_data_2024.dbf',
      details: 'All records processed with SHA256 hashing applied to personal data'
    },
    {
      id: 'log-002',
      timestamp: '2025-01-20 15:44:15',
      level: 'info',
      category: 'Database',
      message: 'Connected to PostgreSQL database at 192.168.100.70:5432',
      details: 'Connection established successfully to superset database'
    },
    {
      id: 'log-003',
      timestamp: '2025-01-20 15:43:28',
      level: 'info',
      category: 'File Processing',
      message: 'DBF file validation completed for patient_data_2024.dbf',
      details: 'File structure verified, 1,250 records detected'
    },
    {
      id: 'log-004',
      timestamp: '2025-01-20 15:42:10',
      level: 'warning',
      category: 'Data Transform',
      message: 'Found 15 records with missing AMPHUR data',
      details: 'Records processed with null values for district lookup'
    },
    {
      id: 'log-005',
      timestamp: '2025-01-20 13:25:45',
      level: 'error',
      category: 'Database',
      message: 'Database connection timeout during bulk insert',
      details: 'Failed to insert batch at record 945, transaction rolled back'
    },
    {
      id: 'log-006',
      timestamp: '2025-01-20 13:15:22',
      level: 'info',
      category: 'Migration',
      message: 'Started migration job for old_database.dbf',
      details: 'Job ID: job-003, Target table: ipd_visit'
    },
    {
      id: 'log-007',
      timestamp: '2025-01-20 12:30:18',
      level: 'success',
      category: 'System',
      message: 'DBF Migration Platform started successfully',
      details: 'All services initialized, ready to process files'
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, categoryFilter]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      info: 'outline',
      warning: 'secondary',
      error: 'destructive',
      success: 'default'
    };
    
    const colors: Record<string, string> = {
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      error: 'bg-red-50 text-red-700 border-red-200',
      success: 'bg-green-50 text-green-700 border-green-200'
    };

    return (
      <Badge className={colors[level] || 'bg-gray-50 text-gray-700 border-gray-200'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const downloadLogs = () => {
    const logData = filteredLogs
      .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.category}] ${log.message}${log.details ? ` - ${log.details}` : ''}`)
      .join('\n');
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = Array.from(new Set(logs.map(log => log.category)));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-500" />
            <span>Log Filters</span>
          </CardTitle>
          <CardDescription>
            Search and filter system logs by level, category, or content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={downloadLogs}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getLevelIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getLevelBadge(log.level)}
                        <Badge variant="outline" className="text-xs">
                          {log.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-sm text-gray-600">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No logs found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;
