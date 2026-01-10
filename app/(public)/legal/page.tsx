import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AlertTriangle, Shield, FileText } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            Mentions légales
          </h1>

          <div className="space-y-8">
            {/* Responsabilité */}
            <Card id="responsabilite" className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Clause de non-responsabilité
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="bg-destructive/10 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-destructive">
                    EASYCOLLIS n'est pas responsable du contenu des colis
                    transportés ni de leur acheminement.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  La plateforme EASYCOLLIS agit uniquement en tant
                  qu'intermédiaire entre les clients et les transporteurs GP.
                  Nous ne sommes en aucun cas responsables de :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>
                    La nature, la légalité ou l'état des colis transportés
                  </li>
                  <li>
                    Les retards, pertes ou dommages survenant pendant le
                    transport
                  </li>
                  <li>Les litiges entre clients et transporteurs GP</li>
                  <li>Le non-respect des engagements pris entre les parties</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Les utilisateurs sont invités à vérifier les documents et
                  références des transporteurs avant tout engagement.
                </p>
              </CardContent>
            </Card>

            {/* Informations légales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Informations légales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Éditeur du site
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    EASYCOLLIS SAS
                    <br />
                    123 Avenue du Transport
                    <br />
                    75001 Paris, France
                    <br />
                    Email : contact@easycollis.com
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Hébergement
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vercel Inc.
                    <br />
                    340 S Lemon Ave #4133
                    <br />
                    Walnut, CA 91789, USA
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CGV */}
            <Card id="cgv">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Conditions Générales de Vente
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <h3 className="text-foreground font-semibold">1. Objet</h3>
                <p>
                  Les présentes CGV régissent l'utilisation de la plateforme
                  EASYCOLLIS et l'achat de PASS.
                </p>

                <h3 className="text-foreground font-semibold mt-4">
                  2. PASS Client
                </h3>
                <p>
                  Le PASS Client permet de contacter un transporteur GP via la
                  messagerie interne. Chaque PASS permet d'initier une
                  conversation avec un GP. Les PASS ne sont pas remboursables.
                </p>

                <h3 className="text-foreground font-semibold mt-4">
                  3. PASS GP
                </h3>
                <p>
                  Le PASS GP permet aux transporteurs de publier leurs voyages
                  et d'être visibles sur la plateforme. Les formules varient
                  selon le nombre de voyages pouvant être publiés.
                </p>

                <h3 className="text-foreground font-semibold mt-4">
                  4. Données personnelles
                </h3>
                <p>
                  Les données collectées sont utilisées uniquement pour le
                  fonctionnement de la plateforme. Conformément au RGPD, vous
                  disposez d'un droit d'accès, de modification et de suppression
                  de vos données.
                </p>

                <h3 className="text-foreground font-semibold mt-4">
                  5. Litiges
                </h3>
                <p>
                  Tout litige relatif à l'utilisation de la plateforme sera
                  soumis au droit français et aux tribunaux compétents de Paris.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
