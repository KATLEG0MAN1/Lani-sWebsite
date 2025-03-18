import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertSubscriberSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

type FormData = {
  email: string;
};

export function Newsletter() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(insertSubscriberSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      await apiRequest("POST", "/api/subscribe", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thank you for subscribing to our newsletter!",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="bg-muted py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-8">
          Subscribe to our newsletter for exclusive offers and updates
        </p>
        <form onSubmit={onSubmit} className="max-w-md mx-auto flex gap-4">
          <Input
            placeholder="Enter your email"
            {...form.register("email")}
            className="flex-1"
          />
          <Button type="submit" disabled={mutation.isPending}>
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
}
