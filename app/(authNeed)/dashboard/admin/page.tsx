"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MOCK_GPS } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Package,
  CreditCard,
  Search,
  CheckCircle,
  Eye,
  Ban,
  Shield,
  MapPin,
  Calendar,
  Star,
  Activity,
  DollarSign,
  UserCheck,
  Plane,
} from "lucide-react";
import { formatPassDate, isPassActive } from "@/lib/utils/pass";
import db from "@/lib/mocks/database.json";

interface AdminStats {
  totalClients: number;
  totalGPs: number;
  totalTrips: number;
  totalRevenue: number;
  activeTrips: number;
  pendingVerifications: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "client" | "gp";
  city?: string;
  passValidUntil?: string;
  verified?: boolean;
  status: "active" | "suspended";
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const stats = db.adminStats as AdminStats;
  const users = db.adminUsers as UserData[];
  const transactions = db.adminTransactions as {
    id: string;
    user: string;
    type: string;
    amount: number;
    date: string;
    status: string;
  }[];

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const filteredGPs = MOCK_GPS.filter(
    (gp) =>
      gp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gp.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Administration EASYCOLLIS
                </h1>
                <p className="text-muted-foreground">
                  Gérez la plateforme et les utilisateurs
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Clients</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalClients}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">GPs</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalGPs}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Voyages</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalTrips}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Actifs</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.activeTrips}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Revenus</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground">FCFA</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-muted-foreground">
                    En attente
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stats.pendingVerifications}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="gps">GPs ({MOCK_GPS.length})</TabsTrigger>
              <TabsTrigger value="clients">
                Clients ({users.length})
              </TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Derniers GPs inscrits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {MOCK_GPS.slice(0, 4).map((gp) => (
                      <div
                        key={gp.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {gp.name[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{gp.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {gp.city} → {gp.destination}
                            </p>
                          </div>
                        </div>
                        {gp.verified ? (
                          <Badge className="bg-green-500/10 text-green-600">
                            Vérifié
                          </Badge>
                        ) : (
                          <Badge variant="outline">En attente</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Dernières transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {transactions.slice(0, 4).map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm">{tx.user}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            {tx.amount.toLocaleString()} FCFA
                          </p>
                          <Badge
                            className={
                              tx.status === "completed"
                                ? "bg-green-500/10 text-green-600"
                                : "bg-yellow-500/10 text-yellow-600"
                            }
                          >
                            {tx.status === "completed"
                              ? "Complété"
                              : "En attente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setActiveTab("gps")}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Vérifier les GPs
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("clients")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Gérer les clients
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("transactions")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Voir les transactions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gps" className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un GP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* GPs List */}
              <Card>
                <CardHeader>
                  <CardTitle>Liste des GPs</CardTitle>
                  <CardDescription>
                    Gérez les comptes GP et leurs vérifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredGPs.map((gp) => (
                      <div
                        key={gp.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="font-bold text-primary">
                              {gp.name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{gp.name}</h3>
                              {gp.verified ? (
                                <Badge className="bg-green-500/10 text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Vérifié
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-yellow-600 border-yellow-300"
                                >
                                  En attente
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {gp.email}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {gp.city} → {gp.destination}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(gp.departureDate).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                              {gp.rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  {gp.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          {!gp.verified && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Vérifier
                            </Button>
                          )}
                          <Button size="sm" variant="destructive">
                            <Ban className="h-4 w-4 mr-1" />
                            Suspendre
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Clients List */}
              <Card>
                <CardHeader>
                  <CardTitle>Liste des clients</CardTitle>
                  <CardDescription>Gérez les comptes clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((client) => (
                      <div
                        key={client.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <span className="font-bold text-foreground">
                              {client.name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{client.name}</h3>
                              {client.status === "active" ? (
                                <Badge className="bg-green-500/10 text-green-600">
                                  Actif
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Suspendu</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {client.email}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {client.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {client.city}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                {isPassActive(client.passValidUntil)
                                  ? `PASS actif · ${formatPassDate(client.passValidUntil)}`
                                  : "PASS inactif"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Inscrit le{" "}
                                {new Date(client.createdAt).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button size="sm" variant="outline">
                            <CreditCard className="h-4 w-4 mr-1" />
                            Créditer
                          </Button>
                          {client.status === "active" ? (
                            <Button size="sm" variant="destructive">
                              <Ban className="h-4 w-4 mr-1" />
                              Suspendre
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Réactiver
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des transactions</CardTitle>
                  <CardDescription>
                    Toutes les transactions de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                            ID
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                            Utilisateur
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                            Type
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                            Montant
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                            Date
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b">
                            <td className="p-3 text-sm font-mono">{tx.id}</td>
                            <td className="p-3 text-sm">{tx.user}</td>
                            <td className="p-3 text-sm">{tx.type}</td>
                            <td className="p-3 text-sm font-semibold">
                              {tx.amount.toLocaleString()} FCFA
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {new Date(tx.date).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="p-3">
                              <Badge
                                className={
                                  tx.status === "completed"
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-yellow-500/10 text-yellow-600"
                                }
                              >
                                {tx.status === "completed"
                                  ? "Complété"
                                  : "En attente"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
