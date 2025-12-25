import { ReactNode } from "react";

/**
 * Reusable Card Component
 * 
 * A glassmorphism-styled card for containing content.
 */

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function Card({ children, className = "", title, description }: CardProps) {
    return (
        <div
            className={`bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl ${className}`}
        >
            {(title || description) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-xl font-semibold text-white">{title}</h3>
                    )}
                    {description && (
                        <p className="text-gray-400 text-sm mt-1">{description}</p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
    return <div className={className}>{children}</div>;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
    return <div className={`mt-4 pt-4 border-t border-gray-800 ${className}`}>{children}</div>;
}
