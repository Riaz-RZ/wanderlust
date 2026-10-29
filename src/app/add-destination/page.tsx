"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const categories = [
    "Beach",
    "Mountain",
    "Island",
    "City",
    "Adventure",
    "Cultural",
    "Wildlife",
];

type FormState = {
    name: string;
    country: string;
    category: string;
    price: string;
    duration: string;
    departureDate: string;
    imageUrl: string;
    description: string;
};

const initialForm: FormState = {
    name: "",
    country: "",
    category: "Beach",
    price: "",
    duration: "",
    departureDate: "",
    imageUrl: "",
    description: "",
};



const controlClassName = "h-8 bg-muted/70 border-transparent px-3 md:text-sm";

export default function AddDestinationPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const router = useRouter();

    const updateField = (field: keyof FormState, value: string) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = await getTokenFromClient()

        try {
            const res = await fetch("http://localhost:8000/add-destination", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error("Failed to add destination");
            }

            router.push("/destinations");
        } catch (error) {
            console.error("Error adding destination:", error);
        }
    }
    function handleCancel() {
        setForm(initialForm);
    }

    return (
        <main className="w-full flex-1 px-4 py-12 sm:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-4xl">
                <h1 className="mb-8 text-3xl font-normal sm:text-4xl">
                    Add New Travel Package
                </h1>

                <Card className="mx-auto w-full max-w-2xl rounded-xl shadow-sm ring-border">
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <CardContent className="flex flex-col gap-4">
                            {/* Destination name */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="name">Destination Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={(event) => updateField("name", event.target.value)}
                                    placeholder="Bali Paradise"
                                    required
                                    className={controlClassName}
                                />
                            </div>

                            {/* Country + Category */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={form.country}
                                        onChange={(event) =>
                                            updateField("country", event.target.value)
                                        }
                                        placeholder="Indonesia"
                                        required
                                        className={controlClassName}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        name="category"
                                        value={form.category}
                                        onValueChange={(value) =>
                                            updateField("category", value ?? "")
                                        }
                                    >
                                        <SelectTrigger
                                            id="category"
                                            className={`${controlClassName} w-full`}
                                        >
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Price + Duration */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="price">Price (USD)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min={0}
                                        value={form.price}
                                        onChange={(event) => updateField("price", event.target.value)}
                                        placeholder="e.g. 1299"
                                        required
                                        className={controlClassName}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        value={form.duration}
                                        onChange={(event) =>
                                            updateField("duration", event.target.value)
                                        }
                                        placeholder="e.g. 7 Days/6 Nights"
                                        required
                                        className={controlClassName}
                                    />
                                </div>
                            </div>

                            {/* Departure date */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="departureDate">Departure Date</Label>
                                <Input
                                    id="departureDate"
                                    name="departureDate"
                                    type="date"
                                    value={form.departureDate}
                                    onChange={(event) =>
                                        updateField("departureDate", event.target.value)
                                    }
                                    required
                                    className={controlClassName}
                                />
                            </div>

                            {/* Image URL */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="url"
                                    value={form.imageUrl}
                                    onChange={(event) => updateField("imageUrl", event.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className={controlClassName}
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={(event) =>
                                        updateField("description", event.target.value)
                                    }
                                    placeholder="Describe the travel experience..."
                                    rows={5}
                                    className="min-h-28 w-full resize-y bg-muted/70 border-transparent px-3 py-2 md:text-sm"
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="justify-end gap-3 border-t-0 bg-transparent">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2Icon data-icon="inline-start" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#0ea3c9] text-white hover:bg-[#0c8fb2]"
                            >
                                <ImageIcon data-icon="inline-start" />
                                Add Travel Package
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </main>
    );
}
