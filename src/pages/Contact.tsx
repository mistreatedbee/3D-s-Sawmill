import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapComponent } from '../components/features/MapComponent';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, MessageSquare } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create mailto link with form data
      const mailtoLink = `mailto:bruwer.danie@gmail.com?subject=${encodeURIComponent(`Contact Form: ${formData.subject}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:0725049184';
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in your timber products. Can you provide more information?`;
    const url = `https://wa.me/27725049184?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-20 pb-20 pt-24 bg-gradient-to-b from-stone-50 to-white">
      {/* Enhanced Header */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-100 inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-800">Get in Touch</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Contact{' '}
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
              3D'S SAWMILL
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-4"
          >
            <span className="font-semibold text-emerald-800">"For all structural and industrial timber"</span>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600"
          >
            Your trusted partner for premium timber solutions. Contact us today for quotes, information, or to discuss your project needs.
          </motion.p>
        </div>
      </section>

      {/* Enhanced Contact Info Cards */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Phone Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <Card className="text-center h-full cursor-pointer hover:shadow-xl transition-all duration-300 border border-emerald-100 hover:border-emerald-200"
                  onClick={handleCall}>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl">
                  <Phone className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-lg font-semibold text-emerald-700 mb-2">072 504 9184</p>
              <p className="text-sm text-gray-500 mt-2">
                Click to call directly
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Tap to Call
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="text-center h-full cursor-pointer hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Email
              </h3>
              <p className="text-emerald-700 font-medium break-all">bruwer.danie@gmail.com</p>
              <p className="text-sm text-gray-500 mt-2">
                We respond within 24 hours
              </p>
              <div className="mt-4">
                <a 
                  href="mailto:bruwer.danie@gmail.com" 
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  Send Email
                </a>
              </div>
            </Card>
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <Card className="text-center h-full hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-stone-200">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-stone-100 to-stone-50 rounded-xl">
                  <MapPin className="h-6 w-6 text-stone-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-700 font-medium">
                3D'S SAWMILL
              </p>
              <p className="text-gray-600">
                Lothair 2370
              </p>
              <p className="text-gray-600">
                South Africa
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Timber yard & operations
              </p>
            </Card>
          </motion.div>

          {/* WhatsApp Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="text-center h-full cursor-pointer hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200"
                  onClick={handleWhatsApp}>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                WhatsApp
              </h3>
              <p className="text-lg font-semibold text-green-700 mb-2">072 504 9184</p>
              <p className="text-sm text-gray-500 mt-2">
                Quick chat for quotes
              </p>
              <div className="mt-4">
                <Button 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Message on WhatsApp
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Card className="bg-gradient-to-br from-emerald-50/50 to-amber-50/50 border border-emerald-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Monday - Friday</span>
                    <span className="font-semibold text-emerald-700">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="font-semibold text-emerald-700">8:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="font-semibold text-emerald-700">Closed</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  * After-hours calls and visits by appointment only
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Our Location in Lothair
        </h2>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-stone-200">
          <MapComponent
            height="500px"
            locations={[
              {
                name: '3D\'S SAWMILL - Timber Yard',
                lat: -26.3595, // Lothair coordinates
                lng: 29.4653,
                address: 'Lothair 2370, South Africa'
              },
            ]}
          />
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Visit our facility in Lothair to see our timber stock and discuss your project requirements in person.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Send us a Message
            </h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <Card className="border border-stone-200 shadow-lg">
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">
                      Message sent successfully!
                    </p>
                    <p className="text-green-700 text-sm">
                      We've opened your email client. Please send the email and we'll respond within 24 hours.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    className="border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Timber quote, product inquiry, etc."
                  required
                  className="border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your timber requirements, quantities, project details, or any questions you have..."
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all"
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  {isSubmitting ? 'Opening Email...' : 'Send Message via Email'}
                </Button>
                
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={handleWhatsApp}
                  className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
                >
                  Chat on WhatsApp
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                By submitting this form, you agree to be contacted by 3D'S SAWMILL regarding your inquiry.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-white to-stone-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: 'What types of timber do you specialize in?',
                answer: 'We specialize in structural and industrial timber, including pine, eucalyptus, and other hardwoods suitable for construction and industrial applications.',
              },
              {
                question: 'Do you offer custom cutting services?',
                answer: 'Yes! We provide custom cutting and milling services to meet your specific project requirements. Contact us with your specifications for a quote.',
              },
              {
                question: 'What are your delivery options?',
                answer: 'We offer delivery services within Lothair and surrounding areas. For larger orders, we can arrange nationwide delivery.',
              },
              {
                question: 'Can I visit your timber yard to select wood?',
                answer: 'Absolutely! We welcome customers to visit our facility in Lothair. Please call ahead to ensure someone is available to assist you.',
              },
              {
                question: 'Do you provide quotes for bulk orders?',
                answer: 'Yes, we offer competitive pricing for bulk orders. Contact us with your requirements for a detailed quote.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept cash, EFT, and major credit cards. Payment terms for commercial accounts can be discussed.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border border-stone-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Banner */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
          <p className="text-lg mb-6">Call us directly at <span className="font-bold text-2xl">072 504 9184</span></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleCall}
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </Button>
            <Button
              onClick={handleWhatsApp}
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-emerald-700"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              WhatsApp Message
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};