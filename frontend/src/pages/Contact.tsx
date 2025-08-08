
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';



const Contact = () => {
  return (
    <>
      <Header />

      <section className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen py-10 sm:py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8">
          {/* Top Section: Info + Form */}
          <div className="flex flex-col-reverse lg:flex-row gap-8 md:gap-12 mb-10 md:mb-16 items-stretch">
            {/* Info/Intro Section */}
            <div className="flex-1 flex flex-col justify-center bg-transparent lg:pl-6 xl:pl-10 mb-8 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-3 sm:mb-4 leading-tight">Have a suggestion or want to connect with CleanKili? We'd love to hear from you!</h1>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">We are a team of passionate residents and environmental enthusiasts who love Kilimani and want to make it better for everyone. If you have ideas, feedback, or want to get involved, reach out below!</p>
              <p className="text-green-700 font-semibold text-base sm:text-lg">Together, we can build a cleaner, greener, and more vibrant Kilimani.</p>
            </div>
            {/* Email Contact Form */}
            <form className="flex-1 bg-white rounded-2xl shadow-lg p-5 sm:p-8 md:p-10 flex flex-col gap-5 sm:gap-6 justify-center min-w-0 max-w-full lg:max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Name<span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Your Name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Email<span className="text-red-500">*</span></label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Your Email" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-green-800 mb-1">Subject</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Subject (optional)" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1">Message<span className="text-red-500">*</span></label>
                <textarea className="w-full px-4 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" rows={5} placeholder="Write your message..." required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="saveInfo" className="rounded border-green-300 focus:ring-green-400" />
                <label htmlFor="saveInfo" className="text-sm text-gray-600">Please save my name, email address for the next time I message.</label>
              </div>
              <button type="submit" className="w-full bg-black hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2">
                Submit Now <span aria-hidden="true">↗</span>
              </button>
            </form>
          </div>
          {/* Contact Details and Map side by side */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex-1 flex flex-col justify-center min-w-0 max-w-full md:max-w-lg mb-6 md:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-3 sm:mb-4">Nairobi, Kenya <a href="https://maps.google.com/?q=Dennis+Pritt+Road,+Kilimani,+Nairobi" target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-green-600 underline">View Map ↗</a></h2>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Phone className="h-6 w-6 text-green-600" />
                <span className="text-base sm:text-lg text-gray-700">+254 700 197 197</span>
              </div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Mail className="h-6 w-6 text-green-600" />
                <span className="text-base sm:text-lg text-gray-700">info@kilimani.org</span>
              </div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
                <span className="text-base sm:text-lg text-gray-700">iHit, Dennis Pritt Road, Kilimani, Nairobi.</span>
              </div>
            </div>
            <div className="flex-1 min-h-[220px] sm:min-h-[280px] md:min-h-[320px] rounded-2xl overflow-hidden shadow-lg">
              <iframe
                title="Kilimani Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.01923483313!2d36.784685!3d-1.292066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e8e2e2b6b7%3A0x7e7b7e7b7e7b7e7b!2sDennis%20Pritt%20Road%2C%20Kilimani%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1691500000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '220px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="mt-10 sm:mt-12 text-center text-green-600 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} CleanKili. All rights reserved.
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
