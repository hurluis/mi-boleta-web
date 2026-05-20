import { LoginForm } from "@/presentation/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-strong">
          Bienvenido de nuevo
        </h2>
        <p className="mt-1 text-sm text-muted">
          Ingresa para administrar tus boletas y sorteos.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
