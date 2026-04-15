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
        <div className="space-y-2 min-w-0">
            <Label htmlFor={htmlFor} className="block min-h-5 truncate leading-tight" title={label}>{label}</Label>
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant={linked ? "secondary" : "outline"} className="gap-1 whitespace-nowrap">
                    {linked ? <Link2 className="h-3 w-3" /> : <PencilLine className="h-3 w-3" />}
                    {linked ? "Vinculado" : "Manual"}
                </Badge>
                <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                    <span className="text-muted-foreground">Auto</span>
                    <Switch checked={linked} onCheckedChange={onToggle} aria-label={`Alternar vínculo automático para ${label}`} />
                </div>
            </div>
            <span className="block truncate text-xs text-muted-foreground" title={`Origem: ${source}`}>Origem: {source}</span>
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