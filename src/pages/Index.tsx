import React, { useState, useEffect } from 'react';
import { Upload, Database, Activity, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadSection from '@/components/FileUploadSection';
import JobMonitor from '@/components/JobMonitor';
import SystemLogs from '@/components/SystemLogs';
import DatabaseConfig from '@/components/DatabaseConfig';

const Index = () => {
  const [activeJobs, setActiveJobs] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [successRate, setSuccessRate] = useState(95.8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DBF Migration Platform</h1>
                <p className="text-sm text-gray-600">DBF to PostgreSQL Data Transfer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected to 192.168.100.70
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeJobs}</div>
              <p className="text-xs text-gray-600">Currently processing</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalRecords.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Successfully migrated</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Database className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
              <Progress value={successRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <span>Migration Control Center</span>
            </CardTitle>
            <CardDescription>
              Upload DBF files and monitor data migration to PostgreSQL database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload">File Upload</TabsTrigger>
                <TabsTrigger value="jobs">Job Monitor</TabsTrigger>
                <TabsTrigger value="logs">System Logs</TabsTrigger>
                <TabsTrigger value="config">Database Config</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <FileUploadSection onJobStart={() => setActiveJobs(prev => prev + 1)} />
              </TabsContent>

              <TabsContent value="jobs" className="mt-6">
                <JobMonitor />
              </TabsContent>

              <TabsContent value="logs" className="mt-6">
                <SystemLogs />
              </TabsContent>

              <TabsContent value="config" className="mt-6">
                <DatabaseConfig />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
