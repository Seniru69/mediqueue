import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#eaf6f8] px-6 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* LEFT: Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Mediqueue"
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-bold text-[#2f6f78]">Mediqueue</span>
        </div>

        {/* CENTER: Contact */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-[#5aa7b4]" />
            <span>0112 200 200</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-[#5aa7b4]" />
            <span>mediqueue@gmail.com</span>
          </div>
        </div>

        {/* RIGHT: Social Icons */}
        <div className="flex items-center gap-3">
          <SocialIcon icon={<FaFacebookF />} />
          <SocialIcon icon={<FaInstagram />} />
          <SocialIcon icon={<FaTwitter />} />
          <SocialIcon icon={<FaLinkedinIn />} />
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-4 text-center text-xs text-gray-500">
        © 2025 Mediqueue. All rights reserved.
      </div>
    </footer>
  );
}

/* icon button */
function SocialIcon({ icon }) {
  return (
    <a
      href="#"
      className="p-2 rounded-full bg-white text-[#5aa7b4] hover:bg-[#5aa7b4] hover:text-white transition"
    >
      {icon}
    </a>
  );
}

export default Footer;
