export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-5xl font-bold mb-4">
        DisasterIQ
      </h1>

      <p className="text-xl mb-8">
        AI-Powered Disaster Response Platform
      </p>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-96">
        <p className="mb-2">🌍 Active Disasters: 3</p>
        <p className="mb-2">📦 Resources Available: 5200</p>
        <p className="mb-2">👥 Volunteers: 47</p>
      </div>
    </main>
  );
}