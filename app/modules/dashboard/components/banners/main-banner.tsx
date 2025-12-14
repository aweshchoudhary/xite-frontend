"use client";
import OptimizedImage from "@/modules/common/components/ui/optimized-image";

export default function MainBanner() {
  return (
    <>
      <div className="relative overflow-hidden rounded-lg px-6 py-3 bg-sidebar shadow">
        {/* Foreground content */}
        <div className="relative z-10 flex items-end gap-3 banner-fade-in-up">
          <OptimizedImage
            src="/logo.png"
            alt="XED logo"
            className="w-[90px] dark:brightness-150 h-auto"
            width={120}
            height={120}
            priority
            quality={90}
            sizes="120px"
            placeholder="blur"
          />
          <h2 className="h3 leading-none tracking-tight text-foreground text-balance">
            XED Integrated Transformation Engine
          </h2>
        </div>

        {/* Decorative X on the right */}
        <div className="absolute top-1/2 right-2 -translate-y-1/2 z-0">
          <OptimizedImage
            src="/x-logo.png"
            alt="decorative x"
            className="w-[80px] h-auto opacity-50 dark:brightness-150"
            width={120}
            height={120}
            sizes="120px"
            quality={75}
            placeholder="blur"
          />
        </div>

        {/* Subtle shine sweep */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="banner-shine" aria-hidden />
        </div>
      </div>

      <style jsx>{`
        /* Motion safety */
        @media (prefers-reduced-motion: reduce) {
          .banner-fade-in-up,
          .banner-shine {
            animation: none !important;
            transform: none !important;
          }
        }

        /* Content entrance */
        .banner-fade-in-up {
          animation: fade-up 700ms ease-out both;
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translate3d(0, 10px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* Shine sweep */
        .banner-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 35%,
            rgba(255, 255, 255, 0.12) 50%,
            rgba(255, 255, 255, 0.06) 65%,
            transparent 100%
          );
          transform: translateX(-120%);
          animation: shine-move 6s ease-in-out infinite;
        }
        @keyframes shine-move {
          0% {
            transform: translateX(-120%);
          }
          20% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
    </>
  );
}
