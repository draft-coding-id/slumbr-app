import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-extrabold text-gray-800 md:text-6xl">
          Temukan Kualitas Tidur Terbaik Anda
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          SLUMBR membantu Anda memahami pola tidur Anda melalui kuesioner PSQI dan prediksi cerdas berbasis Machine Learning.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Mulai Sekarang
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white rounded-xl shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Bagaimana SLUMBR Bekerja?</h2>
          <p className="mt-2 text-gray-600">Tiga langkah mudah untuk tidur yang lebih baik.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto px-4">
          <div className="p-6">
            <div className="text-5xl mb-4 text-blue-500">📝</div>
            <h3 className="text-xl font-semibold mb-2">Isi Kuesioner</h3>
            <p className="text-gray-600">Jawab beberapa pertanyaan dari Pittsburgh Sleep Quality Index (PSQI) untuk menganalisis tidur Anda.</p>
          </div>
          <div className="p-6">
            <div className="text-5xl mb-4 text-blue-500">🤖</div>
            <h3 className="text-xl font-semibold mb-2">Dapatkan Prediksi</h3>
            <p className="text-gray-600">Model Machine Learning kami akan memprediksi kualitas tidur Anda secara otomatis.</p>
          </div>
          <div className="p-6">
            <div className="text-5xl mb-4 text-blue-500">💡</div>
            <h3 className="text-xl font-semibold mb-2">Terima Rekomendasi</h3>
            <p className="text-gray-600">Dapatkan saran yang dipersonalisasi untuk membantu Anda meningkatkan kualitas tidur setiap malam.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;