import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/CTA.png"
          alt="Airplane flying over a tropical island"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-110 flex-col items-center justify-center px-4 py-20 text-center md:min-h-125">
        <h2 className="text-3xl font-normal text-white md:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 text-sm text-white/80 md:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href="/destinations"
          className="mt-7 flex items-center gap-2 bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900 transition-colors hover:bg-gray-100 md:text-sm"
        >
          Book Your Trip Today
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  );
}
