import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero3D } from '../components/features/Hero3D';
import { ProductCard } from '../components/features/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Star, ChevronLeft, ChevronRight, Phone, CheckCircle, Truck, Zap, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { useTestimonials } from '../hooks/useTestimonials';
import { useGallery } from '../hooks/useGallery';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Testimonial, Product } from '../types';

export const Home = () => {
  const { products } = useInventory();
  const { testimonials } = useTestimonials();
  const { gallery } = useGallery();
  const { settings } = useSiteSettings();
  const [displayTestimonials, setDisplayTestimonials] = useState<Testimonial[]>([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    setDisplayTestimonials(testimonials.slice(0, 3));
  }, [testimonials]);

  // Auto-play gallery
  useEffect(() => {
    if (!autoPlay || gallery.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, gallery.length]);

  // Filter featured products safely handling optional featured property
  const featuredProducts = products.filter((p: Product) => p.featured === true).slice(0, 3);

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="space-y-20 pb-20">
      <Hero3D />

      {/* Enhanced Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 mb-4">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-800">{settings?.whyChooseSubtitle || 'Our Advantages'}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {settings?.whyChooseTitle || "Why Choose 3D'S SAWMILL?"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {settings?.whyChooseDescription || 'We combine traditional craftsmanship with cutting-edge technology to deliver premium timber solutions you can trust.'}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              id: 'sustainable-sourcing',
              title: settings?.feature1Title || 'Sustainable Sourcing',
              desc: settings?.feature1Description || 'All our timber comes from certified sustainable forests in South Africa, ensuring environmental responsibility and long-term supply.',
              icon: <Zap className="h-8 w-8 text-emerald-600" />,
              gradient: 'from-emerald-50 to-emerald-100/30',
              border: 'border-emerald-200/50 dark:border-emerald-700/30',
              darkBg: 'dark:bg-gradient-to-br dark:from-emerald-900/20 dark:to-emerald-800/10'
            },
            {
              id: 'precision-milling',
              title: settings?.feature2Title || 'Precision Milling',
              desc: settings?.feature2Description || 'State-of-the-art equipment ensures exact dimensions and superior quality for every timber product, cut to your specifications.',
              icon: <Layers className="h-8 w-8 text-amber-600" />,
              gradient: 'from-amber-50 to-amber-100/30',
              border: 'border-amber-200/50 dark:border-amber-700/30',
              darkBg: 'dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-amber-800/10'
            },
            {
              id: 'nationwide-delivery',
              title: settings?.feature3Title || 'Nationwide Delivery',
              desc: settings?.feature3Description || 'Reliable logistics network delivering to your construction site, anywhere in South Africa, with tracking and insurance.',
              icon: <Truck className="h-8 w-8 text-blue-600" />,
              gradient: 'from-blue-50 to-blue-100/30',
              border: 'border-blue-200/50 dark:border-blue-700/30',
              darkBg: 'dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-blue-800/10'
            }
          ].map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-70 transition duration-500 dark:opacity-0 dark:group-hover:opacity-30`}></div>
              
              <div className={`relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 ${feature.darkBg} border ${feature.border} shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm dark:backdrop-blur-sm`}>
                {/* Icon */}
                <motion.div 
                  className="mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 shadow-lg">
                    {feature.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Decorative Line */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 relative">
                  <div className="absolute -top-1 left-0 w-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section Below Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: "30+", label: "Years Experience", suffix: "Since 1990" },
              { value: "100%", label: "Quality Guarantee", suffix: "Premium Timber" },
              { value: "24/7", label: "Support", suffix: "Always Available" },
              { value: "500+", label: "Projects", suffix: "Completed" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50/50 border border-gray-200/50 dark:from-gray-800/30 dark:to-gray-900/20 dark:border-gray-700/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{stat.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.suffix}</div>
                <div className="mt-3 w-12 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent mx-auto"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="bg-gradient-to-b from-stone-50 to-white dark:from-gray-900/50 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 dark:border-amber-700/30">
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Premium Selection
                </span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Timber Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our top-quality timber selections perfect for structural and industrial applications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 dark:border-amber-700/30">
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Our Work in Action
              </span>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Timber Gallery
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Explore our state-of-the-art facility, quality products, and successful projects
          </p>
        </div>

        {gallery.length > 0 ? (
          <div className="relative max-w-5xl mx-auto">
            {/* Main Gallery Image */}
            <motion.div
              key={currentGalleryIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl"
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
            >
              <img
                src={gallery[currentGalleryIndex]?.url}
                alt={gallery[currentGalleryIndex]?.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {gallery[currentGalleryIndex]?.title}
                  </h3>
                  <p className="text-white/90">
                    {gallery[currentGalleryIndex]?.category}
                  </p>
                </div>
              </div>

              {/* Gallery Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className="px-3 py-1 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm"
                >
                  {autoPlay ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <span className="px-3 py-1 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm">
                  {currentGalleryIndex + 1} / {gallery.length}
                </span>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <button
              onClick={prevGalleryImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-110 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={nextGalleryImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-110 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-900 dark:text-white" />
            </button>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide">
              {gallery.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setCurrentGalleryIndex(index);
                    setAutoPlay(false);
                  }}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                    index === currentGalleryIndex
                      ? 'ring-4 ring-emerald-600 dark:ring-emerald-400 scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* View All Gallery Button */}
            <div className="text-center mt-8">
              <Link to="/gallery">
                <Button 
                  variant="outline" 
                  size="lg" 
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No gallery images available yet.</p>
          </div>
        )}
      </section>

      {/* Enhanced Testimonials */}
      <section className="bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-900/10 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 dark:border-amber-700/30">
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Client Testimonials
                </span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Hear from construction companies, contractors, and builders who trust our timber
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">"</span>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white p-12 md:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Start Your Project?
                </h2>
                <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                  Get a custom quote for your specific timber requirements. Our experts are ready to assist you with the perfect timber solution.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-emerald-100">
                    <CheckCircle className="h-5 w-5 text-emerald-300" />
                    <span>Free consultation and quote</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-100">
                    <CheckCircle className="h-5 w-5 text-emerald-300" />
                    <span>Expert technical advice</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-100">
                    <CheckCircle className="h-5 w-5 text-emerald-300" />
                    <span>Fast response time</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link to="/contact" className="block">
                  <Button 
                    size="lg" 
                    className="w-full bg-white text-emerald-900 hover:bg-emerald-50 text-lg py-6"
                  >
                    Request Custom Quote
                  </Button>
                </Link>
                
                <div className="text-center">
                  <p className="text-emerald-200 mb-2">Or call us directly</p>
                  <a 
                    href="tel:0725049184" 
                    className="inline-flex items-center gap-3 text-2xl font-bold text-white hover:text-emerald-300 transition-colors"
                  >
                    <Phone className="h-6 w-6" />
                    {settings?.contactPhone || '072 504 9184'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};