import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search, Heart, Filter, PawPrint } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type LoginFormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const { login, loginPending } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(values: LoginFormData) {
    login(values);
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen min-w-screen">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Find your perfect companion</h1>
            <p className="text-muted-foreground">
              Start your journey to find your new best friend
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jane@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loginPending}>
                {loginPending ? "Getting started..." : "Start Searching"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our demo terms of service
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-[hsl(35,93%,64%)] to-[hsl(35,93%,45%)] text-zinc-900">
        <div className="w-full mx-auto space-y-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Innovative Dog Adoption Platform
            </h2>
            <p className="text-zinc-800">
              Experience our intuitive search and match system designed to
              connect you with your ideal canine companion
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <Search className="w-6 h-6 text-zinc-900" />
              <div className="space-y-1">
                <h3 className="font-semibold">Advanced Search Features</h3>
                <p className="text-sm text-zinc-800">
                  Filter by breed and browse paginated results with customizable
                  sorting
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Heart className="w-6 h-6 text-zinc-900" />
              <div className="space-y-1">
                <h3 className="font-semibold">Favorite & Match System</h3>
                <p className="text-sm text-zinc-800">
                  Save your favorite dogs and get matched with your perfect
                  companion
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Filter className="w-6 h-6 text-zinc-900" />
              <div className="space-y-1">
                <h3 className="font-semibold">Comprehensive Filters</h3>
                <p className="text-sm text-zinc-800">
                  Search by location, age, and breed to find exactly what
                  you&apos;re looking for
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <PawPrint className="w-6 h-6 text-zinc-900" />
              <div className="space-y-1">
                <h3 className="font-semibold">Complete Dog Profiles</h3>
                <p className="text-sm text-zinc-800">
                  Detailed information including photos, age, breed, and
                  location
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
            <blockquote className="text-sm italic text-zinc-900">
              &quot;Thank you for considering my application. I&apos;ve enjoyed
              building this demo showcasing modern React practices, TypeScript,
              and responsive design. I hope it demonstrates my attention to
              detail and passion for creating exceptional user
              experiences.&quot;
            </blockquote>
            <div className="mt-4">
              <p className="font-medium">David Mostoller</p>
              <p className="text-sm text-zinc-800">Frontend Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
