'use client'
import type { FormEvent } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Input } from "../ui/input";



interface BookingCardProps {
    destinationData: {
        _id: string;
        name: string;
        price: number | string;
        departureDate: string;
        duration: string;
    };
}


const BookingCard = ({ destinationData }: BookingCardProps) => {

    const { data: session } = authClient.useSession()
    const user = session?.user

    const formattedPrice = Number(
        destinationData.price
    ).toLocaleString("en-BD");

    const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const departureDate = String(new FormData(e.currentTarget).get("departureDate"))

        const data = {
            username: user?.name,
            email: user?.email,
            image: user?.image,
            ...destinationData,
            departureDate: departureDate,
            bookingDate: new Date()
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const bookingRes = await res.json()
        console.log(bookingRes);
    }


    return (
        <div>
            <aside className="lg:sticky lg:top-24">
                <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white shadow-lg shadow-slate-900/5">
                    <div className="relative overflow-hidden bg-linear-to-br from-teal-800 to-teal-950 px-6 py-6 text-white sm:px-7">
                        <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <p className="relative text-sm font-medium text-teal-100">
                            Starting from
                        </p>
                        <div className="relative mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                                ৳{formattedPrice}
                            </span>
                            <span className="text-sm text-teal-100">
                                per person
                            </span>
                        </div>
                        <p className="relative mt-3 text-xs text-teal-100/90">
                            A memorable trip is closer than you think.
                        </p>
                    </div>

                    <CardContent className="space-y-5 p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle2
                                className="mt-0.5 h-5 w-5 shrink-0 text-teal-700"
                                aria-hidden="true"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    A memorable destination
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Discover the highlights of {destinationData.name}.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2
                                className="mt-0.5 h-5 w-5 shrink-0 text-teal-700"
                                aria-hidden="true"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Planned departure
                                </p>
                                <form onSubmit={handleBooking}>
                                    <Input
                                        type="date"
                                        name="departureDate"
                                        aria-label="Departure Date"
                                        defaultValue={destinationData.departureDate}
                                    />
                                    <Separator className="bg-slate-100" />
                                    <Button type="submit"
                                        className="h-12 mt-3 w-full rounded-xl bg-teal-700 font-semibold text-white shadow-sm shadow-teal-900/15 transition hover:bg-teal-800 focus-visible:ring-teal-700"
                                    >
                                        Book This Trip
                                        <ArrowRight
                                            className="ml-2 h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </form>
                            </div>

                        </div>

                        <p className="text-center text-xs leading-5 text-slate-500">
                            Ready to explore? Start planning your journey today.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-500">
                            <ShieldCheck
                                className="h-4 w-4 shrink-0 text-teal-700"
                                aria-hidden="true"
                            />
                            Plan your next adventure with confidence
                        </div>
                    </CardContent>
                </Card>
            </aside>
        </div>
    );
};

export default BookingCard;