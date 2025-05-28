import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const socialIcons = [
    { name: "Twitter", icon: "/twitter.png" },
    { name: "Github", icon: "/github.png" },
    { name: "Linkedin", icon: "/linkedin.png" },
    { name: "Mail", icon: "/mail.png" },
  ];

  return (
    <footer className="bg-[#0F172A] text-gray-300 border-t border-gray-800">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Link href="/" className="flex items-center">
          <div className="text-[#1B89A4] font-bold text-2xl flex gap-1 items-center">
            <Image src="/logo.svg" alt="Billoq Logo" width={40} height={40} className="w-10 h-10" />
            Billoq
          </div>
        </Link>
            </div>
            <p className="text-sm mb-6 max-w-xs">
              A decentralized bill payment platform on the blockchain. Pay for
              electricity, cable TV, internet, and more with crypto.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social) => (
                <Link
                  key={social.name}
                  href="#"
                  className="hover:opacity-75 transition-opacity"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Menu Column */}
          <div className="mt-4 sm:mt-0">
            <h3 className="text-white font-semibold mb-3 text-lg">Menu</h3>
            <ul className="space-y-2">
              {["Home", "Services", "Features", "About Us"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-[#1B89A4] transition-colors text-sm sm:text-base"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="mt-4 sm:mt-0">
            <h3 className="text-white font-semibold mb-3 text-lg">Services</h3>
            <ul className="space-y-2">
              {["Electricity", "Mobile recharge", "Cable TV", "Internet"].map(
                (service) => (
                  <li key={service}>
                    <Link
                      href="#"
                      className="hover:text-[#1B89A4] transition-colors text-sm sm:text-base"
                    >
                      {service}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="mt-4 sm:mt-0">
            <h3 className="text-white font-semibold mb-3 text-lg">Resources</h3>
            <ul className="space-y-2">
              {["Documentation", "API", "Blog", "Contact Us", "FAQ"].map(
                (resource) => (
                  <li key={resource}>
                    <Link
                      href="#"
                      className="hover:text-[#1B89A4] transition-colors text-sm sm:text-base"
                    >
                      {resource}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Billoq. All rights reserved.</p>
          <div className="flex items-center justify-center mt-2">
            <Image
              src="/lisk.png" // Make sure this path is correct
              alt="Lisk Logo"
              width={23}
              height={23}
              className="w-5 h-5 mr-2"
            />
            <span>Powered by LISK</span>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link key={item} href="#" className="hover:text--400">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
