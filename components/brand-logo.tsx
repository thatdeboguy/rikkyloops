import Image from "next/image";

export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return <Image className="brand-logo" src="/images/rikkyloops-logo.jpeg" alt="RikkyLoops — handmade with love" width={1181} height={1181} sizes="(max-width: 700px) 72px, 112px" priority={priority}/>;
}
