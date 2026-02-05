"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { removePendingPayment } from "@/lib/services/paymentsService";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";

  useEffect(() => {
    if (ref) removePendingPayment(ref);
  }, [ref]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg border-destructive/20">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Paiement annulé</h1>
          <p className="text-muted-foreground">
            Votre paiement n'a pas été finalisé. Vous pouvez réessayer à tout moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pass/client">
              <Button className="w-full sm:w-auto">Retour aux PASS</Button>
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
