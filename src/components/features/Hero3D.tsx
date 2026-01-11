import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Layers, Truck, Zap, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero3D = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-900/30">
      
      {/* Dark Wood Texture Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Dark Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/80 via-stone-800/60 to-emerald-900/20"></div>
        
        {/* Animated Dark Gradient Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-emerald-900/15 to-amber-900/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-1/4 -right-1/4 w-[900px] h-[900px] bg-gradient-to-r from-amber-900/8 to-emerald-900/12 rounded-full blur-3xl"
        />

        {/* Subtle Light Streaks */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-5"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)'
          }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Light Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Modern Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-emerald-500/30 shadow-lg"
            >
              <div className="relative">
                <span className="absolute inset-0 animate-ping bg-emerald-400/40 rounded-full"></span>
                <div className="relative w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-white">
                Nationwide Delivery Available
              </span>
            </motion.div>

            {/* Modern Typography */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="relative">
                  <span className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 blur-2xl"></span>
                  <span className="relative bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">
                    3D'S SAWMILL
                  </span>
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mt-4 block">
                  Premium Structural &<br />
                  <span className="text-emerald-300">Industrial Timber</span>
                </span>
              </h1>

              <p className="text-xl text-stone-200 leading-relaxed max-w-lg font-light">
                Delivering superior timber solutions with sustainable practices and cutting-edge technology. 
                Trusted by industry leaders for quality, reliability, and exceptional service.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-4">
              {[
                { text: "Certified sustainable timber", icon: <Check className="h-4 w-4" /> },
                { text: "Custom milling & cutting services", icon: <Check className="h-4 w-4" /> },
                { text: "Bulk orders with volume discounts", icon: <Check className="h-4 w-4" /> }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-stone-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-full flex items-center justify-center border border-emerald-600/30">
                    <div className="text-emerald-300">{item.icon}</div>
                  </div>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Modern Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link to="/products" className="sm:w-auto w-full">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5 ml-2" />}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 font-semibold rounded-lg hover:scale-105"
                >
                  Explore Products
                </Button>
              </Link>
              <Link to="/contact" className="sm:w-auto w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-lg transition-all duration-300 rounded-lg font-semibold backdrop-blur-sm"
                >
                  Get Quote
                </Button>
              </Link>
            </motion.div>

            {/* Modern Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-700"
            >
              {[
                { icon: <Zap className="h-6 w-6" />, title: "Fast Service", desc: "24/7 Support" },
                { icon: <Layers className="h-6 w-6" />, title: "Quality Stock", desc: "Grade A Timber" },
                { icon: <Truck className="h-6 w-6" />, title: "Reliable Delivery", desc: "On Time, Every Time" }
              ].map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-stone-800/50 to-stone-900/30 border border-stone-700 group-hover:border-emerald-500/50 group-hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                    <div className="text-emerald-300 group-hover:text-emerald-200 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {feature.title}
                    </div>
                    <div className="text-sm text-stone-300 mt-1">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image Section - Modern Card Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative h-[500px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Main Image with Modern Frame */}
            <div className="absolute inset-0">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-amber-500/10"></div>
              
              {/* Image Container */}
              <div className="relative w-full h-full">
                <img
                  src="/logo.jpeg"
                  alt="Premium Timber at 3D's Sawmill"
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center 30%' }}
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;
                  }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-stone-900/10 to-transparent"></div>
                
                {/* Modern Pattern Overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />
              </div>
            </div>

            {/* Modern Floating Badges */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute bottom-8 left-8"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/20 blur-xl"></div>
                <div className="relative px-6 py-4 rounded-2xl bg-stone-900/90 backdrop-blur-sm border border-stone-700/50 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                    <div>
                      <div className="text-xl font-bold text-white">Since 1990</div>
                      <div className="text-sm text-stone-300 font-medium">Trusted Quality</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -6, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-8 right-8"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600/20 to-amber-500/20 blur-xl"></div>
                <div className="relative px-6 py-4 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-800 text-white shadow-2xl">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm opacity-95 font-medium">Sustainable</div>
                </div>
              </div>
            </motion.div>

            {/* Modern Decorative Elements */}
            <div className="absolute -inset-4 -z-10">
              <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-3xl"></div>
              <div className="absolute inset-2 border border-amber-400/10 rounded-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-stone-400 font-medium tracking-widest uppercase">Scroll</div>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-400/50 via-stone-300/50 to-transparent"></div>
        </div>
      </motion.div>

      {/* Dark Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-900 to-transparent pointer-events-none"></div>
    </div>
  );
};