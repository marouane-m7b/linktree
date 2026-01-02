import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";

const contactInfo = [
  {
    icon: FaEnvelope,
    value: "marouane@m7b.dev",
    href: "mailto:marouane@m7b.dev",
  },
  {
    icon: FaPhone,
    value: "+212 706 452 165",
    href: "tel:+212706452165",
  },
  {
    icon: FaMapMarkerAlt,
    value: "Morocco",
    href: "#",
  },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();
  const translations = UI_TRANSLATIONS[lang];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(translations.contact.toastSuccess);
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactLabels = {
    email: translations.contact.email,
    phone: translations.contact.phone,
    location: translations.contact.location,
  };

  return (
    <section id="contact" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            {translations.contact.getInTouch}
          </span>
          <h2 className="section-title">{translations.contact.letsWorkTogether}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {translations.contact.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-orbitron text-2xl font-bold text-card-foreground mb-6">
              {translations.contact.chat}
            </h3>
            <p className="font-rajdhani text-muted-foreground mb-8">
              {translations.contact.chatDescription}
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-primary/20 hover:border-primary/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-orbitron text-xs text-muted-foreground uppercase tracking-wider">
                      {contactLabels[info.value.toLowerCase()]}
                    </div>
                    <div className="font-rajdhani text-lg text-card-foreground group-hover:text-primary transition-colors">
                      {info.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 h-48 rounded-2xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FaMapMarkerAlt className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="font-orbitron text-sm text-muted-foreground">
                    {translations.contact.basedIn}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block font-orbitron text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {translations.contact.yourName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border-2 border-primary/30 text-card-foreground font-rajdhani placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:shadow-lg focus:shadow-primary/20 transition-all"
                  placeholder={translations.contact.placeholderName}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-orbitron text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {translations.contact.yourEmail}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border-2 border-primary/30 text-card-foreground font-rajdhani placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:shadow-lg focus:shadow-primary/20 transition-all"
                  placeholder={translations.contact.placeholderEmail}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-orbitron text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {translations.contact.yourMessage}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border-2 border-primary/30 text-card-foreground font-rajdhani placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:shadow-lg focus:shadow-primary/20 transition-all resize-none"
                  placeholder={translations.contact.placeholderMessage}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cyber-button-fill flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    {translations.contact.sending}
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    {translations.contact.sendMessage}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
