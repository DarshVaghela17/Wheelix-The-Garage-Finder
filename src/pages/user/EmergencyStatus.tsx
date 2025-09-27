const EmergencyStatus = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Emergency Status</h1>
    <div className="p-4 border rounded bg-white">
      <p>⏳ Waiting for nearby garages...</p>
      <p className="text-green-600 font-semibold">Garage X accepted ✅</p>
    </div>

    <div className="flex space-x-3">
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Chat</button>
      <button className="px-4 py-2 bg-green-600 text-white rounded">Call</button>
    </div>
  </div>
);

export default EmergencyStatus;
