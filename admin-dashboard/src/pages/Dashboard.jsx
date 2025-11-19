import React, { useEffect, useState } from 'react';
import { getUsers, getEventBanners, getFeedbacks, getFloodReports } from '../services/api.js';
import CardRow from '../components/CardRow.jsx';
import { Bar } from 'react-chartjs-2';
import Panel from '../components/Panel.jsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    feedbacks: 0,
    floodReports: 0
  });
  const [feedbackStatus,setFeedbackStatus] = useState({});
  const [loading,setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, feedbackRes, floodRes] = await Promise.all([
        getUsers(),
        getEventBanners(),
        getFeedbacks(),
        getFloodReports()
      ]);

      const usersCount = usersRes.data.users?.length || 0;
      const eventsCount = eventsRes.data?.length || 0;
      const feedbacksCount = feedbackRes.data.data?.length || 0;
      const floodReportsCount = floodRes.data.data?.length || 0;

      // Tính trạng thái feedback
      const statusCount = {};
      (feedbackRes.data.data || []).forEach(f=>{
        const s = f.Status || 'Unknown';
        statusCount[s] = (statusCount[s]||0)+1;
      });

      setStats({
        users: usersCount,
        events: eventsCount,
        feedbacks: feedbacksCount,
        floodReports: floodReportsCount
      });
      setFeedbackStatus(statusCount);
    } catch(err){
      console.error(err);
      alert('Lỗi khi tải dữ liệu Dashboard');
    }
    setLoading(false);
  };

  useEffect(()=>{ loadStats(); }, []);

  // Chart dữ liệu Feedback theo trạng thái
  const feedbackChartData = {
    labels: Object.keys(feedbackStatus),
    datasets: [{
      label: 'Số Feedback',
      data: Object.values(feedbackStatus),
      backgroundColor: 'rgba(54, 162, 235, 0.6)'
    }]
  };

  const feedbackChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Feedback theo trạng thái' }
    }
  };

  if(loading) return <p style={{color:'#6b7280'}}>Đang tải Dashboard...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <CardRow cards={[
        { title: 'Users', value: stats.users },
        { title: 'Event Banners', value: stats.events },
        { title: 'Feedbacks', value: stats.feedbacks },
        { title: 'Flood Reports', value: stats.floodReports },
      ]}/>

      <Panel>
        <h3>Thống kê Feedback</h3>
        <Bar data={feedbackChartData} options={feedbackChartOptions} />
      </Panel>
    </div>
  );
}
