"use client";

import React from "react";
import { Card, Text } from "@mantine/core";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type ShortCardProps = {
  title: string;
  value: number;
  Icon: LucideIcon;
  color?: string;
};

export function ShortCard({ title, value, Icon, color = "blue" }: ShortCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card
        shadow="sm"
        radius="xl"
        padding="lg"
        className={`flex flex-col items-center justify-center gap-3 bg-${color}-50 border border-${color}-200 hover:shadow-lg transition-all duration-200`}
      >
        <div className={`p-3 rounded-full bg-${color}-100  text-${color}-600`}>
          <Icon size={28} />
        </div>

        <Text size="lg" fw={600} className="text-gray-700 text-center">
          {title}
        </Text>

        <Text size="xl" fw={700} className={`text-${color}-700`}>
          {value.toLocaleString()}{" "}
          <span className="text-sm text-gray-500">JOD</span>
        </Text>
      </Card>
    </motion.div>
  );
}

// 🎨 Skeleton أثناء التحميل
export function ShortCardSkeleton() {
  return (
    <Card
      shadow="sm"
      radius="xl"
      padding="lg"
      className="flex flex-col items-center justify-center gap-3 bg-gray-100 animate-pulse h-[160px]"
    >
      <div className="p-3 rounded-full bg-gray-300 w-12 h-12" />
      <div className="h-4 w-24 bg-gray-300 rounded" />
      <div className="h-5 w-20 bg-gray-300 rounded" />
    </Card>
  );
}
