
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteDestinationDialogProps {
    destinationId: string;
    destinationName: string;
}

export default function DeleteDestinationDialog({
    destinationId,
    destinationName,
}: DeleteDestinationDialogProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `http://localhost:8000/destination/${destinationId}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to delete destination.");
            }

            router.replace("/destinations");
            router.refresh();
        } catch (err) {
            console.error(err);
            setError("Could not delete the destination. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={<Button variant="destructive" className="gap-2" />}
            >
                <Trash2 className="h-4 w-4" />
                Delete Destination
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete{" "}
                        <span className="font-semibold text-foreground">
                            {destinationName}
                        </span>{" "}
                        from your destinations.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            void handleDelete();
                        }}
                        disabled={loading}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {loading ? "Deleting..." : "Yes, delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
