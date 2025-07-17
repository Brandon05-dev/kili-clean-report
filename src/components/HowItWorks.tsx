import React from 'react';
import { 
  Map,
  Activity,
  Users, 
  Heart,
  Camera,
  MapPin,
  CheckCircle,
  Zap,
  Mail,
  Leaf,
  Lightbulb,
  Building2,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HowItWorks = () => {
  const users = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Residents & Visitors",
      description: "Report problems fast — no hassle."
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Waste Collection Companies", 
      description: "Get clear, real-time data to plan work better."
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "County Government",
      description: "See trends, problem hotspots, and proof of clean-ups."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Community Groups & Landlords",
      description: "Track cleanliness in shared spaces."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How CleanKili Works</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            CleanKili is a simple, community-powered digital platform that makes it easy for residents, businesses, 
            and visitors in Kilimani to report illegal dumping, littering, and blocked drains — and helps waste teams 
            and the County respond quickly and efficiently.
          </p>
        </div>

        {/* Why It Matters */}
        <Card className="mb-16 border-0 shadow-xl bg-gradient-to-r from-red-50 to-orange-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-700 flex items-center justify-center gap-2">
              <MapPin className="h-6 w-6" />
              Why It Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
              In Kilimani, illegal dumping and poor waste disposal are major problems. Overflowing garbage, 
              blocked drains, and careless littering make streets unsafe and unattractive. They can cause floods 
              during rain, spread disease, and lower the quality of life for everyone.
            </p>
            <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
              <p className="text-gray-800 font-medium">
                Too often, these problems go unreported or get stuck in private chats where action is slow or never comes at all.
              </p>
              <p className="text-green-700 font-semibold mt-2">
                CleanKili fixes this by giving every resident an easy way to report problems instantly, 
                and by giving waste teams and the County the data they need to act — fast.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Community Map Focus */}
        <Card className="mb-16 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <Map className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Community Map</h3>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              Your reports appear live on the CleanKili Map, which everyone can see. Each pin shows the photo, 
              location, and status updates in real-time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-3">
                  <Camera className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Photo Evidence</h4>
                <p className="text-gray-600 text-sm">Visual proof of the issue</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Exact Location</h4>
                <p className="text-gray-600 text-sm">Precise GPS coordinates</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-3">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Live Status</h4>
                <p className="text-gray-600 text-sm">Pending, In Progress, Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Uses CleanKili */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            <Lightbulb className="inline-block h-8 w-8 text-yellow-500 mr-2" />
            Who Uses CleanKili?
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            CleanKili serves different stakeholders in the Kilimani community ecosystem
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {users.map((user, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    {user.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{user.title}</h4>
                  <p className="text-gray-600 text-sm">{user.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Free for Community */}
        <Card className="mb-16 border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">✅ Free for the Community</h3>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
              CleanKili is free to use for residents. The system is funded through partnerships with local waste contractors, 
              the County government, and local sponsors who benefit from a cleaner, healthier Kilimani.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">CleanKili in Action</h3>
            <div className="space-y-2 mb-6">
              <p className="text-xl font-medium">One pin. One photo. One report.</p>
              <p className="text-lg opacity-90">
                It takes less than a minute to protect your street from illegal dumping, blocked drains, and dirty sidewalks.
              </p>
              <p className="text-lg font-medium">
                Together, we make Kilimani clean, healthy, and safe — for everyone.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Badge variant="secondary" className="text-green-700 bg-white px-6 py-2 text-lg">
                <CheckCircle className="inline-block h-4 w-4 mr-2" />
                Join us. Report it. Fix it. Enjoy a cleaner Kilimani.
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Contact: info@cleankili.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                <span>CleanKili — Simple actions, cleaner streets.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorks;
