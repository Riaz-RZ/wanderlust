"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, MapPin, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MyBookingCardProps {
  booking: Ibooking;
}

const MyBookingCard = ({ booking }: MyBookingCardProps) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const departureDate = new Date(booking.departureDate).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  const formattedPrice = Number(booking.price).toLocaleString("en-BD");

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      const token = await getTokenFromClient();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${booking._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setDeleteError("Could not delete this booking. Please try again.");
        setDeleting(false);
        return;
      }

      router.refresh();
    } catch {
      setDeleting(false);
      setDeleteError("Could not delete this booking. Please try again.");
    }
  };

  return (
    <Card className="grid overflow-hidden border-slate-200 bg-white p-0 shadow-sm transition-shadow hover:shadow-md md:grid-cols-[240px_minmax(0,1fr)_auto]">
      <div className="relative min-h-52 overflow-hidden bg-slate-100 md:min-h-full">
        <Image
          src={booking.imageUrl}
          alt={`${booking.name}, ${booking.country}`}
          fill
          sizes="240px"
          className="object-cover"
        />
        <Badge className="absolute left-4 top-4 bg-white text-slate-900 shadow-sm">
          {booking.category}
        </Badge>
      </div>

      <div className="min-w-0">
        <CardHeader className="pt-5">
          <CardTitle className="text-xl text-slate-950">{booking.name}</CardTitle>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="size-4 text-teal-700" aria-hidden="true" />
            {booking.country}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-5">
          <p className="line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
            {booking.description}
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_auto]">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <CalendarDays className="size-4 text-teal-700" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-400">Departure</p>
                <p className="font-medium text-slate-800">{departureDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Clock3 className="size-4 text-teal-700" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-400">Duration</p>
                <p className="font-medium text-slate-800">{booking.duration}</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 sm:col-span-2 lg:col-span-1">
              <div>
                <p className="text-xs text-slate-400">Booking total</p>
                <p className="text-xl font-bold text-teal-700">৳{formattedPrice}</p>
              </div>
              <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700">
                Confirmed
              </Badge>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="flex flex-row gap-2 border-t border-slate-100 p-4 md:w-36 md:flex-col md:justify-center md:border-l md:border-t-0">
        <Button type="button" variant="outline" className="flex-1 gap-2 md:flex-none">
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="flex-1 gap-2 md:flex-none"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="size-4" />
          {deleting ? "Deleting..." : "Delete"}
        </Button>
        {deleteError && (
          <p role="alert" className="text-xs text-destructive md:text-center">
            {deleteError}
          </p>
        )}
      </div>
    </Card>
  );
};

export default MyBookingCard;