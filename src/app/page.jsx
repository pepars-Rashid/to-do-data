import Link from 'next/link';
import { FiArrowRight, FiDatabase, FiZap, FiSmartphone, FiGlobe } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 py-24" 
         style={{
           backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
         }}>
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            To-Do Data
            <span className="text-zinc-400 text-3xl block mt-2">Advanced Sync Demo</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A sophisticated Next.js todo application demonstrating offline-first architecture 
            with real-time synchronization between local and remote databases.
          </p>
        </div>

        {/* Project Summary */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Project Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-zinc-300 mb-3">🛠️ Technology Stack</h3>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-center gap-2">
                  <FiZap className="text-blue-400" />
                  Next.js 15 with App Router
                </li>
                <li className="flex items-center gap-2">
                  <FiDatabase className="text-green-400" />
                  PostgreSQL + IndexedDB
                </li>
                <li className="flex items-center gap-2">
                  <FiSmartphone className="text-purple-400" />
                  Offline-first architecture
                </li>
                <li className="flex items-center gap-2">
                  <FiGlobe className="text-orange-400" />
                  Real-time synchronization
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-zinc-300 mb-3">✨ Key Features</h3>
              <ul className="space-y-2 text-zinc-400">
                <li>• Optimistic UI updates</li>
                <li>• Background sync queue</li>
                <li>• Time-based task creation</li>
                <li>• Smooth animations</li>
                <li>• Dark theme design</li>
                <li>• Responsive layout</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link href="/to-do-data-1" 
                className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Method 1</h3>
              <p className="text-zinc-400 mb-4">Primary todo implementation with full sync capabilities</p>
              <div className="flex items-center justify-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="text-sm font-medium">Try it out</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/to-do-data-2" 
                className="group bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Method 2</h3>
              <p className="text-zinc-400 mb-4">Alternative implementation with enhanced features</p>
              <div className="flex items-center justify-center gap-2 text-green-400 group-hover:text-green-300 transition-colors">
                <span className="text-sm font-medium">Try it out</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-zinc-500 text-sm">
            Built with Next.js, Drizzle ORM, and Dexie.js
          </p>
        </div>
      </div>
    </div>
  );
}