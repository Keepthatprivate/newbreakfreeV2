"use client";

import { Typography } from "@/components/custom/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { ClientMarkdown } from "../markdown/client-markdown";
import { SectionLayout } from "./section-layout";

type Faq = {
  question: string;
  answer: string;
};

type FeaturesPreviewProps = {
  faq: Faq[];
};

export const FAQSection = (props: FeaturesPreviewProps) => {
  return (
    <SectionLayout size="lg">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography className="text-primary mb-2 font-semibold tracking-wider uppercase">
            FAQ
          </Typography>
          <Typography variant="h2" className="text-4xl sm:text-5xl">
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="large"
            className="text-muted-foreground mx-auto mt-4 max-w-2xl font-normal"
          >
            Everything you need to know about our astrology services.
          </Typography>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-3xl"
      >
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {props.faq.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className={cn(
                  "bg-card rounded-2xl border px-5 transition-colors",
                  "data-[state=open]:bg-card/80",
                )}
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full">
                      <HelpCircle className="text-primary size-4" />
                    </div>
                    <span>{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 pl-11 text-base leading-relaxed">
                  <ClientMarkdown>{item.answer}</ClientMarkdown>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </SectionLayout>
  );
};
