
import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Upload, AlertCircle, X, CheckCircle, Loader2, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { LocationData, ReportData } from '@/types/report';
import { uploadPhoto, saveReport } from '@/services/liveDatabase';

const ReportForm = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [reportType, setReportType] = useState('');
  const [location, setLocation] = useState<LocationData>({
    coordinates: null,
    address: ''
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPG, PNG, etc.).",
          variant: "destructive",
        });
        return;
      }

      // Clean up previous preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, photo: '' }));
      
      toast({
        title: "Photo uploaded!",
        description: "Your photo has been selected successfully.",
      });
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Function to convert coordinates to readable address
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using a free geocoding service for detailed location data
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Geocoding response:', data); // For debugging
        
        // Extract location components with preference for Kenyan locations
        const {
          locality,           // Neighborhood/Area (e.g., "Kasarani")
          city,              // City (e.g., "Nairobi")
          countryName,       // Country (e.g., "Kenya")
          principalSubdivision, // County/Province
          localityInfo       // Additional area information
        } = data;
        
        // For Kenyan locations, prioritize area/neighborhood + city format
        let formattedAddress = '';
        
        if (countryName && countryName.toLowerCase().includes('kenya')) {
          // Kenya-specific formatting: "Area, Nairobi" or "Neighborhood, City"
          const area = locality || localityInfo?.administrative?.[0]?.name;
          const mainCity = city || principalSubdivision;
          
          if (area && mainCity) {
            formattedAddress = `${area}, ${mainCity}`;
          } else if (mainCity) {
            formattedAddress = mainCity;
          } else if (area) {
            formattedAddress = area;
          }
        } else {
          // General international formatting
          const addressParts = [
            locality || city,
            principalSubdivision,
            countryName
          ].filter(Boolean);
          formattedAddress = addressParts.join(', ');
        }
        
        // Fallback to coordinates if no readable address found
        return formattedAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
    
    // Fallback to coordinates
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
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
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Get readable address from coordinates
        const address = await reverseGeocode(latitude, longitude);
        
        setLocation({
          coordinates: { latitude, longitude },
          address: address
        });
        setIsGettingLocation(false);
        setErrors(prev => ({ ...prev, location: '' }));
        
        toast({
          title: "Location captured!",
          description: `Location set to: ${address}`,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        
        let errorMessage = "Unable to get your location. Please try again or enter manually.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please enter your address manually.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again.";
        }
        
        toast({
          title: "Location error",
          description: errorMessage,
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

  const handleLocationAddressChange = (value: string) => {
    setLocation(prev => ({ ...prev, address: value }));
    setErrors(prev => ({ ...prev, location: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedImage) {
      newErrors.photo = 'Please upload a photo of the issue';
    }

    if (!reportType) {
      newErrors.reportType = 'Please select the type of issue';
    }

    if (!location.coordinates && !location.address.trim()) {
      newErrors.location = 'Please provide location information';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitReport = async (reportData: ReportData): Promise<{ success: boolean; message: string }> => {
    try {
      // Upload photo to cloud storage
      const photoURL = await uploadPhoto(reportData.photo);
      
      // Save report to database
      const savedReport = await saveReport(reportData, photoURL);
      
      console.log('Report saved successfully:', savedReport);
      
      return {
        success: true,
        message: 'Report submitted successfully!'
      };
    } catch (error) {
      console.error('Error submitting report:', error);
      return {
        success: false,
        message: 'Failed to submit report. Please try again.'
      };
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for missing or invalid information.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData: ReportData = {
        id: `report_${Date.now()}`,
        type: reportType,
        description: description.trim(),
        location,
        photo: selectedImage!,
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };

      const result = await submitReport(reportData);

      if (result.success) {
        toast({
          title: "Report submitted successfully!",
          description: "Thank you for reporting! Your issue has been added to the CleanKili Map. We'll update you on the progress.",
        });

        // Reset form
        setSelectedImage(null);
        setImagePreview(null);
        setDescription('');
        setReportType('');
        setLocation({ coordinates: null, address: '' });
        setErrors({});
      } else {
        toast({
          title: "Submission failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 2xl:py-16 3xl:py-20 4xl:py-24 5xl:py-28 bg-white">
      <div className="max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20">
        <div className="text-center mb-8 2xl:mb-12 3xl:mb-16 4xl:mb-20">
          <h2 className="text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl font-bold text-black mb-4 2xl:mb-6 3xl:mb-8">Report an Issue</h2>
          <p className="text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-black">Help us keep the community clean by reporting waste and drainage issues</p>
        </div>
        
        <Card className="border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 2xl:p-8 3xl:p-10 4xl:p-12">
            <CardTitle className="flex items-center text-green-800 text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl">
              <AlertCircle className="mr-3 h-6 w-6 2xl:h-8 2xl:w-8 3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12" />
              New Report
            </CardTitle>
            <CardDescription className="text-green-700 text-base 2xl:text-lg 3xl:text-xl 4xl:text-2xl">
              Fill out the details below to submit your environmental report
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Issue Type Selection */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Type of Issue <span className="text-red-500">*</span>
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className={`w-full border-green-300 hover:bg-green-50 focus:border-green-500 placeholder:text-black ${errors.reportType ? 'border-red-300 focus:border-red-500' : ''}`}>
                  <SelectValue placeholder="Select the type of issue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="illegal-dumping">Illegal Dumping</SelectItem>
                  <SelectItem value="blocked-drain">Blocked Drain</SelectItem>
                  <SelectItem value="litter">Litter/Trash</SelectItem>
                  <SelectItem value="overflowing-bin">Overflowing Bin</SelectItem>
                  <SelectItem value="graffiti">Graffiti/Vandalism</SelectItem>
                  <SelectItem value="broken-infrastructure">Broken Infrastructure</SelectItem>
                  <SelectItem value="other">Other Environmental Issue</SelectItem>
                </SelectContent>
              </Select>
              {errors.reportType && (
                <p className="mt-1 text-sm text-red-600">{errors.reportType}</p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Photo Evidence <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
                errors.photo ? 'border-red-300' : 'border-green-300 hover:border-green-400'
              }`}>
                {selectedImage && imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img 
                        src={selectedImage ? imagePreview : 'c:/Users/admin/AppData/Local/Packages/5319275A.WhatsAppDesktop_cv1g1gvanyjgm/TempState/91A6759107C41A2677E624F70B801F8A/WhatsApp Image 2025-07-29 at 16.07.50_f8287c3c.jpg'}
                        alt="Blocked Drain Preview" 
                        className="mx-auto max-h-64 rounded-lg shadow-md object-cover"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600 font-medium text-sm mb-2">{selectedImage.name}</p>
                      <p className="text-gray-500 text-xs">
                        Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCameraCapture}
                        className="border-green-500 text-green-700 hover:bg-green-50"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take New Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGalleryUpload}
                        className="border-green-500 text-green-700 hover:bg-green-50"
                      >
                        <FileImage className="h-4 w-4 mr-2" />
                        Choose Different
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="bg-green-100 p-4 rounded-full w-fit mx-auto">
                      <Camera className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-black font-medium">Add a photo of the issue</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCameraCapture}
                          className="border-green-500 text-green-700 hover:bg-green-50"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Take Photo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGalleryUpload}
                          className="border-green-500 text-green-700 hover:bg-green-50"
                        >
                          <FileImage className="h-5 w-5 mr-2" />
                          Choose from Gallery
                        </Button>
                      </div>
                      <p className="text-black text-sm">JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              {errors.photo && (
                <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
              )}
              
              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {location.coordinates ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-800 font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          GPS Location captured
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Lat: {location.coordinates.latitude.toFixed(6)}, 
                          Lng: {location.coordinates.longitude.toFixed(6)}
                        </p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="text-green-600 hover:text-green-700"
                      >
                        {isGettingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Update'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start border-green-300 hover:bg-green-50 text-green-800"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <Loader2 className="mr-3 h-5 w-5 animate-spin text-green-600" />
                    ) : (
                      <MapPin className="mr-3 h-5 w-5 text-green-600" />
                    )}
                    {isGettingLocation ? 'Getting GPS location...' : 'Get Current Location (GPS)'}
                  </Button>
                )}
                
                {/* Manual location input */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Or enter location manually:
                  </label>
                  <Input
                    type="text"
                    value={location.address}
                    onChange={(e) => handleLocationAddressChange(e.target.value)}
                    placeholder="Enter street address, landmark, or description..."
                    className={`border-green-300 focus:border-green-500 text-green-800 placeholder:text-gray-500 ${errors.location ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                </div>
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail (e.g., 'Large pile of household waste dumped near the main entrance', 'Blocked storm drain causing flooding')..."
                className="resize-none border-green-300 focus:border-green-500 placeholder:text-gray-400"
                rows={4}
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {description.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Submitting Report...
                </div>
              ) : (
                <>
                  <Upload className="mr-3 h-6 w-6" />
                  Submit Report
                </>
              )}
            </Button>
            
            {/* Info text */}
            <p className="text-center text-sm text-gray-600">
              Your report will be reviewed and assigned to the appropriate team. 
              You'll be notified of any updates on the status.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReportForm;
