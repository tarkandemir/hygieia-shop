'use client';

import { Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Bottom Footer */}
      <div className="bg-[#000069] text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-xs">
              © Tüm hakları saklıdır. 2025 Hygieia
            </p>
            
            <div className="flex items-center space-x-6">
              <a
                href="mailto:info@hygieiatr.com"
                className="text-xs hover:text-[#6AF0D2] transition-colors"
              >
                info@hygieiatr.com
              </a>
              
              <div className="flex items-center space-x-4">
                <a
                  href="https://linkedin.com/company/hygieia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs tracking-wider hover:text-[#6AF0D2] transition-colors"
                  style={{ letterSpacing: '5%' }}
                >
                  <Linkedin size={14} />
                  <span>LINKEDIN</span>
                </a>
                
                <a
                  href="https://instagram.com/hygieia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs tracking-wider hover:text-[#6AF0D2] transition-colors"
                  style={{ letterSpacing: '5%' }}
                >
                  <Instagram size={14} />
                  <span>INSTAGRAM</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
