import HeroScroll from '@/components/HeroScroll';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroScroll />

      {/* Existing Content moved below */}
      <div className="relative z-10 bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 lg:p-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-black px-8 py-16 md:px-16 md:py-24 lg:px-24 lg:py-32 shadow-2xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>Welcome to the future</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                Build something
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {' '}extraordinary
                </span>
              </h1>

              <p className="mb-10 text-lg leading-relaxed text-slate-300 md:text-xl">
                Transform your ideas into reality with cutting-edge technology.
                Start your journey today and create experiences that matter.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-slate-100 text-base font-semibold px-8 h-12"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 bg-transparent text-white hover:bg-slate-900 text-base font-semibold px-8 h-12"
                >
                  Learn More
                </Button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-slate-800 pt-12">
                <div>
                  <div className="text-3xl font-bold text-white md:text-4xl">10k+</div>
                  <div className="mt-2 text-sm text-slate-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white md:text-4xl">99.9%</div>
                  <div className="mt-2 text-sm text-slate-400">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white md:text-4xl">24/7</div>
                  <div className="mt-2 text-sm text-slate-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
