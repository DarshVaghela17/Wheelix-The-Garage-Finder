const GarageList = () => {
  const garages = [
    { id: 1, name: "QuickFix Garage", rating: 4.5, distance: "2km" },
    { id: 2, name: "Speedy Repairs", rating: 4.2, distance: "5km" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Garages</h1>
      <div className="space-y-4">
        {garages.map((g) => (
          <div key={g.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="font-semibold">{g.name}</h2>
            <p>⭐ {g.rating} | 📍 {g.distance}</p>

            {/* Quick actions */}
            <div className="mt-2 flex space-x-3">
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                Navigate
              </button>
              <button className="px-3 py-1 bg-green-500 text-white rounded">
                Video Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GarageList;
