import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Review } from "@/lib/products";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="premium-border rounded-lg bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.055]">
      <div className="flex gap-1 text-mint" aria-label={`${review.rating} estrelas`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} size={16} fill="currentColor" />
        ))}
      </div>
      <p className="mt-5 text-base leading-7 text-platinum">&ldquo;{review.text}&rdquo;</p>
      <p className="mt-5 text-sm font-semibold text-white">{review.author}</p>
      <p className="mt-1 text-sm text-titanium">{review.role}</p>
    </motion.article>
  );
}
