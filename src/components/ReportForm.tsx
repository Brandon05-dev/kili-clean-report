
import React, { useState } from 'react';
import { Camera, MapPin, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const ReportForm = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [reportType, setReportType] = useState('');
  const [location, setLocation] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedImage(file);
      toast({
        title: "Photo uploaded!",
        description: "Your photo has been selected successfully.",
      });
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsGettingLocation(false);
        toast({
          title: "Location captured!",
          description: "Your current location has been set.",
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        toast({
          title: "Location error",
          description: "Unable to get your location. Please try again or enter manually.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = () => {
    if (!selectedImage || !reportType) {
      toast({
        title: "Missing information",
        description: "Please add a photo and select the issue type.",
        variant: "destructive",
      });
      return;
    }

    if (!location) {
      toast({
        title: "Location required",
        description: "Please set your location to help us locate the issue.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Report submitted!",
      description: "Thank you for helping keep Kilimani clean. We'll update you on the progress.",
    });
    
    // Reset form
    setSelectedImage(null);
    setDescription('');
    setReportType('');
    setLocation('');
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">Report an Issue</h2>
          <p className="text-lg text-black">Help us keep the community clean by reporting waste and drainage issues</p>
        </div>
        
        <Card className="border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center text-green-800">
              <AlertCircle className="mr-3 h-6 w-6" />
              New Report
            </CardTitle>
            <CardDescription className="text-green-700">
              Fill out the details below to submit your environmental report
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Issue Type Selection */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Type of Issue
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full placeholder:text-black">
                  <SelectValue placeholder="Select the type of issue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="illegal-dumping">Illegal Dumping</SelectItem>
                  <SelectItem value="blocked-drain">Blocked Drain</SelectItem>
                  <SelectItem value="litter">Litter/Trash</SelectItem>
                  <SelectItem value="overflowing-bin">Overflowing Bin</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Photo Evidence
              </label>
              <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                {selectedImage ? (
                  <div className="space-y-3">
                    <img 
                      src={URL.createObjectURL(selectedImage)} 
                      alt="Preview" 
                      className="mx-auto max-h-48 rounded-lg shadow-md"
                    />
                    <p className="text-green-600 font-medium">{selectedImage.name}</p>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImage(null)}
                      className="border-green-500 text-green-700 hover:bg-green-50"
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-100 p-4 rounded-full w-fit mx-auto">
                      <Camera className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <span className="text-green-600 font-medium hover:text-green-700">
                          Take a photo or upload from gallery
                        </span>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-black text-sm">JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Location
              </label>
              {location ? (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Location captured:</p>
                    <p className="text-sm text-green-600">{location}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-green-300 hover:bg-green-50"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    <MapPin className="mr-3 h-5 w-5 text-green-600" />
                    {isGettingLocation ? 'Getting location...' : 'Update location'}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-green-300 hover:bg-green-50"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  <MapPin className="mr-3 h-5 w-5 text-green-600" />
                  {isGettingLocation ? 'Getting location...' : 'Tap to set location'}
                </Button>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Additional Details (Optional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in more detail..."
                className="resize-none border-green-300 focus:border-green-500 placeholder:text-black"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Upload className="mr-3 h-6 w-6" />
              Submit Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReportForm;
