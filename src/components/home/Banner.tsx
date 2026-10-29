import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
];

export default function Banner() {
  return (
    <section className="relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/Banner.png"
          alt="Aerial view of a beach cove"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex min-h-140 flex-col items-center justify-center px-4 pt-24 pb-36 text-center">
        <h1 className="text-4xl font-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-5 max-w-150 text-sm leading-relaxed text-white/85 md:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/destinations"
            className="flex items-center gap-2 bg-teal-600 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-700"
          >
            Explore Now
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href="/destinations"
            className="border border-white/70 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            View Destination
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative z-10 flex w-full flex-col border-t border-white/15 bg-black/50 backdrop-blur-sm sm:flex-row">
        {searchFields.map((field) => (
          <div
            key={field.label}
            className="flex-1 border-b border-white/15 px-6 py-3 text-left last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
          >
            <p className="text-xs font-semibold text-white md:text-sm">
              {field.label}
            </p>
            <p className="mt-0.5 text-[11px] text-white/60">
              {field.placeholder}
            </p>
          </div>
        ))}
        <button
          type="button"
          className="bg-teal-600 px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-teal-700 sm:min-w-32"
        >
          Search
        </button>
      </div>
    </section>
  );
}
