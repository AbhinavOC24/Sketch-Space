import * as LucideIcons from "lucide-react";
const { ArrowRight } = LucideIcons as any;

const Hero = () => {
  return (
    <section className="pt-32 pb-24 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            Draw, Collaborate, Create
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A beautiful whiteboard tool that lets you express your ideas with
            freedom. Just like Excalidraw, but with our special touch.
          </p>
        </div>
        <div className="mt-16 rounded-xl border border-border bg-card p-2 shadow-2xl">
          <div className="aspect-video rounded-lg bg-secondary"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
