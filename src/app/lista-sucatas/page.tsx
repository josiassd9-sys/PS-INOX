"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { ScrapListBuilder } from "@/components/scrap-list-builder";

export default function ScrapListPage() {
    return (
        <Dashboard initialCategoryId="lista-sucatas">
            <ScrapListBuilder />
        </Dashboard>
    );
}
