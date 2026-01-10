import { Card, CardContent } from "./card";
import { CreditCard, MessageSquare, Package, Shield } from "lucide-react";

export function Helpers({ children, className = "", ...props }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="text-center border-0 shadow-md">
        <CardContent className="pt-8 pb-6">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">1. Recherchez</h3>
          <p className="text-sm text-muted-foreground">
            Trouvez un GP selon votre destination et date d'envoi
          </p>
        </CardContent>
      </Card>

      <Card className="text-center border-0 shadow-md">
        <CardContent className="pt-8 pb-6">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            2. Achetez un PASS
          </h3>
          <p className="text-sm text-muted-foreground">
            Obtenez un PASS pour contacter les transporteurs
          </p>
        </CardContent>
      </Card>

      <Card className="text-center border-0 shadow-md">
        <CardContent className="pt-8 pb-6">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">3. Contactez</h3>
          <p className="text-sm text-muted-foreground">
            Échangez directement avec le GP via notre messagerie
          </p>
        </CardContent>
      </Card>

      <Card className="text-center border-0 shadow-md">
        <CardContent className="pt-8 pb-6">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">4. Envoyez</h3>
          <p className="text-sm text-muted-foreground">
            Confiez votre colis en toute sérénité
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
