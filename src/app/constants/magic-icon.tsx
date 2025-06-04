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
  bgClassname = 'bg-gradient-to-br from-blue-200 to-blue-500 dark:from-blue-800 dark:to-blue-600',
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
        className={`absolute inset-0 rounded-full ${bgClassname} opacity-70 blur-sm scale-110 -z-10`}
      />
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-contain relative z-10"
      />
    </div>
  );
};
