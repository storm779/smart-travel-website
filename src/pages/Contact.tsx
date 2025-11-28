import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Reveal } from "../components/Reveal";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 font-kugile italic">
              Contact{" "}
              <span className="text-lilac/80 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Us
              </span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              We're here to help. Reach out to us anytime.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-16">
          <Reveal delay={200}>
            <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 text-center group border border-transparent hover:border-gray-100 h-full">
              <Phone className="h-12 w-12 text-lilac mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kugile">Phone</h3>
              <p className="text-gray-600 mb-1">+91 98765 43210</p>
              <p className="text-gray-600">+91 98765 43211</p>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 text-center group border border-transparent hover:border-gray-100 h-full">
              <Mail className="h-12 w-12 text-lilac mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kugile">Email</h3>
              <p className="text-gray-600 mb-1">info@smarttravel.com</p>
              <p className="text-gray-600">support@smarttravel.com</p>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 text-center group border border-transparent hover:border-gray-100 h-full">
              <Clock className="h-12 w-12 text-lilac mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kugile">Working Hours</h3>
              <p className="text-gray-600 mb-1">Mon - Sat: 9 AM - 9 PM</p>
              <p className="text-gray-600">Sunday: 10 AM - 6 PM</p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <Reveal delay={200}>
            <div className="bg-white rounded-[2.5rem] shadow-lg p-10 border border-gray-100 h-full">
              <h2 className="text-3xl font-light text-gray-900 mb-8 font-kugile italic">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-lilac/20 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-lilac/20 transition-all"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-lilac/20 transition-all"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-lilac/20 transition-all resize-none"
                    placeholder="How can we help you?"></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-lilac text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Send Message
                </button>
              </form>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="bg-white rounded-[2.5rem] shadow-lg p-10 border border-gray-100 h-full flex flex-col">
              <h2 className="text-3xl font-light text-gray-900 mb-8 font-kugile italic">
                Our Office
              </h2>
              <div className="space-y-8 flex-1">
                <div className="flex items-start space-x-4">
                  <div className="bg-lilac/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-lilac flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg font-kugile">Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      123 Travel Street, Andheri West
                      <br />
                      Mumbai, Maharashtra 400001
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160992238!2d72.71637344999999!3d19.082177549999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"></iframe>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-lg font-kugile">Quick Links</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center space-x-2 hover:text-lilac cursor-pointer transition-colors">
                      <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                      <span>FAQ</span>
                    </li>
                    <li className="flex items-center space-x-2 hover:text-lilac cursor-pointer transition-colors">
                      <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                      <span>Cancellation Policy</span>
                    </li>
                    <li className="flex items-center space-x-2 hover:text-lilac cursor-pointer transition-colors">
                      <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                      <span>Terms & Conditions</span>
                    </li>
                    <li className="flex items-center space-x-2 hover:text-lilac cursor-pointer transition-colors">
                      <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                      <span>Privacy Policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
