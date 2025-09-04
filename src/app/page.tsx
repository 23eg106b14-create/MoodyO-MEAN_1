
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

const moons = [
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/cursor.svg', alt: 'cursor' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/eyes.svg', alt: 'eyes' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/light.svg', alt: 'light' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/planet.svg', alt: 'planet' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/pointer.svg', alt: 'pointer' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/03/award.svg', alt: 'award' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/plant.svg', alt: 'plant' },
];

export default function Home() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleTopRef = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);
  const moonRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(titleTopRef.current, {
        '--perspective-x': x * 15,
        '--perspective-y': y * -15,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.to(titleBottomRef.current, {
        '--perspective-x': x * 15,
        '--perspective-y': y * -15,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    moonRefs.current.forEach((moon, i) => {
      if (moon) {
        gsap.to(moon, {
          motionPath: {
            path: '#motionpath-path',
            align: '#motionpath-path',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: i / moons.length,
            end: (i + 1) / moons.length,
          },
          duration: 40,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });

        // Add individual random motion
        gsap.to(moon, {
          x: '+=random(-20, 20)',
          y: '+=random(-20, 20)',
          rotation: '+=random(-15, 15)',
          repeat: -1,
          yoyo: true,
          duration: 5,
          ease: 'power1.inOut',
        });
      }
    });

    header.addEventListener('mousemove', onMouseMove);

    return () => {
      header.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <main>
      <section className="homepage-header" ref={headerRef}>
        <div className="homepage-header__titles">
          <h1 className="sr-only">Creative Developer</h1>
          <h1
            className="homepage-header__title homepage-header__title--top huge-hero vf caps"
            aria-hidden="true"
            ref={titleTopRef}
          >
            Creative
          </h1>
          <div className="moons">
            {moons.map((moon, i) => (
              <div
                className="item"
                aria-hidden="true"
                key={moon.alt}
                ref={(el) => (moonRefs.current[i] = el)}
              >
                <Image loading="lazy" src={moon.src} alt={moon.alt} width={80} height={80} />
              </div>
            ))}
          </div>

          <svg
            aria-hidden="true"
            className="motionpath"
            viewBox="0 0 1474 782"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="motionpath-path"
              d="M723.5 35.0001C1144.17 -39.9999 1836.8 -41.2999 1242 553.5C498.5 1297 -832.5 -25.9997 723.5 35.0001Z"
            ></path>
          </svg>

          <h1
            className="homepage-header__title homepage-header__title--bottom huge-hero vf caps"
            aria-hidden="true"
            ref={titleBottomRef}
          >
            Developer
          </h1>
        </div>
      </section>
    </main>
  );
}
