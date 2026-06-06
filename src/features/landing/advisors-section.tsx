"use client";

import { Typography } from "@/components/custom/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageCircle, Star } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { SectionLayout } from "./section-layout";

type Advisor = {
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviews: number;
  experience: string;
};

const advisors: Advisor[] = [
  {
    name: "Solomon",
    specialty: "Energy & Spirituality",
    image: "https://i.pravatar.cc/300?u=advisor1",
    rating: 4.7,
    reviews: 353,
    experience: "Over 32 years of practice",
  },
  {
    name: "Ella-Louise",
    specialty: "Love & Relationships",
    image: "https://i.pravatar.cc/300?u=advisor2",
    rating: 4.7,
    reviews: 448,
    experience: "Over 21 years of practice",
  },
  {
    name: "Suraj",
    specialty: "Energy & Spirituality",
    image: "https://i.pravatar.cc/300?u=advisor3",
    rating: 5.0,
    reviews: 430,
    experience: "Over 17 years of practice",
  },
  {
    name: "Gustav",
    specialty: "Energy & Spirituality",
    image: "https://i.pravatar.cc/300?u=advisor4",
    rating: 4.8,
    reviews: 207,
    experience: "Over 22 years of practice",
  },
];

const commonQuestions = [
  "Am I likely to lose a job soon?",
  "What does the future hold for me?",
  "Can you read my palm lines?",
  "Will I achieve my goals this year?",
  "When will I find true love?",
];

export const AdvisorsSection = () => {
  return (
    <SectionLayout size="lg" variant="card">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography className="text-primary mb-2 font-semibold tracking-wider uppercase">
            Our Experts
          </Typography>
          <Typography variant="h2" className="text-4xl sm:text-5xl">
            Free Astrology Consultation
          </Typography>
          <Typography
            variant="large"
            className="text-muted-foreground mx-auto mt-4 max-w-2xl font-normal"
          >
            Connect with experienced astrologers who can guide you through
            life&apos;s challenges.
          </Typography>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {advisors.map((advisor, index) => (
          <AdvisorCard key={advisor.name} advisor={advisor} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Typography
          variant="muted"
          className="mb-4 text-center text-base font-medium"
        >
          Common questions our advisors answer:
        </Typography>
        <div className="flex flex-wrap justify-center gap-2">
          {commonQuestions.map((question) => (
            <Badge key={question} variant="outline" className="px-4 py-2">
              <MessageCircle className="mr-2 size-4" />
              {question}
            </Badge>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 flex justify-center"
      >
        <Link
          href="/start/quiz"
          className={cn(buttonVariants({ size: "lg" }), "min-w-48")}
        >
          Get my predictions
        </Link>
      </motion.div>
    </SectionLayout>
  );
};

const AdvisorCard = ({
  advisor,
  index,
}: {
  advisor: Advisor;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="relative mb-4">
            <Avatar className="size-24 border-4 border-white shadow-lg">
              <AvatarImage src={advisor.image} alt={advisor.name} />
              <AvatarFallback>{advisor.name[0]}</AvatarFallback>
            </Avatar>
            <div className="bg-primary text-primary-foreground absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-medium">
              Online
            </div>
          </div>
          <Typography variant="h3" className="mb-1">
            {advisor.name}
          </Typography>
          <Typography variant="muted" className="mb-3">
            {advisor.specialty}
          </Typography>
          <div className="mb-2 flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{advisor.rating}</span>
            <span className="text-muted-foreground text-sm">
              ({advisor.reviews} reviews)
            </span>
          </div>
          <Typography variant="muted" className="text-xs">
            {advisor.experience}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};
