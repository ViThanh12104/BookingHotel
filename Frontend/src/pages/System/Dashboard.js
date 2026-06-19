import React, { Component } from 'react';
import adminService from '../../services/adminService';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

import './Dashboard.scss';
import Header from '../../components/Header/Header'

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            totalUsers: 0,
            totalHotels: 0,
            totalBookings: 0,
            totalRevenue: 0,
            totalCompletedBookings: 0,
            monthlyRevenue: [],
            dailyRevenueByMonth: {},
            selectedMonthKey: '',
            revenueData: { labels: [], datasets: [] },
            bookingStatusData: { labels: [], datasets: [] }
        }
    }

    async componentDidMount() {
        await this.getDashboardData();
    }

    buildRevenueData = (dailyRevenue = []) => {
        return {
            labels: dailyRevenue.map(item => item.day),
            datasets: [{
                label: 'Doanh thu',
                data: dailyRevenue.map(item => item.revenue || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        };
    }

    getDashboardData = async () => {
        try {
            let res = await adminService.getAdminDashboard();
            if (res && res.errCode === 0) {
                const dashboardData = res.data || {};
                const monthlyRevenue = dashboardData.monthlyRevenue || [];
                const dailyRevenueByMonth = dashboardData.dailyRevenueByMonth || {};
                const bookingStatusCounts = dashboardData.bookingStatusCounts || {};
                const selectedMonthKey = monthlyRevenue.length ? monthlyRevenue[monthlyRevenue.length - 1].key : '';
                const selectedMonthlyRevenue = dailyRevenueByMonth[selectedMonthKey] || [];
                const bookingStatusMap = {
                    pending: 'Chờ duyệt',
                    confirmed: 'Đã xác nhận',
                    checked_in: 'Đang nhận phòng',
                    completed: 'Hoàn thành',
                    cancelled: 'Đã hủy'
                };
                const statusKeys = ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'];

                this.setState({
                    totalUsers: dashboardData.totalUsers || 0,
                    totalHotels: dashboardData.totalHotels || 0,
                    totalBookings: dashboardData.totalBookings || 0,
                    totalRevenue: dashboardData.totalRevenue || 0,
                    totalCompletedBookings: dashboardData.totalCompletedBookings || 0,
                    monthlyRevenue,
                    dailyRevenueByMonth,
                    selectedMonthKey,
                    revenueData: this.buildRevenueData(selectedMonthlyRevenue),
                    bookingStatusData: {
                        labels: statusKeys.map(status => bookingStatusMap[status]),
                        datasets: [{
                            label: 'Trạng thái đặt phòng',
                            data: statusKeys.map(status => bookingStatusCounts[status] || 0),
                            backgroundColor: [
                                'rgba(255, 159, 64, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 205, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(255, 99, 132, 0.6)',
                            ],
                            borderColor: [
                                'rgba(255, 159, 64, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 99, 132, 1)',
                            ],
                            borderWidth: 1,
                        }],
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleMonthChange = (event) => {
        const selectedMonthKey = event.target.value;
        const dailyRevenue = this.state.dailyRevenueByMonth[selectedMonthKey] || [];

        this.setState({
            selectedMonthKey,
            revenueData: this.buildRevenueData(dailyRevenue)
        });
    }

    render() {
        const {
            totalUsers,
            totalHotels,
            totalBookings,
            totalRevenue,
            revenueData,
            bookingStatusData
        } = this.state;

        const selectedMonthLabel = this.state.monthlyRevenue.find(item => item.key === this.state.selectedMonthKey)?.month || '';
        const revenueChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: selectedMonthLabel ? `Doanh thu ${selectedMonthLabel}` : 'Doanh thu tháng',
                },
            },
        };

        const bookingStatusChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Phân bố trạng thái đặt phòng',
                },
            },
        };

        return (
            <div>
                <Header />
                <div className="dashboard-container">
                    {/* Header */}
                    <div className="dashboard-header">
                        <h2>Bảng điều khiển khách sạn</h2>
                        <p>Chào mừng đến hệ thống quản trị</p>
                    </div>

                    {/* Cards */}
                    <div className="dashboard-cards">
                        {/* Users */}
                        <div className="dashboard-card users">
                            <div className="card-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="card-content">
                                <h3>Tổng số người dùng</h3>
                                <p>{totalUsers}</p>
                            </div>
                        </div>

                        {/* Hotels */}
                        <div className="dashboard-card hotels">
                            <div className="card-icon">
                                <i className="fas fa-hotel"></i>
                            </div>
                            <div className="card-content">
                                <h3>Tổng số khách sạn</h3>
                                <p>{totalHotels}</p>
                            </div>
                        </div>

                        {/* Bookings */}
                        <div className="dashboard-card bookings">
                            <div className="card-icon">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div className="card-content">
                                <h3>Tổng số đặt phòng</h3>
                                <p>{totalBookings}</p>
                            </div>
                        </div>

                        {/* Revenue */}
                        <div className="dashboard-card revenue">
                            <div className="card-icon">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="card-content">
                                <h3>Tổng doanh thu</h3>
                                <p>
                                    {totalRevenue ? totalRevenue.toLocaleString("vi-VN") : 0}đ
                                </p>
                                <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
                                    Dựa trên {this.state.totalCompletedBookings} booking đã hoàn thành
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="dashboard-charts">
                        <div className="chart-item">
                            <div className="chart-filter">
                                <label htmlFor="month-select">Chọn tháng:</label>
                                <select id="month-select" value={this.state.selectedMonthKey} onChange={this.handleMonthChange}>
                                    {this.state.monthlyRevenue.map(month => (
                                        <option value={month.key} key={month.key}>{month.month}</option>
                                    ))}
                                </select>
                            </div>
                            <Bar data={revenueData} options={revenueChartOptions} />
                        </div>
                        <div className="chart-item">
                            <Pie data={bookingStatusData} options={bookingStatusChartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;