import Image from 'next/image';

interface MagicIconProps {
  src: string;
  alt: string;
  bgClassname?: string;
  size?: number;
}

export const MagicIcon = ({
  src,
  alt,
  bgClassname = 'bg-purple-100 dark:bg-purple-900',
  size = 64,
}: MagicIconProps) => {
  return (
    <div
      className="relative items-center flex justify-center"
      style={{
        height: size,
        width: size,
      }}
    >
      <div
        className={`absolute -z-10 w-full h-full rounded-full blur-2xl opacity-80 ${bgClassname}`}
        style={{
          background: bgClassname
            ? undefined
            : `radial-gradient(circle at center, rgba(255,255,150,0.9) 0%, rgba(255,255,150,0.4) 30%, transparent 60%)`,
          transform: 'scale(0.85)',
        }}
      />
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-contain relative z-10"
        priority
      />
    </div>
  );
};
