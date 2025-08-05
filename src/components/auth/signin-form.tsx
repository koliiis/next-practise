'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useToast } from '../ui/use-toast';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { SignupDialog } from './SignupDialog';

const Icons = {
  user: User,
  mail: Mail,
  lock: Lock,
  spinner: Loader2,
};

const formSchema = z.object({
  email: z
    .string()
    .nonempty('Please enter your email')
    .email('Please enter a valid email address'),
  password: z.string().nonempty('Please enter your password'),
});

type InputType = z.infer<typeof formSchema>;

interface Props {
  callbackUrl?: string;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
}

export function SignInForm({ callbackUrl, onOpenChange, onSwitchToSignup }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [modal, setModal] = useState<'signin' | 'signup' | null>(null);

  const form = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: InputType) {
    try {
      setIsLoading(true);
      const response = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!response?.ok) {
        toast('Something went wrong: ' + (response?.error ?? 'Unknown error'));
        return;
      }

      toast('Welcome back! Redirecting you to your dashboard!');

      router.push(callbackUrl ?? '/');
    } catch {
      toast('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-2 mt-6'>
          <div className='grid gap-1'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Icons.mail
                        className={
                          form.formState.errors.email
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }
                      />
                      <Input
                        type='email'
                        placeholder='Your Email'
                        className={
                          form.formState.errors.email
                            ? 'border-destructive bg-destructive/30'
                            : ''
                        }
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Icons.lock
                        className={
                          form.formState.errors.password
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }
                      />
                      <Input
                        type='password'
                        placeholder='Your Password'
                        className={
                          form.formState.errors.password
                            ? 'border-destructive bg-destructive/30'
                            : ''
                        }
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type='submit'
            className='text-white mt-4 cursor-pointer hover:text-violet-400 hover:bg-neutral-950'
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign In
          </Button>
        </div>
      </form>

      <div className="mt-6 flex items-center gap-2 text-sm text-neutral-400">
        <span>New here?</span>
        <Button
          onClick={() => {
            onOpenChange(false); // Закриваємо SignIn
            setTimeout(() => onSwitchToSignup(), 100); // Відкриваємо SignUp після паузи
          }}
          variant="ghost"
          className="text-violet-400 hover:text-white hover:bg-transparent p-0 h-auto underline cursor-pointer">
          Join us →
        </Button>
      </div>

      <SignupDialog
        open={modal === 'signup'}
        onOpenChange={(o) => setModal(o ? 'signup' : null)}
        onSwitchToSignin={() => setModal('signin')}
      />
    </Form>
  );
}