import React from "react";
import { Hand, MousePointer2, Square, Circle, Pen, Type, Eraser } from "lucide-react";

const AnimatedMockup = () => {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Floating Toolbar Mockup */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
        <div className="p-1.5 text-white/40"><Hand size={14} /></div>
        <div className="p-1.5 text-white/40"><MousePointer2 size={14} /></div>
        <div className="p-1.5 text-purple-500 bg-purple-500/20 rounded-lg"><Square size={14} /></div>
        <div className="p-1.5 text-white/40"><Circle size={14} /></div>
        <div className="p-1.5 text-white/40"><Pen size={14} /></div>
        <div className="p-1.5 text-white/40"><Type size={14} /></div>
        <div className="p-1.5 text-white/40"><Eraser size={14} /></div>
      </div>

      {/* Animated Shapes */}
      <svg className="absolute inset-0 h-full w-full">
        {/* Drawing Rectangle Animation */}
        <rect
          x="20%" y="30%" width="150" height="100"
          className="fill-purple-500/10 stroke-purple-500 stroke-2 [stroke-dasharray:1000] animate-[draw_4s_ease-in-out_infinite]"
          rx="8"
        />
        
        {/* Drawing Circle Animation */}
        <circle
          cx="70%" cy="50%" r="60"
          className="fill-blue-500/10 stroke-blue-500 stroke-2 [stroke-dasharray:1000] animate-[draw_4s_ease-in-out_infinite_1s]"
        />

        {/* Drawing Line Animation */}
        <path
          d="M 30% 70% Q 40% 60%, 50% 80% T 70% 60%"
          className="fill-none stroke-orange-500 stroke-2 [stroke-dasharray:1000] animate-[draw_4s_ease-in-out_infinite_2s]"
        />
      </svg>

      {/* Animated Cursors */}
      <div className="absolute top-[40%] left-[25%] flex items-center gap-2 animate-[cursor_8s_infinite]">
        <MousePointer2 className="text-purple-500 fill-purple-500 h-4 w-4" />
        <span className="px-2 py-0.5 rounded-full bg-purple-500 text-[10px] text-white font-bold">Abhinav</span>
      </div>

      <div className="absolute top-[60%] left-[65%] flex items-center gap-2 animate-[cursor-alt_6s_infinite]">
        <MousePointer2 className="text-blue-500 fill-blue-500 h-4 w-4" />
        <span className="px-2 py-0.5 rounded-full bg-blue-500 text-[10px] text-white font-bold">Sarah</span>
      </div>

      <style jsx>{`
        @keyframes draw {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          20% { opacity: 1; }
          50% { stroke-dashoffset: 0; }
          80% { opacity: 1; }
          100% { opacity: 0; stroke-dashoffset: 0; }
        }
        @keyframes cursor {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(100px, -20px); }
          50% { transform: translate(50px, 100px); }
          75% { transform: translate(-30px, 40px); }
        }
        @keyframes cursor-alt {
          0%, 100% { transform: translate(0, 0); }
          30% { transform: translate(-80px, 50px); }
          60% { transform: translate(40px, -60px); }
        }
      `}</style>
    </div>
  );
};

const Hero = ({ children }: { children?: React.ReactNode }) => {
  return (
    <section className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight">
            Sketch Together, <br /> Anywhere in the World.
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
            Real-time collaborative whiteboarding with zero friction. Built for designers, developers, and creative minds who demand a premium experience.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            {children}
          </div>
        </div>

        <div className="mt-24 max-w-5xl mx-auto">
          <div className="p-3 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
            <AnimatedMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
