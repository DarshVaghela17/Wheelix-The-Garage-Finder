const Profile = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Profile</h1>

    {/* User Info */}
    <div className="p-4 border rounded bg-white">
      <p><b>Name:</b> John Doe</p>
      <p><b>Email:</b> john@example.com</p>
      <p><b>Phone:</b> +123456789</p>
    </div>

    {/* Saved Vehicles */}
    <div className="p-4 border rounded bg-white">
      <h2 className="font-semibold mb-2">Saved Vehicles</h2>
      <ul>
        <li>Toyota Corolla - KA01AB1234</li>
        <li>Honda Civic - MH12XY9876</li>
      </ul>
    </div>

    {/* Settings */}
    <div className="p-4 border rounded bg-white">
      <h2 className="font-semibold mb-2">Settings</h2>
      <button className="px-4 py-2 bg-gray-200 rounded">Logout</button>
    </div>
  </div>
);

export default Profile;
