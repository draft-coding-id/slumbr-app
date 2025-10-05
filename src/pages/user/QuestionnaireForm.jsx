import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { predictionApiUrl } from '../../lib/config';

// Komponen helper untuk setiap pertanyaan agar lebih rapi
const Question = ({ number, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">{number}</span>
      {title}
    </h3>
    <div className="space-y-4 pl-11">{children}</div>
  </div>
);

const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State untuk menyimpan semua jawaban form
  const [answers, setAnswers] = useState({
    jenis_kelamin: '',
    no_telepon: '',
    angkatan: '',
    program_studi: '',
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5_1: null,
    p5_2: null,
    p5_3: null,
    p5_4: null,
    p5_5: null,
    p5_6: null,
    p5_7: null,
    p5_8: null,
    p5_9: null,
    p5_10: null,
    answer_p5_10: '',
    p6: null,
    p7: null,
    p8: null,
    p9: null,
  });

  // Handler untuk memperbarui state jawaban
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setAnswers(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Kirim data ke API Machine Learning Anda
      const predictionResponse = await fetch(predictionApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          P1: answers.p1 + ":00",
          P2: answers.p2,
          P3: answers.p3 + ":00",
          P4: answers.p4,
          P5_1: parseInt(answers.p5_1),
          P5_2: parseInt(answers.p5_2),
          P5_3: parseInt(answers.p5_3),
          P5_4: parseInt(answers.p5_4),
          P5_5: parseInt(answers.p5_5),
          P5_6: parseInt(answers.p5_6),
          P5_7: parseInt(answers.p5_7),
          P5_8: parseInt(answers.p5_8),
          P5_9: parseInt(answers.p5_9),
          P5_10: parseInt(answers.p5_10),
          P6: parseInt(answers.p6),
          P7: parseInt(answers.p7),
          P8: parseInt(answers.p8),
          P9: parseInt(answers.p9)
        })
      });

      if (!predictionResponse.ok) {
        throw new Error('Gagal mendapatkan prediksi dari server.');
      }

      const predictionResult = await predictionResponse.json();

      // 2. Ambil data user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User tidak ditemukan. Silakan login kembali.');
      }

      // 3. Simpan hasil ke database Supabase
      const { error: insertError } = await supabase
        .from('predictions')
        .insert([{
          user_id: user.id,
          jenis_kelamin: answers.jenis_kelamin,
          no_telepon: answers.no_telepon,
          angkatan: answers.angkatan,
          program_studi: answers.program_studi,
          p1_usual_bed_time: answers.p1,
          p2_sleep_latency: answers.p2,
          p3_usual_wake_time: answers.p3,
          p4_sleep_duration: answers.p4,
          p5_1: answers.p5_1,
          p5_2: answers.p5_2,
          p5_3: answers.p5_3,
          p5_4: answers.p5_4,
          p5_5: answers.p5_5,
          p5_6: answers.p5_6,
          p5_7: answers.p5_7,
          p5_8: answers.p5_8,
          p5_9: answers.p5_9,
          p5_10: answers.p5_10,
          answer_p5_10: answers.answer_p5_10,
          p6: answers.p6,
          p7: answers.p7,
          p8: answers.p8,
          p9: answers.p9,
          predicted_result: predictionResult.kualitas_tidur_prediksi,
          c1: predictionResult.scores.C1,
          c2: predictionResult.scores.C2,
          c3: predictionResult.scores.C3,
          c4: predictionResult.scores.C4,
          c5: predictionResult.scores.C5,
          c6: predictionResult.scores.C6,
          c7: predictionResult.scores.C7,
          highest_score_component: predictionResult.komponen_tertinggi
        }]);

      if (insertError) {
        throw insertError;
      }

      // 4. Arahkan ke hasil
      alert('Kuesioner berhasil dikirim! Menganalisis hasil Anda...');
      navigate('/hasil');

    } catch (error) {
      setError(error.message);
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const radioOptions = [
    { label: 'Tidak Pernah', value: 0 },
    { label: 'Kurang dari sekali seminggu', value: 1 },
    { label: 'Sekali atau dua kali seminggu', value: 2 },
    { label: 'Tiga kali atau lebih seminggu', value: 3 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Kuesioner Kualitas Tidur</h1>
      <p className="text-gray-600 mb-8">Mohon jawab semua pertanyaan berdasarkan kebiasaan Anda selama satu bulan terakhir.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            NIM
          </h3>
          <div className="space-y-4">
            <input type="text" name="nim" value={answers.nim} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" />
          </div>
        </div> */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Jenis Kelamin
          </h3>
          <div className="space-y-4">
            <select name="jenis_kelamin" value={answers.jenis_kelamin} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md">
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            No. Telepon
          </h3>
          <div className="space-y-4">
            <input type="text" name="no_telepon" value={answers.no_telepon} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Angkatan
          </h3>
          <div className="space-y-4">
            <select name="angkatan" value={answers.angkatan} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md">
              <option value="" disabled>Pilih Angkatan</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Program Studi
          </h3>
          <div className="space-y-4">
            <select name="program_studi" value={answers.program_studi} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md">
              <option value="" disabled>Pilih Program Studi</option>
              <option value="S1 Sistem Informasi">S1 Sistem Informasi</option>
              <option value="S1 Informatika">S1 Informatika</option>
              <option value="S1 Sains Data">S1 Sains Data</option>
              <option value="D3 Sistem Informasi">D3 Sistem Informasi</option>
            </select>
          </div>
        </div>

        <Question number="1" title="Biasanya pukul berapa Anda pergi tidur?">
          <input type="time" name="p1" value={answers.p1} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" />
        </Question>

        <Question number="2" title="Biasanya berapa menit yang Anda perlukan sampai Anda tertidur?">
          <input type="number" name="p2" value={answers.p2} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" placeholder="Contoh: 30" />
        </Question>

        <Question number="3" title="Biasanya pukul berapa Anda bangun?">
          <input type="time" name="p3" value={answers.p3} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" />
        </Question>
        
        <Question number="4" title="Berapa jam Anda tidur setiap malam? (Bisa desimal)">
          <input type="number" step="0.1" name="p4" value={answers.p4} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" placeholder="Contoh: 7.5" />
        </Question>
        
        <Question number="5A" title="Seberapa sering Anda mengalami hal-hal berikut yang mengganggu tidur Anda?">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_1"
                  value={String(opt.value)}
                  checked={String(answers.p5_1) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5B" title="Terbangun di tengah malam atau dini hari">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_2"
                  value={String(opt.value)}
                  checked={String(answers.p5_2) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5C" title="Harus bangun untuk menggunakan kamar mandi">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_3"
                  value={String(opt.value)}
                  checked={String(answers.p5_3) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5D" title="Tidak bisa bernapas dengan nyaman">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_4"
                  value={String(opt.value)}
                  checked={String(answers.p5_4) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5E" title="Batuk atau mendengkur dengan keras">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_5"
                  value={String(opt.value)}
                  checked={String(answers.p5_5) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5F" title="Merasa terlalu dingin">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_6"
                  value={String(opt.value)}
                  checked={String(answers.p5_6) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5G" title="Merasa terlalu panas">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_7"
                  value={String(opt.value)}
                  checked={String(answers.p5_7) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5H" title="Mimpi buruk">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_8"
                  value={String(opt.value)}
                  checked={String(answers.p5_8) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5I" title="Merasa nyeri">
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_9"
                  value={String(opt.value)}
                  checked={String(answers.p5_9) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>
        <Question number="5J" title="Alasan lainnya">
          <input type="text" name="answer_p5_10" value={answers.answer_p5_10} onChange={handleChange} required className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" placeholder="Gangguan tidur Anda yang lain" />
          <div className="space-y-4">
            {radioOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name="p5_10"
                  value={String(opt.value)}
                  checked={String(answers.p5_10) === String(opt.value)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Question>

        <Question number="6" title="Bagaimana Anda menilai kualitas tidur Anda secara keseluruhan?">
             <label className="flex items-center"><input type="radio" name="p6" value="0" checked={String(answers.p6) === "0"} onChange={handleChange} className="mr-2"/>Sangat Baik</label>
             <label className="flex items-center"><input type="radio" name="p6" value="1" checked={String(answers.p6) === "1"} onChange={handleChange} className="mr-2"/>Cukup Baik</label>
             <label className="flex items-center"><input type="radio" name="p6" value="2" checked={String(answers.p6) === "2"} onChange={handleChange} className="mr-2"/>Cukup Buruk</label>
             <label className="flex items-center"><input type="radio" name="p6" value="3" checked={String(answers.p6) === "3"} onChange={handleChange} className="mr-2"/>Sangat Buruk</label>
        </Question>
        <Question number="7" title="Dalam satu bulan ke belakang, berapa kali Anda mengonsumsi obat untuk membantu Anda tidur?">
             <label className="flex items-center"><input type="radio" name="p7" value="0" checked={String(answers.p7) === "0"} onChange={handleChange} className="mr-2"/>Tidak pernah</label>
             <label className="flex items-center"><input type="radio" name="p7" value="1" checked={String(answers.p7) === "1"} onChange={handleChange} className="mr-2"/>Kurang dari sekali seminggu</label>
             <label className="flex items-center"><input type="radio" name="p7" value="2" checked={String(answers.p7) === "2"} onChange={handleChange} className="mr-2"/>Sekali atau dua kali seminggu</label>
             <label className="flex items-center"><input type="radio" name="p7" value="3" checked={String(answers.p7) === "3"} onChange={handleChange} className="mr-2"/>Tiga kali atau lebih seminggu</label>
        </Question>
        <Question number="8" title="Dalam kurun waktu satu bulan ke belakang, seberapa sering Anda mengalami kesulitan melakukan aktivitas sehari-hari (mengemudi, makan, atau beraktivitas sosial)?">
             <label className="flex items-center"><input type="radio" name="p8" value="0" checked={String(answers.p8) === "0"} onChange={handleChange} className="mr-2"/>Tidak ada masalah sama sekali</label>
             <label className="flex items-center"><input type="radio" name="p8" value="1" checked={String(answers.p8) === "1"} onChange={handleChange} className="mr-2"/>Hanya sedikit menjadi masalah</label>
             <label className="flex items-center"><input type="radio" name="p8" value="2" checked={String(answers.p8) === "2"} onChange={handleChange} className="mr-2"/>Cukup menjadi masalah</label>
             <label className="flex items-center"><input type="radio" name="p8" value="3" checked={String(answers.p8) === "3"} onChange={handleChange} className="mr-2"/>Masalah besar</label>
        </Question>
        <Question number="9" title="Dalam kurun waktu satu bulan ke belakang, seberapa masalah bagi Anda untuk tetap bersemangat dalam melakukan sesuatu?">
             <label className="flex items-center"><input type="radio" name="p9" value="0" checked={String(answers.p9) === "0"} onChange={handleChange} className="mr-2"/>Sangat baik</label>
             <label className="flex items-center"><input type="radio" name="p9" value="1" checked={String(answers.p9) === "1"} onChange={handleChange} className="mr-2"/>Cukup Baik</label>
             <label className="flex items-center"><input type="radio" name="p9" value="2" checked={String(answers.p9) === "2"} onChange={handleChange} className="mr-2"/>Cukup buruk</label>
             <label className="flex items-center"><input type="radio" name="p9" value="3" checked={String(answers.p9) === "3"} onChange={handleChange} className="mr-2"/>Sangat buruk</label>
        </Question>


        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Mengirim...' : 'Selesai & Lihat Hasil'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireForm;