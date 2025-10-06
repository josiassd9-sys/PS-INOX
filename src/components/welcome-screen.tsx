"use client";

import { CATEGORY_GROUPS, type Category } from "@/lib/data";
import { Warehouse } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Icon } from "./icons";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WelcomeScreenProps {
    onSelectCategory: (categoryId: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
};

export function WelcomeScreen({ onSelectCategory }: WelcomeScreenProps) {
    const mainGroup = CATEGORY_GROUPS.find(g => g.title === 'MATERIAIS (AÇO INOX)');
    const otherGroups = CATEGORY_GROUPS.filter(g => g.title !== 'MATERIAIS (AÇO INOX)');

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-1">
            <div className="flex flex-col items-center gap-1 text-center mb-1">
                <Warehouse className="h-12 w-12 text-primary/50" />
                <h1 className="text-3xl font-bold tracking-tight">PS INOX</h1>
                <p className="text-muted-foreground max-w-md">
                    Selecione uma categoria no menu lateral ou use o hub de navegação abaixo para começar a calcular.
                </p>
            </div>

            <motion.div
                className="grid grid-cols-2 gap-1 w-full max-w-6xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Coluna Esquerda */}
                <motion.div className="flex flex-col gap-1" variants={itemVariants}>
                    {otherGroups.map((group) => (
                        <Card key={group.title} className="flex flex-col bg-card/50 hover:bg-card transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold tracking-wider uppercase text-primary/80">
                                    {group.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-1 flex-1 p-1">
                                {group.items.map((category: Category) => (
                                    <Button
                                        key={category.id}
                                        variant="ghost"
                                        className="justify-start h-10 text-sm"
                                        onClick={() => onSelectCategory(category.id)}
                                    >
                                        <Icon name={category.icon as any} className="mr-2 h-5 w-5 text-primary/70" />
                                        <span>{category.name}</span>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Coluna Direita */}
                {mainGroup && (
                    <motion.div variants={itemVariants}>
                        <Card className="h-full flex flex-col bg-card/50 hover:bg-card transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold tracking-wider uppercase text-primary/80">
                                    {mainGroup.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-1 flex-1 p-1">
                                {mainGroup.items.map((category: Category) => (
                                    <Button
                                        key={category.id}
                                        variant="ghost"
                                        className="justify-start h-10 text-sm"
                                        onClick={() => onSelectCategory(category.id)}
                                    >
                                        <Icon name={category.icon as any} className="mr-2 h-5 w-5 text-primary/70" />
                                        <span>{category.name}</span>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
