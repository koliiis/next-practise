'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { registerUser } from '@/actions/auth-actions';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Icons = {
  user: User,
  mail: Mail,
  lock: Lock,
  spinner: Loader2,
};

const formSchema = z.object({
  username: z
    .string()
    .nonempty('Username is required')
    .min(2, 'User name must have at least 2 characters')
    .max(12, 'Username must be up to 12 characters')
    .regex(new RegExp('^[a-zA-Z0-9]+$'), 'No special characters allowed!'),

  email: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),

  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must have at least 6 characters')
    .max(20, 'Password must be up to 20 characters'),

  confirmPassword: z
    .string()
    .nonempty('Confirm your password is required')
    .min(6, 'Password must have at least 6 characters')
    .max(20, 'Password must be up to 20 characters'),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Password and Confirm Password doesn't match!",
  path: ['confirmPassword'],
});

type InputType = z.infer<typeof formSchema>;

interface Props {
  callbackUrl?: string;
}

export function SignUpForm({ callbackUrl }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: InputType) {
    try {
      setIsLoading(true);
      const { confirmPassword, ...user } = values;
      const response = await registerUser(user);

      if ('error' in response) {
        toast.error(response.error || 'Something went wrong!');
      } else {
        toast.success('Your account has been created successfully! You can now login.');
        form.reset();
      }

      const responseLogin = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!responseLogin?.ok) {
        toast('Something went wrong: ' + (responseLogin?.error ?? 'Unknown error'));
        return;
      }

      toast('Welcome back! Redirecting you to your dashboard!');

      router.push(callbackUrl ?? '/');
    } catch (error) {
      console.error(error);
      toast.error("We couldn't create your account. Please try again later!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Icons.user
                    className={
                      form.formState.errors.username ? 'text-destructive' : 'text-muted-foreground'
                    }
                  />
                  <Input
                    placeholder="Your Username"
                    className={form.formState.errors.username ? 'border-destructive bg-destructive/30' : ''}
                    {...field}
                  />
                </div>
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
              <FormControl>
                <div className="flex items-center gap-2">
                  <Icons.mail
                    className={
                      form.formState.errors.email ? 'text-destructive' : 'text-muted-foreground'
                    }
                  />
                  <Input
                    placeholder="Email"
                    className={form.formState.errors.email ? 'border-destructive bg-destructive/30' : ''}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Icons.lock
                    className={
                      form.formState.errors.password ? 'text-destructive' : 'text-muted-foreground'
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    className={form.formState.errors.password ? 'border-destructive bg-destructive/30' : ''}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Icons.lock
                    className={
                      form.formState.errors.confirmPassword ? 'text-destructive' : 'text-muted-foreground'
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className={form.formState.errors.confirmPassword ? 'border-destructive bg-destructive/30' : ''}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}