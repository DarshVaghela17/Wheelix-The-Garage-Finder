import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GaragerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-garage-dark mb-6">
        Garage Owner Dashboard
      </h1>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Incoming Requests</TabsTrigger>
          <TabsTrigger value="video">Video Call Center</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="profile">Garage Profile</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Incoming Requests */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-white shadow">
                <p className="font-medium">🚨 Emergency Alert from User123</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="hero" size="sm">Accept</Button>
                  <Button variant="destructive" size="sm">Reject</Button>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-white shadow">
                <p className="font-medium">📅 Booking Request: 2PM Tow Truck</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="hero" size="sm">Accept</Button>
                  <Button variant="destructive" size="sm">Reject</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Call Center */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Video Call Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>No active calls at the moment.</p>
              <div className="p-4 border rounded-md bg-white shadow">
                <p className="font-medium">📞 Call History</p>
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>User456 - 5 mins ago</li>
                  <li>User789 - Yesterday</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Management */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border p-3 rounded-md bg-white shadow">
                <span className="font-medium">Garage Availability</span>
                <Button variant="hero" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md bg-white shadow">
                <span className="font-medium">Tow Truck Service</span>
                <Button variant="hero" size="sm">Toggle</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Garage Profile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Garage Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Services Offered</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Oil Change</li>
                  <li>Engine Repair</li>
                  <li>Battery Replacement</li>
                </ul>
                <Button variant="hero" size="sm" className="mt-2">Update Services</Button>
              </div>

              <div>
                <p className="font-medium">Pricing & Hours</p>
                <p className="text-sm">9AM - 7PM | $50/hour</p>
                <Button variant="hero" size="sm" className="mt-2">Edit</Button>
              </div>

              <div>
                <p className="font-medium">Garage Location</p>
                <p className="text-sm">123 Main St, City</p>
                <Button variant="hero" size="sm" className="mt-2">Update Location</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm">
                <li>Requests Served: 45</li>
                <li>Response Rate: 92%</li>
                <li>Avg. Response Time: 3 mins</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GaragerDashboard;
