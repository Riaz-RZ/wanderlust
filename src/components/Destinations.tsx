
"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

const API_URL = "http://localhost:8000/destinations";

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

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

        setDestinations(data);
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

  const categories = useMemo(
    () => [...new Set(destinations.map((item) => item.category))].sort(),
    [destinations]
  );

  const filteredDestinations = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      const price = Number(destination.price);

      const matchesCategory =
        category === "all" ||
        destination.category === category;

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "budget" && price <= 10000) ||
        (priceRange === "mid" &&
          price > 10000 &&
          price <= 40000) ||
        (priceRange === "premium" && price > 40000);

      return matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "price-low":
        return filtered.sort(
          (a, b) => Number(a.price) - Number(b.price)
        );

      case "price-high":
        return filtered.sort(
          (a, b) => Number(b.price) - Number(a.price)
        );

      case "name":
        return filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      case "departure":
        return filtered.sort(
          (a, b) =>
            new Date(a.departureDate).getTime() -
            new Date(b.departureDate).getTime()
        );

      default:
        return filtered;
    }
  }, [destinations, category, priceRange, sortBy]);

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-7">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-700">
            Discover Amazing Places
          </p>

          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Explore All Destinations
          </h1>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Find your perfect travel experience from our curated collection
          </p>
        </header>

        {/* Filters */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 px-4 py-2">
            <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-500">
              CATEGORY
            </label>

            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "")}
            >
              <SelectTrigger className="h-7 border-0 p-0 shadow-none focus:ring-0">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-slate-200 px-4 py-2">
            <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-500">
              PRICE RANGE
            </label>

            <Select
              value={priceRange}
              onValueChange={(value) => setPriceRange(value ?? "")}
            >
              <SelectTrigger className="h-7 border-0 p-0 shadow-none focus:ring-0">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Under ৳10,000</SelectItem>
                <SelectItem value="mid">৳10,001–৳40,000</SelectItem>
                <SelectItem value="premium">Above ৳40,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-slate-200 px-4 py-2">
            <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-500">
              SORT BY
            </label>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value ?? "")}
            >
              <SelectTrigger className="h-7 border-0 p-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Popular" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="price-low">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
                <SelectItem value="departure">
                  Departure Date
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500" aria-live="polite">
            Showing {loading ? "..." : filteredDestinations.length}{" "}
            destinations
          </p>

          {(category !== "all" ||
            priceRange !== "all" ||
            sortBy !== "popular") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory("all");
                setPriceRange("all");
                setSortBy("popular");
              }}
            >
              Reset filters
            </Button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
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
            {filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDestinations.map((destination) => (
                  <Card
                    key={destination._id}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-12 text-center">
                <h2 className="font-semibold">
                  No destinations found
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your filters to find more destinations.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setCategory("all");
                    setPriceRange("all");
                    setSortBy("popular");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
