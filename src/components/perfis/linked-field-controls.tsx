"use client";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Link2, PencilLine } from "lucide-react";

interface LinkedFieldLabelProps {
    htmlFor?: string;
    label: string;
    linked: boolean;
    onToggle: (linked: boolean) => void;
    source: string;
}

export function LinkedFieldLabel({ htmlFor, label, linked, onToggle, source }: LinkedFieldLabelProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant={linked ? "secondary" : "outline"} className="gap-1">
                    {linked ? <Link2 className="h-3 w-3" /> : <PencilLine className="h-3 w-3" />}
                    {linked ? "Vinculado" : "Manual"}
                </Badge>
                <span className="text-muted-foreground">Origem: {source}</span>
                <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                    <span className="text-muted-foreground">Auto</span>
                    <Switch checked={linked} onCheckedChange={onToggle} aria-label={`Alternar vínculo automático para ${label}`} />
                </div>
            </div>
        </div>
    );
}

export function StaleStepAlert({ title, description }: { title: string; description: string }) {
    return (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}