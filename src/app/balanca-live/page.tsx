
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, limit, getFirestore, doc, setDoc, Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "@/lib/firebase-config";
import { Loader, Save, Settings } from "lucide-react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


// Componente para inicializar o Firebase e prover para os filhos
function FirebaseProvider({ children }: { children: React.ReactNode }) {
    const firebaseConfig = getFirebaseConfig();
    const [app, setApp] = React.useState<FirebaseApp | null>(null);
    const [firestore, setFirestore] = React.useState<Firestore | null>(null);

    React.useEffect(() => {
        if (firebaseConfig && !app) {
            try {
                const initializedApp = initializeApp(firebaseConfig);
                const db = getFirestore(initializedApp);
                setApp(initializedApp);
                setFirestore(db);
            } catch (error) {
                console.error("Firebase initialization error:", error);
            }
        }
    }, [firebaseConfig, app]);

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

function ConfigManager({ onSaveSuccess }: { onSaveSuccess: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const configRef = firestore ? doc(firestore, "configuracoes", "balanca") : null;
    const [configSnapshot, loading, error] = useDocument(configRef);
    const [serialPort, setSerialPort] = React.useState("");
    const [databaseUrl, setDatabaseUrl] = React.useState("");

    React.useEffect(() => {
        if (configSnapshot?.exists()) {
            const data = configSnapshot.data();
            setSerialPort(data.serialPort || "");
            setDatabaseUrl(data.databaseURL || "");
        }
    }, [configSnapshot]);

    const handleSave = async () => {
        if (!firestore || !configRef) return;
        try {
            await setDoc(configRef, { 
                serialPort, 
                databaseURL: databaseUrl 
            }, { merge: true });
            toast({
                title: "Configuração Salva!",
                description: "As configurações da balança foram salvas no Firestore.",
            });
            onSaveSuccess();
        } catch (e) {
            console.error(e);
            toast({
                variant: "destructive",
                title: "Erro ao Salvar",
                description: "Não foi possível salvar as configurações.",
            });
        }
    };
    
    if (loading) {
        return <div className="flex items-center justify-center p-4 gap-2"><Loader className="animate-spin h-4 w-4"/> Carregando configurações...</div>
    }

    return (
        <Card className="border-primary/20 bg-primary/5 mb-4">
            <CardHeader>
                <CardTitle className="text-lg">Configurações da Balança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                 {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>Não foi possível carregar as configurações do Firestore.</AlertDescription></Alert>}
                <div className="space-y-2">
                    <Label htmlFor="serialPort">Porta Serial</Label>
                    <Input 
                        id="serialPort" 
                        value={serialPort}
                        onChange={(e) => setSerialPort(e.target.value)}
                        placeholder="Ex: /dev/ttyUSB0 ou COM3"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="databaseUrl">URL do Firebase Database</Label>
                     <Input 
                        id="databaseUrl" 
                        value={databaseUrl}
                        onChange={(e) => setDatabaseUrl(e.target.value)}
                        placeholder="https://seu-projeto.firebaseio.com"
                    />
                </div>
                <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Configuração
                </Button>
            </CardContent>
        </Card>
    )
}


function BalancaLiveComponent({ onToggleConfig, isConfigOpen }: { onToggleConfig: () => void, isConfigOpen: boolean }) {
  const firestore = useFirestore();

  if (!firestore) {
    return <div className="flex items-center justify-center p-8 gap-2"><Loader className="animate-spin h-5 w-5 text-primary"/><span>Conectando ao Firestore...</span></div>;
  }

  const pesagensRef = collection(firestore, "pesagens");
  const q = query(pesagensRef, orderBy("timestamp", "desc"), limit(20));
  
  const [pesagensSnapshot, loading, error] = useCollection(q);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle>Balança em Tempo Real</CardTitle>
            <CardDescription>Visualização das últimas pesagens enviadas pela balança.</CardDescription>
        </div>
        <Button variant={isConfigOpen ? "secondary" : "ghost"} size="icon" onClick={onToggleConfig} className="shrink-0">
            <Settings className="h-5 w-5" />
        </Button>
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
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);

  const handleSaveSuccess = () => {
    setIsConfigOpen(false); // Fecha o painel de config
  };

  return (
    <FirebaseProvider>
       <Dashboard initialCategoryId="balanca-live">
          <div className="container mx-auto p-4 space-y-4">
              <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                  <CollapsibleContent>
                     <ConfigManager onSaveSuccess={handleSaveSuccess} />
                  </CollapsibleContent>
              </Collapsible>
              <BalancaLiveComponent onToggleConfig={() => setIsConfigOpen(prev => !prev)} isConfigOpen={isConfigOpen}/>
          </div>
       </Dashboard>
    </FirebaseProvider>
  );
}
