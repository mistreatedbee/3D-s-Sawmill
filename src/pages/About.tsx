import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/useSiteSettings';

export const About = () => {
  const { settings, isLoading, error } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading about content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto p-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <h1 className="text-xl font-bold text-red-900 dark:text-red-200">Unable to load About page</h1>
          <p className="text-red-800 dark:text-red-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const hasAnyAboutContent = Boolean(
    settings?.aboutTitle ||
      settings?.aboutSubtitle ||
      settings?.aboutDescription ||
      settings?.aboutMission ||
      settings?.aboutVision ||
      settings?.aboutImage
  );

  if (!settings || !hasAnyAboutContent) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4">About page content is not available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-stone-50 to-white dark:from-gray-900/50 dark:to-gray-900">
      <section className="container mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 mb-5">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-emerald-800">
                  {settings.aboutSubtitle}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {settings.aboutTitle}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">
                {settings.aboutDescription}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-3xl blur opacity-60 dark:opacity-25"></div>
              <div className="relative rounded-3xl overflow-hidden border border-gray-200/60 dark:border-gray-700/40 bg-white/70 dark:bg-gray-800/30 backdrop-blur-sm shadow-lg">
                {settings.aboutImage ? (
                  <img
                    src={settings.aboutImage}
                    alt={settings.aboutTitle}
                    className="w-full h-[320px] md:h-[380px] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-[320px] md:h-[380px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No image provided
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/30 dark:to-gray-900/20 border border-gray-200/50 dark:border-gray-700/30 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{settings.aboutMission}</p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/30 dark:to-gray-900/20 border border-gray-200/50 dark:border-gray-700/30 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{settings.aboutVision}</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

