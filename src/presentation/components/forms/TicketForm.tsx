"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ticketSchema,
  type TicketFormInput,
  type TicketFormValues,
} from "@/presentation/lib/validation/ticket.schemas";
import {
  GAME_TYPES,
  TICKET_STATUSES,
  type Ticket,
} from "@/domain/entities/Ticket";
import type {
  CreateTicketInput,
  UpdateTicketInput,
} from "@/domain/repositories/TicketRepository";
import { toDatetimeLocalValue } from "@/presentation/lib/formatters";
import { Button } from "@/presentation/components/ui/Button";
import { Input } from "@/presentation/components/ui/Input";
import { Textarea } from "@/presentation/components/ui/Textarea";
import { Select } from "@/presentation/components/ui/Select";
import { Label } from "@/presentation/components/ui/Label";
import { FieldError } from "@/presentation/components/ui/FieldError";
import { Alert } from "@/presentation/components/ui/Alert";

type TicketFormProps = {
  mode: "create" | "edit";
  initialValue?: Ticket;
  onSubmit: (
    values: CreateTicketInput | UpdateTicketInput,
  ) => Promise<unknown>;
  submitLabel?: string;
};

function toDefaults(initial?: Ticket): TicketFormInput {
  if (!initial) {
    return {
      title: "",
      gameType: "Lotería",
      gameNumber: "",
      gameDate: "",
      amount: "",
      place: "",
      status: "Pendiente",
      notes: "",
    };
  }
  return {
    title: initial.title,
    gameType: initial.gameType,
    gameNumber: initial.gameNumber ?? "",
    gameDate: toDatetimeLocalValue(initial.gameDate),
    amount: initial.amount ?? "",
    place: initial.place ?? "",
    status: initial.status,
    notes: initial.notes ?? "",
  };
}

export function TicketForm({
  mode,
  initialValue,
  onSubmit: onSubmitProp,
  submitLabel,
}: TicketFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormInput, unknown, TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: toDefaults(initialValue),
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const payload: CreateTicketInput = {
        title: values.title,
        gameType: values.gameType,
        gameNumber: values.gameNumber ?? null,
        gameDate: new Date(values.gameDate),
        amount: values.amount ?? null,
        place: values.place ?? null,
        status: values.status,
        notes: values.notes ?? null,
      };
      await onSubmitProp(payload);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo guardar el registro. Inténtalo de nuevo.";
      setServerError(message);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <div>
        <Label htmlFor="title" required>
          Nombre del sorteo
        </Label>
        <Input
          id="title"
          placeholder="Ej. Lotería de Medellín"
          invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          {...register("title")}
        />
        <FieldError id="title-error">{errors.title?.message}</FieldError>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="gameType" required>
            Tipo de juego
          </Label>
          <Select
            id="gameType"
            invalid={Boolean(errors.gameType)}
            aria-describedby={errors.gameType ? "gameType-error" : undefined}
            {...register("gameType")}
          >
            {GAME_TYPES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
          <FieldError id="gameType-error">{errors.gameType?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="status" required>
            Estado
          </Label>
          <Select
            id="status"
            invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? "status-error" : undefined}
            {...register("status")}
          >
            {TICKET_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <FieldError id="status-error">{errors.status?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="gameNumber">Número jugado</Label>
          <Input
            id="gameNumber"
            placeholder="1234"
            invalid={Boolean(errors.gameNumber)}
            aria-describedby={errors.gameNumber ? "gameNumber-error" : undefined}
            {...register("gameNumber")}
          />
          <FieldError id="gameNumber-error">
            {errors.gameNumber?.message}
          </FieldError>
        </div>

        <div>
          <Label htmlFor="gameDate" required>
            Fecha del sorteo
          </Label>
          <Input
            id="gameDate"
            type="datetime-local"
            invalid={Boolean(errors.gameDate)}
            aria-describedby={errors.gameDate ? "gameDate-error" : undefined}
            {...register("gameDate")}
          />
          <FieldError id="gameDate-error">{errors.gameDate?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount">Valor apostado</Label>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            placeholder="5000"
            invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            {...register("amount")}
          />
          <FieldError id="amount-error">{errors.amount?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="place">Lugar de compra</Label>
          <Input
            id="place"
            placeholder="Tienda La Esquina"
            invalid={Boolean(errors.place)}
            aria-describedby={errors.place ? "place-error" : undefined}
            {...register("place")}
          />
          <FieldError id="place-error">{errors.place?.message}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notas adicionales</Label>
        <Textarea
          id="notes"
          placeholder="Ej. Premio mayor: $200.000.000"
          invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          {...register("notes")}
        />
        <FieldError id="notes-error">{errors.notes?.message}</FieldError>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting} size="lg">
          {submitLabel ?? (mode === "create" ? "Guardar boleta" : "Guardar cambios")}
        </Button>
      </div>
    </form>
  );
}
