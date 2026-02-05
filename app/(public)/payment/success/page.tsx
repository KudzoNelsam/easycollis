"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  createMockPurchase,
  getPendingPayment,
  removePendingPayment,
} from "@/lib/services/paymentsService";
import { formatPassDate, isPassActive } from "@/lib/utils/pass";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";
  const { user, updatePassValidity } = useAuth();
  const [processed, setProcessed] = useState(false);

  const pending = useMemo(() => (ref ? getPendingPayment(ref) : undefined), [ref]);

  useEffect(() => {
    if (!pending || !user || processed) return;
    if (pending.userId !== user.id) return;

    updatePassValidity(pending.durationDays);
    createMockPurchase({
      userId: user.id,
      role: pending.role,
      packId: pending.packId,
      amount: pending.amount,
      currency: pending.currency,
      status: "paid",
    });
    removePendingPayment(pending.ref);
    setProcessed(true);
  }, [pending, user, processed, updatePassValidity]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Paiement confirmé</h1>
          <p className="text-muted-foreground">
            Votre paiement a été accepté. Votre PASS est maintenant actif.
          </p>
          <div className="text-sm text-muted-foreground">
            {isPassActive(user?.passValidUntil)
              ? `Valable jusqu'au ${formatPassDate(user?.passValidUntil)}`
              : "PASS inactif"}
          </div>
          {pending && (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p>Montant: {pending.amount} {pending.currency}</p>
              <p>Référence: {pending.ref}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={user?.role === "gp" ? "/dashboard/gp" : "/dashboard/client"}>
              <Button className="w-full sm:w-auto">Aller au tableau de bord</Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="w-full sm:w-auto">
                Rechercher un GP
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
