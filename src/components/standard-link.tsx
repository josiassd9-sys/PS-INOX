"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { standardsData } from "@/lib/data/standards-data";

interface StandardLinkProps {
  standardId: string;
}

export function StandardLink({ standardId }: StandardLinkProps) {
  const standard = standardsData[standardId];

  if (!standard) {
    return <span className="font-semibold">{standardId.toUpperCase()}</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto text-base text-primary font-semibold hover:underline"
        >
          {standard.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{standard.title}</DialogTitle>
          {standard.summary && (
             <DialogDescription>{standard.summary}</DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4 whitespace-pre-wrap text-sm">{standard.details}</div>
      </DialogContent>
    </Dialog>
  );
}
