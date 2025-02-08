import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Bot, Shield } from 'lucide-react';

const FeatureSections = () => {
  const features = [
    {
      title: ['Text channels', 'done right.'],
      description: 'Create engaging conversations with rich media support. Share images, documents, and code snippets with ease. @ mentions, reactions, and threading keep discussions organized and lively.',
      gradients: {
        primary: 'from-purple-600 to-purple-900',
        section: 'from-black via-purple-950/20 to-black',
      },
      icon: MessageSquare,
      emoji: '💬',
      alignment: 'left',
    },
    {
      title: ['Build your', 'community.'],
      description: 'Take control of your space with powerful moderation tools. Custom roles, permission systems, and automated moderation keep your community safe and welcoming.',
      gradients: {
        primary: 'from-emerald-600 to-emerald-900',
        section: 'from-black via-emerald-950/20 to-black',
      },
      icon: Users,
      emoji: '🌟',
      alignment: 'right',
    },
    {
      title: ['Make it', 'yours.'],
      description: 'Customize everything with our powerful bot API and SDK. Create custom commands, automate tasks, and integrate with your favorite tools. Built with developers in mind.',
      gradients: {
        primary: 'from-amber-600 to-amber-900',
        section: 'from-black via-amber-950/20 to-black',
      },
      icon: Bot,
      emoji: '🤖',
      alignment: 'left',
    },
    {
      title: ['Secure and', 'confidential.'],
      description: 'Your privacy is our priority. End-to-end encryption, secure data storage, and strict privacy controls keep your conversations safe. No data mining, no ads, and full GDPR compliance.',
      gradients: {
        primary: 'from-blue-600 to-blue-900',
        section: 'from-black via-blue-950/20 to-black',
      },
      icon: Shield,
      emoji: '🔒',
      alignment: 'right',
    },
  ];

  return (
    <div className="bg-black text-white">
      {features.map((feature, index) => (
        <div key={index} className="relative">
          {/* Smooth gradient separator */}
          <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradients.section}`} />
          
          <section className="relative py-24">
            {/* Content gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br opacity-10">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradients.primary}`} />
            </div>

            <div className="container mx-auto px-6 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: feature.alignment === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`${feature.alignment === 'right' ? 'lg:order-2' : ''}`}
                >
                  {/* Compact emoji box */}
                  <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-lg border border-white/10 mb-8 backdrop-blur-sm">
                    <span className="text-2xl mr-3">{feature.emoji}</span>
                    <div className="h-4 w-px bg-white/10 mr-3" />
                    <feature.icon className="w-4 h-4 text-white/70" />
                  </div>

                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                    {feature.title.map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < feature.title.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p className="text-lg text-gray-200 leading-relaxed max-w-xl">
                    {feature.description}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`${feature.alignment === 'right' ? 'lg:order-1' : ''}`}
                >
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradients.primary} blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradients.primary} opacity-10`} />
                      <feature.icon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/70 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
};

export default FeatureSections;