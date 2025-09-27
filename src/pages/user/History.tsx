const History = () => {
  const logs = [
    { id: 1, type: "Emergency", garage: "QuickFix", date: "2025-09-01" },
    { id: 2, type: "Booking", garage: "Speedy Repairs", date: "2025-09-10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">History</h1>
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="p-3 border rounded bg-white">
            {log.type} with {log.garage} on {log.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
