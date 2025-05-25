'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TimelineItemProps {
  date: string;
  title: string;
  company: string;
  description: string;
  delay?: number;
}

function TimelineItem({ date, title, company, description, delay = 0 }: TimelineItemProps) {
  return (
    <motion.div
      className="relative pl-8 pb-8 border-l border-border last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">{date}</span>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-base font-medium text-muted-foreground">{company}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  const t = useTranslations('about');
  const experiences = t.raw('experience') as Array<{
    date: string;
    title: string;
    company: string;
    description: string;
  }>;

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => (
        <TimelineItem
          key={index}
          date={exp.date}
          title={exp.title}
          company={exp.company}
          description={exp.description}
          delay={index * 0.2}
        />
      ))}
    </div>
  );
}
