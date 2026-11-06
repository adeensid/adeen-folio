"use client";

import Image from "next/image";
import { useRef } from "react";

type PortraitProps = {
  name: string;
};

export function Portrait({ name }: PortraitProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      handlePointerLeave();
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
    imageRef.current?.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0) scale(1.04)`);
  }

  function handlePointerLeave() {
    imageRef.current?.style.removeProperty("transform");
  }

  return (
    <div className="portrait" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <div className="portrait-media">
        <Image
          ref={imageRef}
          className="portrait-image"
          src="/img/adeen.jpg"
          alt={`Portrait of ${name}`}
          width={900}
          height={1351}
          priority
          sizes="(max-width: 820px) 80vw, 380px"
        />
      </div>
    </div>
  );
}
