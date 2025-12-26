
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: number;
  delay?: number;
  isLoading?: boolean;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  delay = 0,
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: delay * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 400 } }}
    >
      <Card className="overflow-hidden card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {(description || trend !== undefined) && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  {trend !== undefined && (
                    <span
                      className={`inline-flex items-center mr-1 ${
                        trend > 0
                          ? "text-green-500"
                          : trend < 0
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {trend > 0 ? "↑" : trend < 0 ? "↓" : "•"} {Math.abs(trend)}%
                    </span>
                  )}
                  {description}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OverviewCard;
