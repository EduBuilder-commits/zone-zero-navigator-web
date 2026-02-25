'use client'

import { useState } from 'react'
import { 
  Shield, Upload, Camera, FileText, CheckCircle, AlertTriangle, 
  Home, Menu, X, ChevronRight, Phone, Mail, MapPin
} from 'lucide-react'
import Link from 'next/link'

// Landing Page Component
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-emerald-400 mr-2" />
              <span className="text-xl font-bold text-white">Zone Zero Navigator</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition">Features</Link>
              <Link href="#how-it-works" className="text-slate-300 hover:text-white transition">How It Works</Link>
              <Link href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</Link>
              <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-white/10 px-4 py-4 space-y-4">
            <Link href="#features" className="block text-slate-300 hover:text-white">Features</Link>
            <Link href="#how-it-works" className="block text-slate-300 hover:text-white">How It Works</Link>
            <Link href="#pricing" className="block text-slate-300 hover:text-white">Pricing</Link>
            <Link href="/dashboard" className="block bg-emerald-500 text-white px-4 py-2 rounded-lg text-center">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Protect Your Home from<br />
            <span className="text-emerald-400">Wildfire Compliance</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            AI-powered compliance scanning for California homeowners. 
            Ensure your property meets defensible space requirements — or get dropped by insurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/audit" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <Camera className="w-5 h-5" />
              Start Free Scan
            </Link>
            <a 
              href="#how-it-works" 
              className="border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              Learn More
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400">5ft</div>
              <div className="text-slate-400">Defensible Space</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">50K+</div>
              <div className="text-slate-400">Homes Scanned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">98%</div>
              <div className="text-slate-400">Compliance Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">CA</div>
              <div className="text-slate-400">Jurisdictions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <Camera className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">AI Photo Analysis</h3>
              <p className="text-slate-400">
                Upload photos of vegetation around your home. Our AI identifies compliance issues instantly.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <FileText className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Insurance Reports</h3>
              <p className="text-slate-400">
                Generate PDF compliance reports to submit to your insurance company — or they'll drop you.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <Shield className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Remediation Plans</h3>
              <p className="text-slate-400">
                Get actionable recommendations to bring your property into compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Upload Photos', desc: 'Take pictures of vegetation within 5ft of your home' },
              { step: '2', title: 'AI Analysis', desc: 'Our AI checks for prohibited plants and objects' },
              { step: '3', title: 'Get Report', desc: 'Receive a detailed compliance report' },
              { step: '4', title: 'Share & Save', desc: 'Submit to insurance or share with landscapers' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-4">$0</div>
              <ul className="text-slate-400 space-y-2 mb-6">
                <li>✅ 1 compliance scan</li>
                <li>✅ Basic report</li>
                <li>❌ PDF export</li>
              </ul>
              <Link href="/dashboard" className="block w-full bg-slate-700 text-white py-2 rounded-lg">
                Get Started
              </Link>
            </div>
            <div className="bg-gradient-to-b from-emerald-500/20 border-2 border-emerald-500 rounded-2xl p-6 text-center">
              <div className="text-emerald-400 font-semibold mb-2">MOST POPULAR</div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
              <div className="text-4xl font-bold text-white mb-4">$29</div>
              <ul className="text-slate-300 space-y-2 mb-6">
                <li>✅ 25 compliance scans</li>
                <li>✅ Full PDF reports</li>
                <li>✅ Share with insurance</li>
                <li>✅ Remediation plans</li>
              </ul>
              <Link href="/dashboard" className="block w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600">
                Get Started
              </Link>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-4">$99</div>
              <ul className="text-slate-400 space-y-2 mb-6">
                <li>✅ Unlimited scans</li>
                <li>✅ Full PDF reports</li>
                <li>✅ Priority support</li>
                <li>✅ API access</li>
              </ul>
              <Link href="/dashboard" className="block w-full bg-slate-700 text-white py-2 rounded-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-emerald-400 mr-2" />
                <span className="text-xl font-bold text-white">Zone Zero</span>
              </div>
              <p className="text-slate-400">AI-powered wildfire compliance for California homeowners.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@zonezero.ai</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-500">
            © 2026 Zone Zero Navigator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
