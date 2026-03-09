"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { MaterialListBuilder } from "@/components/material-list-builder";

export default function MaterialListPage() {
  return (
    <Dashboard initialCategoryId="lista-materiais">
        <MaterialListBuilder />
    </Dashboard>
  );
}
