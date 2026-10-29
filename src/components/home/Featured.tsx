
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface Destination {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: string | number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
}

const API_URL = "http://localhost:8000/featured-destinations";

export default function Featured() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDestinations() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load destinations (${response.status}).`
          );
        }

        const data: Destination[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response.");
        }

        setDestinations(data.slice(0, 5));
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDestinations();

    return () => controller.abort();
  }, []);


  return (
    <main className="bg-white px-4 pb-1 mb-10 pt-6 text-slate-900 sm:px-6 sm:pb-2 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Destinations
          </h1>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Handpicked travel experiences for the adventure seekers
          </p>
        </header>


        {/* Results count */}
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm text-slate-500" aria-live="polite">
            Showing {loading ? "..." : destinations.length}{" "}
            destinations
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border"
              >
                <div className="h-48 bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded bg-slate-200" />
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-9 w-28 rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <Button
              className="mt-4"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Destination cards */}
        {!loading && !error && (
          <>
            {destinations.length > 0 ? (
              <Carousel
                opts={{ align: "start", slidesToScroll: 1 }}
                className="w-full"
              >
                <div className="mb-4 flex justify-end gap-2">
                  <CarouselPrevious className="static" size="icon" />
                  <CarouselNext className="static" size="icon" />
                </div>
                <CarouselContent>
                  {destinations.map((destination) => (
                    <CarouselItem
                      key={destination._id}
                      className="basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <Card
                        className="group h-full overflow-hidden rounded-xl border border-slate-200 bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={destination.imageUrl}
                        alt={destination.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1.5 text-xs font-semibold shadow-sm">
                        4.5
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </div>
                    </div>

                    <CardContent className="space-y-3 p-4">
                      {/* Country */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{destination.country}</span>
                      </div>

                      {/* Name and price */}
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-serif text-lg font-semibold leading-tight">
                          {destination.name}
                        </h2>

                        <p className="shrink-0 text-right text-sm font-bold text-teal-700">
                          ৳{Number(destination.price).toLocaleString("en-BD")}
                          <span className="text-[10px] font-normal text-slate-500">
                            /Person
                          </span>
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{destination.duration}</span>
                      </div>

                      {/* Booking link */}
                      <Button
                        nativeButton={false}
                        render={
                          <a
                            href={`/destinations/${destination._id}`}
                            aria-label={`Book ${destination.name}`}
                          />
                        }
                        className="h-9 rounded-full bg-teal-50 px-4 text-xs font-semibold text-teal-800 shadow-none hover:bg-teal-700 hover:text-white"
                      >
                        BOOK NOW
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="rounded-xl border border-dashed p-12 text-center">
                <h2 className="font-semibold">
                  No destinations found
                </h2>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
