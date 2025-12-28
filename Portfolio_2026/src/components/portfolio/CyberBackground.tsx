import { ReactNode } from "react";

interface CyberBackgroundProps {
  children: ReactNode;
}

const CyberBackground = ({ children }: CyberBackgroundProps) => {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Animated grid background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10"></div>
        <div
          className="absolute inset-0 animate-grid-move"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-48 h-48 bg-primary rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Scanline effect */}
      <div className="fixed inset-0 z-20 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary to-transparent animate-scanline"
          style={{ height: "200%" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CyberBackground;
