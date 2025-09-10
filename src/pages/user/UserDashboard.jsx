import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ClockImg from '../../assets/images/clock.png';
import DartImg from '../../assets/images/dart.png';
import LampImg from '../../assets/images/lamp.png';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil data user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // 2. Ambil data prediksi terakhir dari user tersebut
        const { data: predictionData, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single(); // .single() untuk mengambil satu objek, bukan array

        if (error && error.code !== 'PGRST116') { // Abaikan error jika tidak ada baris ditemukan
          console.error('Error fetching prediction:', error);
        } else {
          setLastPrediction(predictionData);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return <div className="text-center p-12">Memuat data dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Sambutan */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Selamat Datang!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Siap untuk memulai perjalanan tidur sehat Anda, {user?.user_metadata.full_name}?
        </p>
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Riwayat Prediksi Terakhir</h2>
          {lastPrediction ? (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Prediksi</p>
                  <p className="font-medium text-gray-700">{formatDate(lastPrediction.created_at)}</p>
                </div>
                <span 
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    lastPrediction.predicted_result === 'Baik' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lastPrediction.predicted_result}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800">Kualitas Tidur: {lastPrediction.predicted_result}</h3>
                <p className="text-gray-600 mt-2">
                  Rekomendasi utama kami berdasarkan hasil ini adalah untuk fokus pada <span className="font-semibold">{lastPrediction.highest_score_component || 'konsistensi jadwal tidur'}.</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center border border-dashed">
              <h3 className="text-xl font-semibold text-gray-700">Belum Ada Riwayat</h3>
              <p className="text-gray-500 mt-2">Anda belum pernah mengisi kuesioner. Mulai sekarang untuk melihat hasilnya di sini.</p>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 h-full flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Mulai Tes Baru</h2>
            <p className="text-gray-600 mb-6">
              Isi kuesioner PSQI untuk mendapatkan analisis dan rekomendasi terbaru mengenai pola tidur Anda.
            </p>
            <Link 
              to="/kuesioner"
              className="w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Mulai Test
            </Link>
          </div>
        </div>
      </div>

      {/* Informasi Rekomendasi Tentang Hasil Prediksi */}
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
    </div>
  );
};

export default UserDashboard;