const Home = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Nearby Garages</h1>

    {/* Map Placeholder */}
    <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
      GPS Map (nearby garages)
    </div>

    {/* Search / Filters */}
    <div className="mt-4 flex space-x-2">
      <input
        className="border rounded px-3 py-2 flex-1"
        placeholder="Search services..."
      />
      <select
        className="border rounded px-3 py-2"
        aria-label="Select search radius"
      >
        <option>Radius: 5km</option>
        <option>Radius: 10km</option>
        <option>Radius: 20km</option>
      </select>
    </div>

    {/* Emergency Button */}
    <button className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-bold">
      🚨 Emergency Assistance
    </button>
  </div>
);

export default Home;
