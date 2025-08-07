import React from 'react';
import { Button } from "../components/ui/button";
import { MapPinIcon, CameraIcon, CheckCircleIcon, UserGroupIcon, TruckIcon, BuildingOfficeIcon, GlobeAltIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/solid";

const coreFeatures = [
  {
    icon: MapPinIcon,
    title: "Location-Based Reporting",
    description: "Pinpoint the exact location of issues for faster, more accurate response.",
    bgColor: "from-emerald-100 to-green-100"
  },
  {
    icon: CameraIcon,
    title: "Photo Evidence",
    description: "Upload photos to provide clear, actionable evidence for every report.",
    bgColor: "from-green-100 to-emerald-100"
  },
  {
    icon: CheckCircleIcon,
    title: "Real-Time Tracking",
    description: "Monitor the status of your report from submission to resolution.",
    bgColor: "from-teal-100 to-emerald-100"
  },
];

const reportingSteps = [
  {
    step: "01",
    icon: MapPinIcon,
    title: "Pin the Location",
    description: "Select the exact spot on the map where the issue exists for precise action.",
    tip: "Use satellite view for even greater accuracy!",
    color: "from-emerald-500 to-green-600"
  },
  {
    step: "02",
    icon: CameraIcon,
    title: "Document with Photos",
    description: "Capture clear, detailed photos from multiple angles to provide comprehensive evidence.",
    tip: "Include both wide-angle context shots and close-up detail images.",
    color: "from-green-500 to-emerald-600"
  },
  {
    step: "03",
    icon: CheckCircleIcon,
    title: "Submit & Monitor",
    description: "Submit your report and receive a tracking ID to monitor progress and resolution.",
    tip: "You'll receive notifications at each stage of the resolution process.",
    color: "from-teal-500 to-emerald-600"
  }
];

const userTypes = [
  { 
    icon: UserGroupIcon, 
    title: "Community Residents", 
    description: "Report local environmental issues and track progress",
    color: "from-emerald-500 to-green-600"
  },
  { 
    icon: TruckIcon, 
    title: "Waste Management Teams", 
    description: "Receive notifications and respond to cleanup requests efficiently",
    color: "from-green-500 to-emerald-600"
  },
  { 
    icon: BuildingOfficeIcon, 
    title: "County Officials", 
    description: "Monitor environmental initiatives and coordinate responses",
    color: "from-teal-500 to-emerald-600"
  },
  { 
    icon: GlobeAltIcon, 
    title: "Environmental Groups", 
    description: "Track community cleanup efforts and environmental impact",
    color: "from-emerald-500 to-teal-600"
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-emerald-100">
        <div className="absolute inset-0">
          <img src="/city-landscape.jpg" alt="Beautiful city landscape with greenery" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center py-36 md:py-48">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Together, We <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">Clean Kilimani.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how <span className="font-bold text-emerald-200">CleanKili</span> empowers you to report, track, and resolve environmental issues in your community. Our simple process connects residents, cleanup teams, and local authorities for real impact.
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 border border-emerald-700/10">
            Start Reporting Now
          </Button>
        </div>
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-2xl opacity-20"></div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-green-700 bg-clip-text text-transparent mb-6 leading-tight">
              Why It Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Environmental challenges affect every aspect of our communities. CleanKili empowers collective action for lasting change.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-start gap-6 mb-8">
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                  <GlobeAltIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Environmental Impact on Communities
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    Environmental issues directly impact public health, property values, and quality of life. From contaminated water sources to improper waste disposal, these challenges require swift, coordinated community action for effective resolution.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                      <span className="text-gray-700">Immediate health and safety concerns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                      <span className="text-gray-700">Property value protection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                      <span className="text-gray-700">Community well-being enhancement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6">
                    The CleanKili Impact
                  </h3>
                  <p className="text-lg opacity-95 leading-relaxed mb-8">
                    Our platform bridges the gap between community concerns and effective solutions, creating transparent communication channels that drive real results.
                  </p>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <p className="font-semibold text-lg text-center">
                      "Empowering communities to create lasting environmental change, one report at a time."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Community Driven</h4>
              <p className="text-gray-600 leading-relaxed">
                Empowering residents to take an active role in environmental stewardship and community improvement.
              </p>
            </div>
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Real-Time Action</h4>
              <p className="text-gray-600 leading-relaxed">
                Instant notifications and live updates ensure environmental issues are addressed quickly and efficiently.
              </p>
            </div>
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Measurable Impact</h4>
              <p className="text-gray-600 leading-relaxed">
                Track progress and see tangible results of community efforts through comprehensive analytics and reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful, intuitive tools designed to make environmental reporting simple, effective, and impactful.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 relative overflow-hidden">
                  <div className={`absolute inset-0 ${feature.bgColor} opacity-20 rounded-3xl`}></div>
                  <div className="relative flex items-center justify-center w-20 h-20 mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="relative text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-8">
                      {feature.description}
                    </p>
                    <button className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200">
                      Learn More
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-emerald-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Report Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-green-50/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-24 right-1/3 w-80 h-80 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-green-700 bg-clip-text text-transparent mb-6 leading-tight">
              How to Report an Issue
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Reporting environmental issues is simple with CleanKili. Just follow these three easy steps to make a difference.
            </p>
          </div>
          <ol className="relative border-l-4 border-emerald-200 ml-4">
            {reportingSteps.map((step, idx) => (
              <li key={idx} className="mb-16 last:mb-0 flex items-start">
                <span className={`flex flex-col items-center mr-8`}>
                  <span className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${step.color} shadow-lg border-4 border-white relative z-10`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </span>
                  <span className="mt-2 text-lg font-bold text-emerald-700">{step.step}</span>
                  {idx !== reportingSteps.length - 1 && (
                    <span className="block w-1 h-16 bg-gradient-to-b from-emerald-200 to-green-200"></span>
                  )}
                </span>
                <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-lg mb-4">{step.description}</p>
                  <div className={`inline-block bg-gradient-to-br ${step.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-50').replace('-600', '-100')} rounded-xl px-4 py-2 border-l-4 border-${step.color.split(' ')[0].replace('from-', '').replace('-500', '-500')} text-sm text-emerald-700 font-semibold`}>
                    <span className="font-bold mr-2">Pro Tip:</span>{step.tip}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who Uses CleanKili Section - Redesigned */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-green-50/30 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-2xl opacity-10"></div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-400 bg-clip-text text-transparent mb-4 leading-tight">
              Who Uses CleanKili?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              CleanKili unites everyone who cares about a cleaner, healthier community. Here’s who benefits most:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {userTypes.map((user, index) => (
              <div key={index} className="flex flex-col items-center bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 w-72 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${user.color} rounded-xl mb-6 shadow-lg`}>
                  <user.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-700 mb-2 text-center">{user.title}</h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">{user.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
