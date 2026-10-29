import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    MapPin,
    ShieldCheck,
    Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EditDestinationDialog from "@/components/EditDestinationDialog";
import DeleteDestinationDialog from "@/components/DeleteDestinationDialog";
import BookingCard from "@/components/booking/BookingCard";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

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

function formattedDate(value: string) {
    const [year, month, day] = value.split("-");
    return `${month}/${day}/${year}`;
}

const destinationDetailsPage = async ({ params }: { params: Promise<{ id: string }>; }) => {
    const { id } = await params;

    const token = await getTokenFromServer()

    const res = await fetch(
        `http://localhost:8000/destination/${id}`,
        {
            headers: {
                authorization: `Bearer ${token}`
            }
        },
    );

    if (!res.ok) {
        throw new Error("Failed to fetch destination details.");
    }

    const destinationData: Destination = await res.json();





    return (
        <main className="min-h-screen bg-linear-to-b from-teal-50/50 via-slate-50 to-white">
            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
                <Link
                    href="/destinations"
                    className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    All destinations
                </Link>

                <header className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <Badge className="mb-3 h-7 border-0 bg-teal-100 px-3 text-teal-800 hover:bg-teal-100">
                            {destinationData.category}
                        </Badge>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                            {destinationData.name}
                        </h1>
                        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600 sm:text-base">
                            <MapPin
                                className="h-4 w-4 shrink-0 text-teal-700"
                                aria-hidden="true"
                            />
                            {destinationData.country}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm sm:flex">
                            <ShieldCheck
                                className="h-4 w-4 text-teal-700"
                                aria-hidden="true"
                            />
                            Plan with confidence
                        </div>
                        <EditDestinationDialog destination={destinationData} />
                        <DeleteDestinationDialog
                            destinationId={destinationData._id}
                            destinationName={destinationData.name}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
                    <div className="space-y-6 lg:col-span-2 lg:space-y-8">
                        <figure className="group relative aspect-16/10 min-h-64 overflow-hidden rounded-3xl bg-slate-200 shadow-lg shadow-slate-900/10 sm:aspect-video lg:max-h-136">
                            <Image
                                src={destinationData.imageUrl}
                                alt={`Explore ${destinationData.name}, ${destinationData.country}`}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 66vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                                    Your next adventure
                                </p>
                                <p className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                                    Discover {destinationData.name}
                                </p>
                            </figcaption>
                        </figure>

                        <Card className="rounded-3xl border-slate-200/80 bg-white shadow-sm shadow-slate-900/5">
                            <CardHeader className="px-5 pt-6 sm:px-7 sm:pt-7">
                                <CardTitle className="font-serif text-2xl font-semibold text-slate-900">
                                    About this destination
                                </CardTitle>
                                <CardDescription className="text-slate-500">
                                    A little inspiration for the journey ahead
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
                                <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                                    {destinationData.description}
                                </p>
                                <Separator className="my-6 bg-slate-100" />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                                            <Clock
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Trip duration
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {destinationData.duration}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                                            <CalendarDays
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Departure date
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {formattedDate(destinationData.departureDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                                            <MapPin
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Destination
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {destinationData.name}, {destinationData.country}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                                            <Wallet
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Category
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {destinationData.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <BookingCard destinationData={destinationData} />

                </div>
            </div>
        </main>
    );
};

export default destinationDetailsPage;