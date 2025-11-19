import React, { useEffect, useState } from 'react';
import { getFloodReports, reviewFloodReport } from '../services/api.js';
import Panel from '../components/Panel.jsx';

export default function FloodReports() {
  const [reports,setReports] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [status,setStatus] = useState('');

  const loadReports = async () => {
    setLoading(true);
    try{
      const res = await getFloodReports(status);
      setReports(res.data.data || []);
      setError('');
    }catch(err){ setError('Lỗi tải Flood Reports'); }
    setLoading(false);
  }

  const handleReview = async (id,newStatus) => {
    const note = prompt('Ghi chú admin (tùy chọn):','');
    try{
      await reviewFloodReport(id,newStatus,note);
      alert('Cập nhật thành công!');
      loadReports();
    }catch(err){ alert('Lỗi cập nhật'); }
  }

  useEffect(()=>{ loadReports(); }, [status]);

  return (
    <Panel>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
        <h2>Quản lý Flood Reports</h2>
        <button className="btn" onClick={loadReports}>Làm mới</button>
      </div>
      <label>
        Filter trạng thái:
        <select value={status} onChange={e=>setStatus(e.target.value)}
                style={{marginLeft:8,padding:6,borderRadius:6,border:'1px solid #ccc'}}>
          <option value="">Tất cả</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Approved">Đã duyệt</option>
          <option value="Rejected">Từ chối</option>
        </select>
      </label>
      {loading ? <p style={{color:'#6b7280'}}>Đang tải...</p> :
       error ? <p style={{color:'red'}}>{error}</p> :
       <div style={{overflowX:'auto', marginTop:12}}>
         <table>
           <thead>
             <tr>
               <th>ID</th><th>Title</th><th>Status</th><th>User</th><th>Hành động</th>
             </tr>
           </thead>
           <tbody>
             {reports.map(r=>(
               <tr key={r.id}>
                 <td>{r.id}</td>
                 <td>{r.title}</td>
                 <td>{r.status}</td>
                 <td>{r.User?.FullName || '-'}</td>
                 <td>
                   {r.status==='Pending' && <>
                     <button className="btn" onClick={()=>handleReview(r.id,'Approved')}>✅ Duyệt</button>
                     <button className="btn" style={{background:'#ef4444'}} onClick={()=>handleReview(r.id,'Rejected')}>❌ Từ chối</button>
                   </>}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
      }
    </Panel>
  );
}
