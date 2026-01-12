import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Truck, Shield, Trees, Clock } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export const Footer = () => {
  const { settings, isLoading } = useSiteSettings();
  
  if (isLoading || !settings) {
    return null; // or a footer skeleton
  }
  
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-900/30">
        {/* Wood Grain Texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-emerald-900/5 to-amber-900/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-amber-900/3 to-emerald-900/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 pt-20 pb-12">
        {/* Top CTA Banner */}
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-r from-emerald-800/80 to-emerald-900/80 rounded-2xl p-8 text-center border border-emerald-700/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need Timber for Your Next Project?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Get a free quote on structural and industrial timber. Our experts are ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`tel:${settings.contactPhone?.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now: {settings.contactPhone}
              </a>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-full blur-xl"></div>
                  <img 
                    src={settings.companyLogo || '/logo.jpeg'} 
                    alt={`${settings.companyName} Logo`}
                    className="relative w-14 h-14 object-cover rounded-xl border-2 border-white/20"
                  />
                </div>
                <div>
                  <span className="font-bold text-2xl text-white">{settings.companyName}</span>
                  <p className="text-emerald-300 text-sm font-medium mt-1">{settings.footerTagline}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                {settings.footerDescription}
              </p>
              
              <div className="flex gap-4">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                    <Facebook className="h-5 w-5 text-white" />
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                    <Instagram className="h-5 w-5 text-white" />
                  </a>
                )}
                <a href={`mailto:${settings.contactEmail}`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Mail className="h-5 w-5 text-white" />
                </a>
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.892 0-3.18-1.24-6.162-3.495-8.411"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6 pb-3 border-b border-emerald-700/30">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'About Us', path: '/about' },
                  { label: 'Our Products', path: '/products' },
                  { label: 'Gallery', path: '/gallery' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'Get Quote', path: '/contact' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6 pb-3 border-b border-emerald-700/30">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-900/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">{settings.contactAddress}</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-900/30 rounded-lg">
                    <Phone className="h-4 w-4 text-emerald-300" />
                  </div>
                  <a href={`tel:${settings.contactPhone?.replace(/\s/g, '')}`} className="text-gray-300 hover:text-emerald-300 transition-colors">
                    <span className="font-medium">{settings.contactPhone}</span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-900/30 rounded-lg">
                    <Mail className="h-4 w-4 text-emerald-300" />
                  </div>
                  <a href={`mailto:${settings.contactEmail}`} className="text-gray-300 hover:text-emerald-300 transition-colors break-all">
                    {settings.contactEmail}
                  </a>
                </li>
              </ul>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6 pb-3 border-b border-emerald-700/30">Business Hours</h3>
              <div className="space-y-2 text-gray-300 whitespace-pre-line">
                {settings.businessHours.split('\n').map((line, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-emerald-300 mt-1 flex-shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <Shield className="h-4 w-4" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <Trees className="h-4 w-4" />
                  <span>Sustainable Sourcing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <Truck className="h-4 w-4" />
                  <span>Nationwide Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-emerald-800/30 my-8"></div>

          {/* Copyright & Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {settings.footerCopyrightText}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-emerald-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-emerald-300 transition-colors">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-emerald-300 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
    </footer>
  );
};