import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className = '', showText = true, size = 'md' }) {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 64,
    xl: 80,
  };

  const pixelSize = sizes[size] || 40;

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative overflow-hidden rounded-xl bg-white p-1">
        <Image
          src="/logo.png"
          alt="NCAI Logo"
          width={pixelSize}
          height={pixelSize}
          className="object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-foreground ${size === 'lg' || size === 'xl' ? 'text-2xl' : 'text-lg'}`}>
            AccuBooks
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            Recruitment System
          </span>
        </div>
      )}
    </Link>
  );
}
