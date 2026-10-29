import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Crafted. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/person2.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person1.png",
  },
  {
    quote:
      "Tokyo In Autumn Was Pure Magic. From Bustling Streets To Quiet Temples, Every Day Brought A New Surprise. The Itinerary Balanced Perfectly.",
    name: "James Wilson",
    location: "Toronto, Canada",
    image: "/images/person2.png",
  },
  {
    quote:
      "The Maldives Getaway Was Everything We Hoped For And More. Crystal Clear Water, A Private Villa And The Most Relaxing Week Of Our Lives.",
    name: "Emily Carter",
    location: "Sydney, Australia",
    image: "/images/person1.png",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl">
        <Carousel opts={{ align: "start", loop: false }}>
          {/* Header with inline prev/next buttons (mockup puts them top-right) */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-3xl font-normal text-gray-900 md:text-4xl">
                What Travelers Say
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <CarouselPrevious className="static" size="icon" />
              <CarouselNext className="static" size="icon" />
            </div>
          </div>

          <CarouselContent className="mt-8">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name} className="md:basis-1/2">
                <figure className="flex h-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <blockquote className="text-sm leading-relaxed text-gray-700">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <figcaption className="mt-6 flex gap-1.5">
                      <span aria-hidden className="text-teal-600">
                        —
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-teal-600">
                          {testimonial.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {testimonial.location}
                        </span>
                      </span>
                    </figcaption>
                  </div>
                  <Image
                    src={testimonial.image}
                    alt={`Portrait of ${testimonial.name}`}
                    width={144}
                    height={144}
                    className="h-full w-40 shrink-0 object-cover md:w-48"
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
