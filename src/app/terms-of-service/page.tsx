import Header from '@/components/Header'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
          <div className="min-h-screen bg-[#0B0B14] text-white">
     
     <Header />
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl pt-32 pb-32">
        <h1 className="text-3xl font-bold mb-6 text-rose-500">Terms of Service</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LoopTalk, you agree to be bound by these Terms of Service. If you disagree with any
              part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">2. Description of Service</h2>
            <p>
              LoopTalk is a chat application that allows users to communicate through text, voice, and video. We reserve
              the right to modify or discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">3. User Accounts</h2>
            <p>
              You are responsible for safeguarding the password you use to access LoopTalk and for any activities or
              actions under your password. You agree not to disclose your password to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">4. User Conduct</h2>
            <p>
              You agree to use LoopTalk only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Use the service to transmit any unlawful, threatening, or harassing material</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">5. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by LoopTalk and are protected
              by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">6. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever, including without limitation if you
              breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">7. Limitation of Liability</h2>
            <p>
              In no event shall LoopTalk, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change
              will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-rose-400">9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p className="mt-2">
              Email:{" "}
              <a href="mailto:terms@looptalk.com" className="text-rose-400 hover:underline">
                terms@looptalk.com
              </a>
            </p>
          </section>
        </div>

        <p className="mt-8 text-sm text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-12 border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <h4 className="font-bold mb-4 text-[#FF4654]">Navigation</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/" className="inline-block hover:text-white transition-all">Home</Link></li>
                                <li><Link href="/login" className="inline-block hover:text-white transition-all">Login</Link></li>
                                <li><Link href="/register" className="inline-block hover:text-white transition-all">Register</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-[#FF4654]">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/privacy-policy" className="inline-block hover:text-white transition-all">Privacy Policy</Link></li>
                                <li><Link href="/terms-of-service" className="inline-block hover:text-white transition-all">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-[#FF4654]">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="mailto:devathulvinod@gmail.com" className="inline-block hover:text-white transition-all">Support Email</Link></li>
                                <li><Link href="#" className="inline-block hover:text-white transition-all">Open Source</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 text-center text-sm text-gray-400">
                        <p>© 2025 LoopTalk. All rights reserved.</p>
                    </div>
                </div>
            </footer>
    </div>
    </div>
  )
}

export default page