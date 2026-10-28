'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"


export default function SignInPage() {
    const handleEmailSignIn = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const user = Object.fromEntries(formData.entries()) as { email: string, password: string }

        const { data, error } = await authClient.signIn.email({
            ...user
        })
        if (data) {
            redirect('/')
        } if (error) {
            console.log(error);
        }

    }

    return (
        <div className="flex flex-col gap-6 max-w-100 mx-auto my-20">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Sign In to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to Sign In
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailSignIn}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required />
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit">Sign In</Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <a href="#">Sign Up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
