import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SystemReports = () => {
    const { user } = useAuth();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState('system-overview');
    const reportRef = useRef();

    const token = localStorage.getItem('token');

    const fetchReport = async (reportType) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/reports/${reportType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReportData(data);
                toast.success('Report generated successfully');
            } else {
                toast.error('Failed to generate report');
                setReportData(null);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            toast.error('Failed to fetch report');
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport(selectedReport);
    }, [selectedReport]);

    const handleReportChange = (reportType) => {
        setSelectedReport(reportType);
    };

    const exportToPDF = async () => {
        if (!reportData || !reportRef.current) {
            toast.error('No report data to export');
            return;
        }

        try {
            toast.info('Generating PDF... Please wait');
            
            // Create a clone of the report element to modify for PDF
            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                scale: 1.5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: element.scrollWidth,
                height: element.scrollHeight
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            // Calculate dimensions to fit the page
            const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 40) / imgHeight);
            const scaledWidth = imgWidth * ratio;
            const scaledHeight = imgHeight * ratio;
            const imgX = (pdfWidth - scaledWidth) / 2;
            const imgY = 20;

            // Add the image to PDF
            pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);

            // Add footer with metadata
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generated on: ${new Date().toLocaleString()} | Report Type: ${selectedReport}`, 10, pdfHeight - 5);
            pdf.text(`User: ${user?.role || 'Unknown'} | Page 1 of 1`, pdfWidth - 60, pdfHeight - 5);

            // Save the PDF
            const fileName = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            toast.success('PDF exported successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    const exportToJSON = () => {
        if (!reportData) return;
        
        const reportContent = JSON.stringify(reportData, null, 2);
        const blob = new Blob([reportContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('JSON report exported successfully');
    };

    const renderSystemOverviewReport = () => {
        if (!reportData) return null;

        const { systemStatistics, userRoleDistribution, branchStatistics, departmentStatistics, recentActivity, performanceMetrics } = reportData;

        return (
            <div className="space-y-6">
                {/* System Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <span className="text-xl">👥</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {systemStatistics?.totalUsers || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <span className="text-xl">🏢</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Branches</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {systemStatistics?.totalBranches || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <span className="text-xl">👷</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Employees</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {systemStatistics?.totalEmployees || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <span className="text-xl">📊</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">System Health</p>
                                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                                    {performanceMetrics?.systemUptime || 'Good'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Role Distribution */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        User Role Distribution
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(userRoleDistribution || {}).map(([role, count]) => (
                            <div key={role} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                    {role.toLowerCase()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Branch Statistics */}
                {branchStatistics?.branchEmployeeCounts && Object.keys(branchStatistics.branchEmployeeCounts).length > 0 && (
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Branch Employee Distribution
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(branchStatistics.branchEmployeeCounts).map(([branch, count]) => (
                                <div key={branch} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">{branch}</span>
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm font-semibold">
                                        {count} employees
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Department Statistics */}
                {departmentStatistics?.departmentEmployeeCounts && Object.keys(departmentStatistics.departmentEmployeeCounts).length > 0 && (
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Department Employee Distribution
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(departmentStatistics.departmentEmployeeCounts).map(([dept, count]) => (
                                <div key={dept} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">{dept}</span>
                                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-sm font-semibold">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Performance Metrics */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        System Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">System Uptime</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {performanceMetrics?.systemUptime || 'N/A'}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {performanceMetrics?.avgResponseTime || 'N/A'}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Connections</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {performanceMetrics?.activeConnections || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-xl mr-3">👤</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Recent Users</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {recentActivity?.recentUsers || 0} new users registered
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <span className="text-xl mr-3">📅</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Last Registration</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {recentActivity?.lastUserRegistration || 'No recent registrations'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            System Reports
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {user?.role === 'OWNER' ? 'Business analytics and insights for all branches' : 'Comprehensive system analytics and insights'}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={exportToPDF}
                            disabled={!reportData || loading}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                            <span className="mr-2">📄</span>
                            Export PDF
                        </button>
                        <button
                            onClick={exportToJSON}
                            disabled={!reportData || loading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                            <span className="mr-2">📥</span>
                            Export JSON
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Type Selector */}
            <div className="mb-6">
                <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => handleReportChange('system-overview')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                            selectedReport === 'system-overview'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        System Overview
                    </button>
                    <button
                        onClick={() => handleReportChange('user-analytics')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                            selectedReport === 'user-analytics'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        User Analytics
                    </button>
                    <button
                        onClick={() => handleReportChange('employee-demographics')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                            selectedReport === 'employee-demographics'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Employee Demographics
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="min-h-96" ref={reportRef}>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Generating report...</span>
                    </div>
                ) : reportData ? (
                    <div className="bg-white p-6 rounded-lg" style={{ backgroundColor: '#ffffff' }}>
                        <div className="mb-6 text-center border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {reportData.reportTitle || 'System Report'}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Generated on: {reportData.systemStatistics?.generatedAt || reportData.generatedAt || new Date().toLocaleString()}
                            </p>
                            <p className="text-gray-600">
                                Report Type: {selectedReport.replace('-', ' ').toUpperCase()}
                            </p>
                        </div>
                        
                        {selectedReport === 'system-overview' && renderSystemOverviewReport()}
                        {selectedReport === 'user-analytics' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">User Analytics Report</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <pre className="text-sm overflow-auto">
                                        {JSON.stringify(reportData, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                        {selectedReport === 'employee-demographics' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">Employee Demographics Report</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <pre className="text-sm overflow-auto">
                                        {JSON.stringify(reportData, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Failed to load report data</p>
                        <button
                            onClick={() => fetchReport(selectedReport)}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Report Metadata */}
            {reportData && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Report Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Report Type</p>
                            <p className="font-medium text-gray-900 dark:text-white">{reportData.reportType}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Generated At</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {reportData.systemStatistics?.generatedAt || new Date().toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Report Title</p>
                            <p className="font-medium text-gray-900 dark:text-white">{reportData.reportTitle}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Data Scope</p>
                            <p className="font-medium text-gray-900 dark:text-white">All Branches</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemReports;
