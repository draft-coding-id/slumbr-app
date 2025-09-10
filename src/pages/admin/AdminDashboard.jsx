import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ClockImg from '../../assets/images/clock.png';
import DartImg from '../../assets/images/dart.png';
import LampImg from '../../assets/images/lamp.png';

const StatCard = ({ title, value, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    {loading ? (
      <p className="text-3xl font-semibold text-gray-800 mt-2">Memuat...</p>
    ) : (
      <p className="text-3xl font-semibold text-gray-800 mt-2">{value}</p>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, predictions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Ambil jumlah total pengguna
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Ambil jumlah total prediksi
      const { count: predictionCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true });

      setStats({ users: userCount, predictions: predictionCount });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className='space-y-6'>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className='bg-white p-4 rounded-lg shadow-md border border-gray-200'>
          <p className='text-gray-400'>
            <span className='text-primary font-bold'>Prediction</span> | Prediction in just seconds
          </p>
          <div className='flex gap-x-3 mt-3'>
            <div className='w-3/5 h-auto flex justify-center items-center'>
              <img src={ClockImg} alt="" className='h-20'/>
            </div>
            <div>
              <p className='text-lg font-bold text-primary'>Under 1 Seconds</p>
              <p className='text-gray-600 mt-2 text-sm'>
                <span className='text-green-700 font-semibold'>The advantages</span> of quick predictions include faster decision-making and improved user experience.
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md border border-gray-200'>
          <p className='text-gray-400'>
            <span className='text-primary font-bold'>Accuracy</span> | Prediction model accuracy
          </p>
          <div className='flex gap-x-3 mt-3'>
            <div className='w-3/5 h-auto flex justify-center items-center'>
              <img src={DartImg} alt="" className='h-20'/>
            </div>
            <div>
              <p className='text-lg font-bold text-primary'>Accuracy 88%</p>
              <p className='text-gray-600 mt-2 text-sm'>
                <span className='text-green-700 font-semibold'>Ability to identify</span> sleep patterns effectively.
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md border border-gray-200'>
          <p className='text-gray-400'>
            <span className='text-primary font-bold'>How</span> | How It Works
          </p>
          <div className='flex gap-x-3 mt-3'>
            <div className='w-3/5 h-auto flex justify-center items-center'>
              <img src={LampImg} alt="" className='h-20'/>
            </div>
            <div>
              <p className='text-lg font-bold text-primary'>Click "Smart Prediction"</p>
              <p className='text-gray-600 mt-2 text-sm'>
                <span className='text-green-700 font-semibold'>Fill out</span> the PSQI questionnaire to get your sleep quality prediction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Rekomendasi Hasil Prediksi</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tab untuk Kualitas Tidur Baik */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <h3 className="text-xl font-semibold text-green-800">Kualitas Tidur Baik</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-md border border-green-100">
                  <h4 className="font-semibold text-green-700 mb-2">✓ Pertahankan Rutinitas</h4>
                  <p className="text-sm text-gray-600">Teruskan jadwal tidur yang konsisten dan kebiasaan sehat yang sudah Anda jalani.</p>
                </div>
                <div className="bg-white p-4 rounded-md border border-green-100">
                  <h4 className="font-semibold text-green-700 mb-2">✓ Optimalisasi Lingkungan</h4>
                  <p className="text-sm text-gray-600">Pastikan kamar tidur tetap sejuk, gelap, dan tenang untuk kualitas tidur optimal.</p>
                </div>
                <div className="bg-white p-4 rounded-md border border-green-100">
                  <h4 className="font-semibold text-green-700 mb-2">✓ Monitor Berkelanjutan</h4>
                  <p className="text-sm text-gray-600">Lakukan evaluasi berkala untuk memastikan kualitas tidur tetap terjaga.</p>
                </div>
              </div>
            </div>

            {/* Tab untuk Kualitas Tidur Buruk */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <h3 className="text-xl font-semibold text-red-800">Kualitas Tidur Buruk</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-md border border-red-100">
                  <h4 className="font-semibold text-red-700 mb-2">⚠ Perbaiki Jadwal Tidur</h4>
                  <p className="text-sm text-gray-600">Tetapkan waktu tidur dan bangun yang konsisten setiap hari, termasuk akhir pekan.</p>
                </div>
                <div className="bg-white p-4 rounded-md border border-red-100">
                  <h4 className="font-semibold text-red-700 mb-2">⚠ Hindari Stimulan</h4>
                  <p className="text-sm text-gray-600">Kurangi kafein, alkohol, dan layar gadget minimal 2 jam sebelum tidur.</p>
                </div>
                <div className="bg-white p-4 rounded-md border border-red-100">
                  <h4 className="font-semibold text-red-700 mb-2">⚠ Konsultasi Ahli</h4>
                  <p className="text-sm text-gray-600">Pertimbangkan untuk berkonsultasi dengan dokter jika masalah tidur berlanjut.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Umum */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">💡 Tips Umum untuk Tidur Berkualitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md border border-blue-100">
                <h4 className="font-semibold text-blue-700 mb-2">Relaksasi</h4>
                <p className="text-sm text-gray-600">Praktikkan teknik relaksasi seperti meditasi atau pernapasan dalam sebelum tidur.</p>
              </div>
              <div className="bg-white p-4 rounded-md border border-blue-100">
                <h4 className="font-semibold text-blue-700 mb-2">Olahraga Teratur</h4>
                <p className="text-sm text-gray-600">Lakukan aktivitas fisik secara teratur, namun hindari olahraga berat menjelang tidur.</p>
              </div>
              <div className="bg-white p-4 rounded-md border border-blue-100">
                <h4 className="font-semibold text-blue-700 mb-2">Pola Makan</h4>
                <p className="text-sm text-gray-600">Hindari makan besar dan minum berlebihan 2-3 jam sebelum waktu tidur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pengguna" value={stats.users} loading={loading} />
        <StatCard title="Total Prediksi" value={stats.predictions} loading={loading} />
      </div> */}
      
    </div>
  );
};

export default AdminDashboard;