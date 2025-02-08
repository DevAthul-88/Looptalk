import Header from "@/components/Header"
import { Metadata } from "next"
import Link from "next/link"


export const metadata: Metadata = {
    title: 'Privacy Policy - LoopTalk',
    description: 'Privacy Policy page',
}


export default function page() {
    return (
        <div className="min-h-screen bg-[#0B0B14] text-white">
            <Header />

            {/* Main content */}
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl pt-32 pb-32">
                <h1 className="text-3xl font-bold mb-6 text-rose-500">Privacy Policy</h1>

                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-rose-400">1. Information We Collect</h2>
                        <p>
                            LoopTalk collects and processes your personal information to provide and improve our services. This may
                            include:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li>Account information (e.g., username, email address)</li>
                            <li>Communication data (e.g., messages, voice chats)</li>
                            <li>Usage information and analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-rose-400">2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li>Provide and maintain the LoopTalk service</li>
                            <li>Improve and personalize your experience</li>
                            <li>Communicate with you about service-related matters</li>
                            <li>Ensure compliance with our terms and policies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-rose-400">3. Data Security</h2>
                        <p>
                            LoopTalk implements industry-standard security measures to protect your personal information. However, no
                            method of transmission over the Internet or electronic storage is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-rose-400">4. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information. You may also have the right to
                            object to or restrict certain types of processing. To exercise these rights, please contact us using the
                            information provided below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-rose-400">5. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                            Privacy Policy on this page and updating the "Last Updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-rose-400">6. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p className="mt-2">
                            Email:{" "}
                            <a href="mailto:privacy@looptalk.com" className="text-rose-400 hover:underline">
                                privacy@looptalk.com
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
    )
}

