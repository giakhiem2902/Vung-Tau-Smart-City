import React, { useEffect, useState } from 'react';
import { getEventBanners, deleteEventBanner } from '../services/api.js';
import Panel from '../components/Panel.jsx';

export default function Events() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState('');

  useEffect(() => { loadBanners(); }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await getEventBanners();
      setBanners(res.data || []);
      setError('');
    } catch(err) { setError('Lỗi tải Event Banners'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!confirm('Bạn có chắc muốn xóa Banner này?')) return;
    try {
      await deleteEventBanner(id);
      alert('Xóa thành công!');
      loadBanners();
    } catch(err){ alert('Xóa thất bại'); }
  }

  return (
    <Panel>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
        <h2>Danh sách Event Banner</h2>
        <button className="btn" onClick={loadBanners}>Làm mới</button>
      </div>
      {loading ? <p style={{color:'#6b7280'}}>Đang tải...</p> :
       error ? <p style={{color:'red'}}>{error}</p> :
       <div style={{overflowX:'auto'}}>
         <table>
           <thead>
             <tr>
               <th>ID</th>
               <th>Title</th>
               <th>Description</th>
               <th>Image</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody>
             {banners.map(b=>(
               <tr key={b.id}>
                 <td>{b.id}</td>
                 <td>{b.title}</td>
                 <td>{b.description || ''}</td>
                 <td><img src={b.imageUrl} alt={b.title} style={{height:40}} /></td>
                 <td>
                   <button className="btn" onClick={()=>alert('Sửa Banner ID '+b.id)}>Sửa</button>
                   <button className="btn" style={{background:'#ef4444'}} onClick={()=>handleDelete(b.id)}>Xóa</button>
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
