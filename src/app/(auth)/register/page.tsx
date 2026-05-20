import { RegisterForm } from "@/presentation/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-strong">
          Crea tu cuenta
        </h2>
        <p className="mt-1 text-sm text-muted">
          Empieza a organizar tus boletas en menos de un minuto.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
