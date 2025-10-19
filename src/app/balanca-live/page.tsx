
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, limit, getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "@/lib/firebase-config";
import { Loader } from "lucide-react";
import { FirebaseApp, initializeApp } from "firebase/app";

// Componente para inicializar o Firebase e prover para os filhos
function FirebaseProvider({ children }: { children: React.ReactNode }) {
    const firebaseConfig = getFirebaseConfig();
    const [app, setApp] = React.useState<FirebaseApp | null>(null);
    const [firestore, setFirestore] = React.useState<Firestore | null>(null);

    React.useEffect(() => {
        if (firebaseConfig) {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            setApp(app);
            setFirestore(db);
        }
    }, [firebaseConfig]);

    if (!app || !firestore) {
        const firebaseConfig = getFirebaseConfig();
         if (!firebaseConfig) {
            return (
                <div className="p-4 text-center">
                    Firebase não configurado. Adicione as variáveis de ambiente.
                </div>
            )
        }
        return <div className="flex items-center justify-center p-8 gap-2"><Loader className="animate-spin h-5 w-5 text-primary"/><span>Inicializando Firebase...</span></div>;
    }

    return (
        <FirestoreContext.Provider value={firestore}>
            {children}
        </FirestoreContext.Provider>
    );
}

const FirestoreContext = React.createContext<Firestore | null>(null);

function useFirestore() {
    return React.useContext(FirestoreContext);
}


function BalancaLiveComponent() {
  const firestore = useFirestore();

  if (!firestore) {
    return <div className="flex items-center justify-center p-8 gap-2"><Loader className="animate-spin h-5 w-5 text-primary"/><span>Conectando ao Firestore...</span></div>;
  }

  const pesagensRef = collection(firestore, "pesagens");
  const q = query(pesagensRef, orderBy("timestamp", "desc"), limit(20));
  
  const [pesagensSnapshot, loading, error] = useCollection(q);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balança em Tempo Real</CardTitle>
        <CardDescription>Visualização das últimas pesagens enviadas pela balança.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-destructive">Erro: {error.message}</p>}
        {loading && (
          <div className="flex items-center justify-center p-8 gap-2">
            <Loader className="animate-spin h-5 w-5 text-primary"/>
            <span className="text-muted-foreground">Carregando pesagens...</span>
          </div>
        )}
        {!loading && pesagensSnapshot && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Peso</TableHead>
                <TableHead>Data e Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pesagensSnapshot.docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.data().peso}</TableCell>
                  <TableCell>{doc.data().timestamp?.toDate().toLocaleString('pt-BR') || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}


export default function BalancaLivePage() {
  return (
    <FirebaseProvider>
       <Dashboard initialCategoryId="balanca-live">
          <div className="container mx-auto p-4">
              <BalancaLiveComponent />
          </div>
       </Dashboard>
    </FirebaseProvider>
  );
}

