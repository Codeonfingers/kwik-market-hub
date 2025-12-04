import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  icon: string;
  name: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryPill = ({ icon, name, count, isActive, onClick }: CategoryPillProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground border-primary shadow-glow"
          : "bg-card text-foreground border-border hover:border-primary/50"
      )}
    >
      <span className="text-2xl">{icon}</span>
      <div className="text-left">
        <p className="font-semibold">{name}</p>
        <p className={cn("text-xs", isActive ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {count} items
        </p>
      </div>
    </motion.button>
  );
};

export default CategoryPill;
