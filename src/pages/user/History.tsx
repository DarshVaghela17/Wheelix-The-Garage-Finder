import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Download,
  Filter,
  Search,
} from "lucide-react";

const History = () => {
  const [filter, setFilter] = useState("all");

  const logs = [
    {
      id: 1,
      type: "emergency",
      garage: "QuickFix Auto",
      service: "Tow Service",
      date: "2025-09-01",
      time: "3:30 PM",
      status: "completed",
      amount: "$75",
      rating: 5,
      location: "Highway 101",
    },
    {
      id: 2,
      type: "booking",
      garage: "Speedy Repairs",
      service: "Oil Change",
      date: "2025-09-10",
      time: "10:00 AM",
      status: "completed",
      amount: "$45",
      rating: 4,
      location: "Main Street",
    },
    {
      id: 3,
      type: "booking",
      garage: "AutoCare Pro",
      service: "Engine Repair",
      date: "2025-09-15",
      time: "2:00 PM",
      status: "cancelled",
      amount: "$120",
      rating: 0,
      location: "Downtown",
    },
    {
      id: 4,
      type: "emergency",
      garage: "QuickFix Auto",
      service: "Battery Jump",
      date: "2025-09-20",
      time: "8:45 AM",
      status: "completed",
      amount: "$35",
      rating: 5,
      location: "Park Avenue",
    },
  ];

  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.type === filter);

  const handleViewDetails = (id: number) => {
    toast.info(`Viewing details for service #${id}`);
  };

  const handleDownloadReceipt = (id: number) => {
    toast.success(`Downloading receipt for service #${id}`);
  };

  const handleRateService = (id: number) => {
    toast.info(`Rating service #${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-3">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                className={`rounded-xl ${
                  filter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }`}
              >
                All History
              </Button>
              <Button
                onClick={() => setFilter("booking")}
                variant={filter === "booking" ? "default" : "outline"}
                className={`rounded-xl ${
                  filter === "booking"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bookings
              </Button>
              <Button
                onClick={() => setFilter("emergency")}
                variant={filter === "emergency" ? "default" : "outline"}
                className={`rounded-xl ${
                  filter === "emergency"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergencies
              </Button>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-2"
              onClick={() => toast.info("Downloading all history")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Items */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card
            key={log.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      log.type === "emergency"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {log.type === "emergency" ? (
                      <AlertTriangle className="w-7 h-7 text-red-600" />
                    ) : (
                      <Calendar className="w-7 h-7 text-blue-600" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {log.garage}
                        </h3>
                        <p className="text-gray-700 font-medium mb-2">
                          {log.service}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {log.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {log.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {log.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    {log.rating > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < log.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => handleViewDetails(log.id)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReceipt(log.id)}
                        className="rounded-xl border-2"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>
                      {log.status === "completed" && log.rating === 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRateService(log.id)}
                          className="rounded-xl border-2"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Amount */}
                <div className="text-right">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
                      log.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.status}
                  </span>
                  <p className="text-2xl font-bold text-gray-900">{log.amount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No History Found
            </h3>
            <p className="text-gray-600">
              You don't have any {filter === "all" ? "" : filter} history yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default History;
