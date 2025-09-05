import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

export interface ParsedData {
  headers: string[];
  rows: any[][];
  fileName: string;
  fileSize: number;
  rowCount: number;
}

interface FileUploadProps {
  onDataParsed: (data: ParsedData) => void;
  onError: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  loading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onDataParsed,
  onError,
  acceptedFileTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  loading = false,
}) => {
  const parseFile = useCallback(async (file: File) => {
    try {
      const fileExtension = file.name.toLowerCase().split('.').pop();
      let parsedData: ParsedData;

      if (fileExtension === 'csv') {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = lines.slice(1).map(line => 
          line.split(',').map(cell => cell.trim().replace(/"/g, ''))
        );

        parsedData = {
          headers,
          rows,
          fileName: file.name,
          fileSize: file.size,
          rowCount: rows.length,
        };
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        const headers = jsonData[0] || [];
        const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));

        parsedData = {
          headers: headers.map(h => String(h || '')),
          rows,
          fileName: file.name,
          fileSize: file.size,
          rowCount: rows.length,
        };
      } else {
        throw new Error('不支持的文件格式');
      }

      onDataParsed(parsedData);
    } catch (error) {
      onError(error instanceof Error ? error.message : '文件解析失败');
    }
  }, [onDataParsed, onError]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > maxFileSize) {
        onError(`文件大小不能超过 ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        return;
      }
      parseFile(file);
    }
  }, [parseFile, maxFileSize, onError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: loading,
  });

  const getBorderColor = () => {
    if (isDragReject) return '#EF4444';
    if (isDragActive) return '#6366F1';
    return '#D1D5DB';
  };

  const getBackgroundColor = () => {
    if (isDragReject) return 'rgba(239, 68, 68, 0.05)';
    if (isDragActive) return 'rgba(99, 102, 241, 0.05)';
    return 'rgba(249, 250, 251, 0.8)';
  };

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 4,
        borderRadius: 3,
        border: `2px dashed ${getBorderColor()}`,
        backgroundColor: getBackgroundColor(),
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'center',
        position: 'relative',
        '&:hover': {
          borderColor: loading ? getBorderColor() : '#6366F1',
          backgroundColor: loading ? getBackgroundColor() : 'rgba(99, 102, 241, 0.05)',
        },
      }}
    >
      <input {...getInputProps()} />
      
      {loading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <LinearProgress sx={{ borderRadius: '12px 12px 0 0' }} />
        </Box>
      )}

      <Box sx={{ opacity: loading ? 0.5 : 1 }}>
        <UploadIcon
          sx={{
            fontSize: 48,
            color: isDragReject ? '#EF4444' : '#6366F1',
            mb: 2,
          }}
        />

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: isDragReject ? '#EF4444' : '#1F2937',
          }}
        >
          {isDragActive
            ? '释放文件到这里'
            : isDragReject
            ? '不支持的文件格式'
            : loading
            ? '正在解析文件...'
            : '拖拽文件到这里或点击上传'
          }
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          支持 CSV、Excel 格式，最大 {Math.round(maxFileSize / 1024 / 1024)}MB
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          {acceptedFileTypes.map((type) => (
            <Chip
              key={type}
              label={type.toUpperCase()}
              size="small"
              variant="outlined"
              sx={{
                borderColor: '#6366F1',
                color: '#6366F1',
                fontSize: '0.75rem',
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default FileUpload;
