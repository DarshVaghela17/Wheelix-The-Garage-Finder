import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-garage-dark mb-6">
        Admin Dashboard
      </h1>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="garages">Manage Garages</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* Manage Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-white shadow flex justify-between items-center">
                <span>User123 (user)</span>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
              <div className="p-4 border rounded-md bg-white shadow flex justify-between items-center">
                <span>GarageOwner01 (garager)</span>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Garages */}
        <TabsContent value="garages">
          <Card>
            <CardHeader>
              <CardTitle>Manage Garages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-white shadow flex justify-between items-center">
                <span>SpeedyFix Garage</span>
                <Button variant="destructive" size="sm">Remove</Button>
              </div>
              <div className="p-4 border rounded-md bg-white shadow flex justify-between items-center">
                <span>AutoCare Plus</span>
                <Button variant="destructive" size="sm">Remove</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm">
                <li>Total Users: 150</li>
                <li>Total Garages: 25</li>
                <li>Requests Served: 1,240</li>
                <li>Average Response Time: 2.5 mins</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="hero" size="sm">Backup Database</Button>
              <Button variant="outline" size="sm">Manage Admins</Button>
              <Button variant="destructive" size="sm">Shut Down System</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
