import MyBookingCard from "@/components/booking/MyBookingCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


const myBookingsPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user

    const res = await fetch(`http://localhost:8000/my-bookings/${user?.email}`)
    const bookingsData:Ibooking[] = await res.json()

    console.log(bookingsData);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-700">
                        Your adventures
                    </p>
                    <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
                        My Bookings
                    </h1>
                </header>

                {bookingsData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {bookingsData.map((booking) => (
                            <MyBookingCard booking={booking} key={booking._id} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500">
                        You don&apos;t have any bookings yet.
                    </div>
                )}
            </div>
        </main>
    );
};

export default myBookingsPage;