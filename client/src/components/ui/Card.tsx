import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
    className?: string;
    gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, gradient, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            className={cn(
                "bg-card rounded-xl border border-border shadow-sm",
                gradient && "bg-gradient-to-br from-card to-secondary/50",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
});

Card.displayName = "Card";

export default Card;
