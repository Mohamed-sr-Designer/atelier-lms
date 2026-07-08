import Image from "next/image";
import { getAsset } from "@/lib/assets";
import { withBase } from "@/lib/base";

// Optimized image wrapper. Pulls width/height/blur from the generated manifest
// so every image ships a blur-up placeholder and correct intrinsic ratio.
// Assets outside the manifest (e.g. /lms/*) can pass width/height explicitly.
export function Media({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  fill = false,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}) {
  const meta = getAsset(src);
  const url = withBase(src);

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={meta.blur}
        className={className}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width ?? meta.width}
      height={height ?? meta.height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={meta.blur}
      className={className}
    />
  );
}
