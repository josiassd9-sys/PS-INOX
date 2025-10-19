import { redirect } from 'next/navigation';

// Redirect to the first step of the calculator by default
export default function Page() {
  redirect('/perfis/calculadora/laje');
}
