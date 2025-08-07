import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-12 bg-white min-h-[60vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Get in Touch</h2>
        <div className="bg-green-50 rounded-xl shadow p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Mail className="h-6 w-6 text-green-600" />
            <a href="mailto:info@cleankili.com" className="text-lg text-green-900 hover:text-green-700 font-medium">info@cleankili.com</a>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-6 w-6 text-green-600" />
            <a href="tel:+254790889066" className="text-lg text-green-900 hover:text-green-700 font-medium">+254 790 889 066</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
