'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Newsletter from '@/components/Newsletter';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you shortly. ✨');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl text-center mb-4">Contact Us</h1>
        <p className="text-gray-600 text-center mb-12">
          We&apos;d love to hear from you. Reach out and we&apos;ll respond promptly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiMail className="text-gold-600" size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Email</h3>
                <p className="text-gray-600">hello@yohannasignature.com</p>
                <p className="text-gray-600">support@yohannasignature.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiPhone className="text-gold-600" size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Phone</h3>
                <p className="text-gray-600">+234 800 000 0000</p>
                <p className="text-gray-600">+234 800 000 0001</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiMapPin className="text-gold-600" size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Location</h3>
                <p className="text-gray-600">Lagos, Nigeria</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <a href="#" className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center hover:bg-gold-200 transition-colors" aria-label="Instagram">
                <FaInstagram className="text-gold-600" size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center hover:bg-gold-200 transition-colors" aria-label="WhatsApp">
                <FaWhatsapp className="text-gold-600" size={20} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}