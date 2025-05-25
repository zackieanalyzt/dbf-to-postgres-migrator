import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, XCircle, PlayCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MigrationJob {
  id: string;
  filename: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  recordsTotal: number;
  recordsProcessed: number;
  startTime: string;
  endTime?: string;
  errorMessage?: string;
}

const JobMonitor = () => {
  const [jobs, setJobs] = useState<MigrationJob[]>([
    {
      id: 'job-001',
      filename: 'patient_data_2024.dbf',
      status: 'completed',
      progress: 100,
      recordsTotal: 1250,
      recordsProcessed: 1250,
      startTime: '2025-01-20 14:30:15',
      endTime: '2025-01-20 14:32:45'
    },
    {
      id: 'job-002',
      filename: 'ipd_records_jan.dbf',
      status: 'running',
      progress: 75,
      recordsTotal: 890,
      recordsProcessed: 668,
      startTime: '2025-01-20 15:45:20'
    },
    {
      id: 'job-003',
      filename: 'old_database.dbf',
      status: 'failed',
      progress: 45,
      recordsTotal: 2100,
      recordsProcessed: 945,
      startTime: '2025-01-20 13:15:10',
      errorMessage: 'Database connection timeout'
    },
    {
      id: 'job-004',
      filename: 'backup_data.dbf',
      status: 'pending',
      progress: 0,
      recordsTotal: 0,
      recordsProcessed: 0,
      startTime: '2025-01-20 16:00:00'
    }
  ]);

  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refreshJobs = () => {
    // Simulate updating running jobs
    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.status === 'running' && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 10, 100);
          const newRecordsProcessed = Math.floor((newProgress / 100) * job.recordsTotal);
          
          return {
            ...job,
            progress: newProgress,
            recordsProcessed: newRecordsProcessed,
            ...(newProgress >= 100 && {
              status: 'completed' as const,
              endTime: new Date().toLocaleString('sv-SE').replace('T', ' ')
            })
          };
        }
        return job;
      })
    );
    setLastRefresh(new Date());
  };

  const retryJob = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId
          ? {
              ...job,
              status: 'running' as const,
              progress: 0,
              recordsProcessed: 0,
              startTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
              endTime: undefined,
              errorMessage: undefined
            }
          : job
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(refreshJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'running':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'outline',
      running: 'default',
      completed: 'secondary',
      failed: 'destructive'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const calculateDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Migration Jobs</h3>
          <p className="text-sm text-gray-600">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button
          onClick={refreshJobs}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {jobs.filter(j => j.status === 'pending').length}
            </div>
            <p className="text-sm text-yellow-700">Pending</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {jobs.filter(j => j.status === 'running').length}
            </div>
            <p className="text-sm text-blue-700">Running</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter(j => j.status === 'completed').length}
            </div>
            <p className="text-sm text-green-700">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {jobs.filter(j => j.status === 'failed').length}
            </div>
            <p className="text-sm text-red-700">Failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job History</CardTitle>
          <CardDescription>
            Detailed status of all migration jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.filename}</div>
                      <div className="text-sm text-gray-500">Job ID: {job.id}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      {getStatusBadge(job.status)}
                    </div>
                    {job.errorMessage && (
                      <div className="text-xs text-red-600 mt-1">{job.errorMessage}</div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      <Progress value={job.progress} className="h-2" />
                      <div className="text-sm text-gray-600">{job.progress.toFixed(1)}%</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>{job.recordsProcessed.toLocaleString()} / {job.recordsTotal.toLocaleString()}</div>
                      {job.recordsTotal > 0 && (
                        <div className="text-gray-500">
                          {((job.recordsProcessed / job.recordsTotal) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>Started: {job.startTime}</div>
                      <div className="text-gray-500">
                        Duration: {calculateDuration(job.startTime, job.endTime)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {job.status === 'failed' && (
                      <Button
                        onClick={() => retryJob(job.id)}
                        size="sm"
                        variant="outline"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobMonitor;
