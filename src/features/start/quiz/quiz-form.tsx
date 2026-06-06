"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Calendar,
  Clock,
  HelpCircle,
  MapPin,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Typography } from "@/components/custom/typography";

// Wheel Picker Component
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

type WheelPickerProps = {
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const WheelPicker = ({
  items,
  value,
  onChange,
  className,
}: WheelPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIndex = items.findIndex((item) => item.value === value);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollOffset = useRef(0);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: smooth ? "smooth" : "instant",
      });
    }
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0 && !isDragging) {
      scrollToIndex(selectedIndex, false);
    }
  }, [selectedIndex, scrollToIndex, isDragging]);

  const handleScroll = () => {
    if (containerRef.current && !isDragging) {
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      if (items[clampedIndex] && items[clampedIndex].value !== value) {
        onChange(items[clampedIndex].value);
      }
    }
  };

  const handleScrollEnd = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      scrollToIndex(clampedIndex);
      if (items[clampedIndex] && items[clampedIndex].value !== value) {
        onChange(items[clampedIndex].value);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    scrollOffset.current = containerRef.current?.scrollTop ?? 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && containerRef.current) {
      const deltaY = startY.current - e.touches[0].clientY;
      containerRef.current.scrollTop = scrollOffset.current + deltaY;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    handleScrollEnd();
  };

  const handleItemClick = (index: number) => {
    scrollToIndex(index);
    onChange(items[index].value);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Gradient overlays */}
      <div className="from-card pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b to-transparent" />
      <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t to-transparent" />

      {/* Selection indicator */}
      <div
        className="border-primary/30 bg-primary/5 pointer-events-none absolute inset-x-2 z-5 rounded-lg border"
        style={{
          top: `${((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT}px`,
          height: `${ITEM_HEIGHT}px`,
        }}
      />

      <div
        ref={containerRef}
        className="scrollbar-hide overflow-y-auto"
        style={{ height: `${VISIBLE_ITEMS * ITEM_HEIGHT}px` }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Padding items */}
        <div
          style={{ height: `${((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT}px` }}
        />

        {items.map((item, index) => (
          <div
            key={item.value}
            className={cn(
              "flex cursor-pointer items-center justify-center transition-all",
              selectedIndex === index
                ? "text-foreground font-semibold"
                : "text-muted-foreground/60",
            )}
            style={{ height: `${ITEM_HEIGHT}px` }}
            onClick={() => handleItemClick(index)}
          >
            <span className="text-lg">{item.label}</span>
          </div>
        ))}

        {/* Padding items */}
        <div
          style={{ height: `${((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT}px` }}
        />
      </div>
    </div>
  );
};

// Generate date options
const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const generateDays = (month: string, year: string) => {
  const daysInMonth = new Date(
    parseInt(year) || 2000,
    parseInt(month),
    0,
  ).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1),
  }));
};

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));
};

// Generate time options
const generateHours = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1),
  }));
};

const generateMinutes = () => {
  return Array.from({ length: 60 }, (_, i) => ({
    value: String(i).padStart(2, "0"),
    label: String(i).padStart(2, "0"),
  }));
};

const PERIODS = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

// Zodiac sign data
type ZodiacSign = {
  name: string;
  symbol: string;
  element: string;
  dates: string;
  traits: string[];
  ruling_planet: string;
  compatibility: string[];
};

const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  aries: {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    dates: "Mar 21 - Apr 19",
    traits: [
      "Courageous",
      "Energetic",
      "Confident",
      "Enthusiastic",
      "Passionate",
    ],
    ruling_planet: "Mars",
    compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
  },
  taurus: {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    dates: "Apr 20 - May 20",
    traits: ["Reliable", "Patient", "Practical", "Devoted", "Responsible"],
    ruling_planet: "Venus",
    compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"],
  },
  gemini: {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    dates: "May 21 - Jun 20",
    traits: ["Adaptable", "Curious", "Communicative", "Witty", "Versatile"],
    ruling_planet: "Mercury",
    compatibility: ["Libra", "Aquarius", "Aries", "Leo"],
  },
  cancer: {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    dates: "Jun 21 - Jul 22",
    traits: [
      "Intuitive",
      "Sentimental",
      "Compassionate",
      "Protective",
      "Loyal",
    ],
    ruling_planet: "Moon",
    compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"],
  },
  leo: {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    dates: "Jul 23 - Aug 22",
    traits: ["Creative", "Generous", "Warm-hearted", "Cheerful", "Humorous"],
    ruling_planet: "Sun",
    compatibility: ["Aries", "Sagittarius", "Gemini", "Libra"],
  },
  virgo: {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    dates: "Aug 23 - Sep 22",
    traits: ["Analytical", "Kind", "Hardworking", "Practical", "Loyal"],
    ruling_planet: "Mercury",
    compatibility: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
  },
  libra: {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    dates: "Sep 23 - Oct 22",
    traits: ["Diplomatic", "Fair-minded", "Social", "Cooperative", "Gracious"],
    ruling_planet: "Venus",
    compatibility: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
  },
  scorpio: {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    dates: "Oct 23 - Nov 21",
    traits: ["Resourceful", "Powerful", "Brave", "Passionate", "Stubborn"],
    ruling_planet: "Pluto",
    compatibility: ["Cancer", "Pisces", "Virgo", "Capricorn"],
  },
  sagittarius: {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    dates: "Nov 22 - Dec 21",
    traits: ["Generous", "Idealistic", "Humorous", "Adventurous", "Optimistic"],
    ruling_planet: "Jupiter",
    compatibility: ["Aries", "Leo", "Libra", "Aquarius"],
  },
  capricorn: {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    dates: "Dec 22 - Jan 19",
    traits: [
      "Responsible",
      "Disciplined",
      "Self-controlled",
      "Ambitious",
      "Patient",
    ],
    ruling_planet: "Saturn",
    compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"],
  },
  aquarius: {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    dates: "Jan 20 - Feb 18",
    traits: [
      "Progressive",
      "Original",
      "Independent",
      "Humanitarian",
      "Inventive",
    ],
    ruling_planet: "Uranus",
    compatibility: ["Gemini", "Libra", "Aries", "Sagittarius"],
  },
  pisces: {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    dates: "Feb 19 - Mar 20",
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise"],
    ruling_planet: "Neptune",
    compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
  },
};

const getZodiacSign = (dateString: string): ZodiacSign => {
  if (!dateString) return ZODIAC_SIGNS.aries;
  const [, month, day] = dateString.split("-").map(Number);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return ZODIAC_SIGNS.aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return ZODIAC_SIGNS.taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return ZODIAC_SIGNS.gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return ZODIAC_SIGNS.cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
    return ZODIAC_SIGNS.leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return ZODIAC_SIGNS.virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return ZODIAC_SIGNS.libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return ZODIAC_SIGNS.scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return ZODIAC_SIGNS.sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return ZODIAC_SIGNS.capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return ZODIAC_SIGNS.aquarius;
  return ZODIAC_SIGNS.pisces;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  const monthName = MONTHS.find((m) => m.value === month)?.label ?? month;
  return `${monthName} ${parseInt(day)}, ${year}`;
};

const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  const [h, m] = timeString.split(":");
  const hour24 = parseInt(h);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12}:${m} ${period}`;
};

type Gender = "male" | "female" | null;

type QuizData = {
  gender: Gender;
  birthDate: string;
  birthPlace: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  palmImage: string | null;
};

const STORAGE_KEY = "boilersaas_quiz_data";

const loadFromStorage = (): Partial<QuizData> => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

const saveToStorage = (data: Partial<QuizData>) => {
  if (typeof window === "undefined") return;
  const existing = loadFromStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
};

export const QuizForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<Gender>(null);
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.gender) setGender(stored.gender);
    if (stored.birthDate) setBirthDate(stored.birthDate);
    if (stored.birthPlace) setBirthPlace(stored.birthPlace);
    if (stored.birthTime) setBirthTime(stored.birthTime);
    if (stored.birthTimeUnknown) setBirthTimeUnknown(stored.birthTimeUnknown);
    if (stored.palmImage) setPalmImage(stored.palmImage);
  }, []);

  // Fetch location by IP
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city && !loadFromStorage().birthPlace) {
          setBirthPlace(data.city);
          saveToStorage({ birthPlace: data.city });
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoadingLocation(false);
      }
    };
    void fetchLocation();
  }, []);

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
    saveToStorage({ gender: selectedGender });
  };

  const handleBirthDateChange = (value: string) => {
    setBirthDate(value);
    saveToStorage({ birthDate: value });
  };

  const handleBirthPlaceChange = (value: string) => {
    setBirthPlace(value);
    saveToStorage({ birthPlace: value });
  };

  const handleBirthTimeChange = (value: string) => {
    setBirthTime(value);
    setBirthTimeUnknown(false);
    saveToStorage({ birthTime: value, birthTimeUnknown: false });
  };

  const handleBirthTimeUnknown = () => {
    setBirthTimeUnknown(true);
    setBirthTime("");
    saveToStorage({ birthTimeUnknown: true, birthTime: "" });
  };

  const handlePalmCapture = (imageData: string) => {
    setPalmImage(imageData);
    saveToStorage({ palmImage: imageData });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return gender !== null;
      case 2:
        return birthDate !== "";
      case 3:
        return birthPlace !== "";
      case 4:
        return birthTime !== "" || birthTimeUnknown;
      case 5:
        return palmImage !== null && palmImage !== "";
      case 6:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && step < 6) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      {/* Progress indicator */}
      {step < 6 && (
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepGender
            key="gender"
            gender={gender}
            onSelect={handleGenderSelect}
          />
        )}
        {step === 2 && (
          <StepBirthDate
            key="birthdate"
            value={birthDate}
            onChange={handleBirthDateChange}
          />
        )}
        {step === 3 && (
          <StepBirthPlace
            key="birthplace"
            value={birthPlace}
            onChange={handleBirthPlaceChange}
            isLoading={isLoadingLocation}
          />
        )}
        {step === 4 && (
          <StepBirthTime
            key="birthtime"
            value={birthTime}
            isUnknown={birthTimeUnknown}
            onChange={handleBirthTimeChange}
            onUnknown={handleBirthTimeUnknown}
          />
        )}
        {step === 5 && (
          <StepPalmCapture
            key="palm"
            image={palmImage}
            onCapture={handlePalmCapture}
          />
        )}
        {step === 6 && (
          <StepSummary
            key="summary"
            gender={gender}
            birthDate={birthDate}
            birthPlace={birthPlace}
            birthTime={birthTime}
            birthTimeUnknown={birthTimeUnknown}
            palmImage={palmImage}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="min-w-24"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        {step < 6 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="min-w-24"
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button className="min-w-24" onClick={() => router.push("/opt-in")}>
            <Sparkles className="size-4" />
            Get my reading
          </Button>
        )}
      </div>
    </div>
  );
};

// Step 1: Gender Selection
const StepGender = ({
  gender,
  onSelect,
}: {
  gender: Gender;
  onSelect: (g: Gender) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          What is your gender?
        </Typography>
        <Typography variant="muted" className="mt-2">
          This helps us personalize your reading
        </Typography>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card
          className={cn(
            "hover:border-primary/50 cursor-pointer transition-all",
            gender === "female" && "border-primary bg-primary/5",
          )}
          onClick={() => onSelect("female")}
        >
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <div className="text-5xl">👩</div>
            <Typography className="font-medium">Woman</Typography>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "hover:border-primary/50 cursor-pointer transition-all",
            gender === "male" && "border-primary bg-primary/5",
          )}
          onClick={() => onSelect("male")}
        >
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <div className="text-5xl">👨</div>
            <Typography className="font-medium">Man</Typography>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Step 2: Birth Date (US format: MM/DD/YYYY)
const StepBirthDate = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  // Parse value (stored as YYYY-MM-DD) or use defaults
  const currentYear = new Date().getFullYear();
  const [year, month, day] = value
    ? value.split("-")
    : [String(currentYear - 25), "01", "15"];

  const days = generateDays(month, year);
  const years = generateYears();

  const handleMonthChange = (newMonth: string) => {
    const newDays = generateDays(newMonth, year);
    const validDay =
      parseInt(day) > newDays.length
        ? String(newDays.length).padStart(2, "0")
        : day;
    onChange(`${year}-${newMonth}-${validDay}`);
  };

  const handleDayChange = (newDay: string) => {
    onChange(`${year}-${month}-${newDay}`);
  };

  const handleYearChange = (newYear: string) => {
    const newDays = generateDays(month, newYear);
    const validDay =
      parseInt(day) > newDays.length
        ? String(newDays.length).padStart(2, "0")
        : day;
    onChange(`${newYear}-${month}-${validDay}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          When were you born?
        </Typography>
        <Typography variant="muted" className="mt-2">
          Your birth date reveals your zodiac sign
        </Typography>
      </div>

      <Card>
        <CardContent className="p-4">
          <Label className="mb-3 block text-center">Date of birth</Label>
          <div className="flex items-center gap-1">
            {/* Month */}
            <div className="flex-1">
              <Typography
                variant="muted"
                className="mb-1 text-center text-xs uppercase"
              >
                Month
              </Typography>
              <WheelPicker
                items={MONTHS}
                value={month}
                onChange={handleMonthChange}
              />
            </div>

            {/* Day */}
            <div className="w-20">
              <Typography
                variant="muted"
                className="mb-1 text-center text-xs uppercase"
              >
                Day
              </Typography>
              <WheelPicker
                items={days}
                value={day}
                onChange={handleDayChange}
              />
            </div>

            {/* Year */}
            <div className="w-24">
              <Typography
                variant="muted"
                className="mb-1 text-center text-xs uppercase"
              >
                Year
              </Typography>
              <WheelPicker
                items={years}
                value={year}
                onChange={handleYearChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Step 3: Birth Place
const StepBirthPlace = ({
  value,
  onChange,
  isLoading,
}: {
  value: string;
  onChange: (v: string) => void;
  isLoading: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          Where were you born?
        </Typography>
        <Typography variant="muted" className="mt-2">
          Your birth location affects planetary positions
        </Typography>
      </div>

      <Card>
        <CardContent className="p-6">
          <Label htmlFor="birthplace" className="mb-2 block">
            City of birth
          </Label>
          <div className="relative">
            <MapPin className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="birthplace"
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                isLoading ? "Detecting location..." : "Enter your city"
              }
              className="pl-10 text-lg"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Step 4: Birth Time (12-hour format with AM/PM)
const StepBirthTime = ({
  value,
  isUnknown,
  onChange,
  onUnknown,
}: {
  value: string;
  isUnknown: boolean;
  onChange: (v: string) => void;
  onUnknown: () => void;
}) => {
  // Parse value (stored as HH:MM in 24h) or use defaults
  const parseTime = () => {
    if (!value) return { hour: "12", minute: "00", period: "PM" };
    const [h, m] = value.split(":");
    const hour24 = parseInt(h);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return {
      hour: String(hour12).padStart(2, "0"),
      minute: m || "00",
      period,
    };
  };

  const { hour, minute, period } = parseTime();
  const hours = generateHours();
  const minutes = generateMinutes();

  const buildTimeValue = (h: string, m: string, p: string) => {
    let hour24 = parseInt(h);
    if (p === "PM" && hour24 !== 12) hour24 += 12;
    if (p === "AM" && hour24 === 12) hour24 = 0;
    return `${String(hour24).padStart(2, "0")}:${m}`;
  };

  const handleHourChange = (newHour: string) => {
    onChange(buildTimeValue(newHour, minute, period));
  };

  const handleMinuteChange = (newMinute: string) => {
    onChange(buildTimeValue(hour, newMinute, period));
  };

  const handlePeriodChange = (newPeriod: string) => {
    onChange(buildTimeValue(hour, minute, newPeriod));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          What time were you born?
        </Typography>
        <Typography variant="muted" className="mt-2">
          This determines your rising sign
        </Typography>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className={cn(isUnknown && "pointer-events-none opacity-40")}>
            <Label className="mb-3 block text-center">Time of birth</Label>
            <div className="flex items-center justify-center gap-1">
              {/* Hour */}
              <div className="w-20">
                <Typography
                  variant="muted"
                  className="mb-1 text-center text-xs uppercase"
                >
                  Hour
                </Typography>
                <WheelPicker
                  items={hours}
                  value={hour}
                  onChange={handleHourChange}
                />
              </div>

              <span className="text-muted-foreground mt-6 text-2xl">:</span>

              {/* Minute */}
              <div className="w-20">
                <Typography
                  variant="muted"
                  className="mb-1 text-center text-xs uppercase"
                >
                  Min
                </Typography>
                <WheelPicker
                  items={minutes}
                  value={minute}
                  onChange={handleMinuteChange}
                />
              </div>

              {/* AM/PM */}
              <div className="w-20">
                <Typography
                  variant="muted"
                  className="mb-1 text-center text-xs uppercase"
                >
                  &nbsp;
                </Typography>
                <WheelPicker
                  items={PERIODS}
                  value={period}
                  onChange={handlePeriodChange}
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">or</span>
            </div>
          </div>

          <Button
            variant={isUnknown ? "default" : "outline"}
            onClick={onUnknown}
            className="w-full"
          >
            <HelpCircle className="size-4" />I don&apos;t know my birth time
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Step 5: Palm Capture
const StepPalmCapture = ({
  image,
  onCapture,
}: {
  image: string | null;
  onCapture: (data: string) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch {
      setError("Unable to access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        onCapture(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        onCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const retake = () => {
    onCapture("");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          Take a photo of your palm
        </Typography>
        <Typography variant="muted" className="mt-2">
          Position your hand flat with fingers spread
        </Typography>
      </div>

      <Card>
        <CardContent className="p-6">
          {error && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-center text-sm">
              {error}
            </div>
          )}

          {image ? (
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <img
                  src={image}
                  alt="Captured palm"
                  className="size-full object-cover"
                />
                {/* Palm lines overlay */}
                <PalmLinesOverlay />
              </div>
              <Button variant="outline" onClick={retake}>
                <Camera className="size-4" />
                Retake photo
              </Button>
            </div>
          ) : isStreaming ? (
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="size-full object-cover"
                />
                {/* Hand silhouette guide overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <HandSilhouette />
                </div>
              </div>
              <Button onClick={capturePhoto}>
                <Camera className="size-4" />
                Capture
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="bg-muted flex size-24 items-center justify-center rounded-full">
                <Camera className="text-muted-foreground size-10" />
              </div>
              <div className="flex w-full max-w-xs flex-col gap-2">
                <Button onClick={() => void startCamera()} className="w-full">
                  <Camera className="size-4" />
                  Open camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="size-4" />
                  Upload a photo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Hand silhouette SVG for camera guide
const HandSilhouette = () => {
  return (
    <svg
      viewBox="0 0 200 280"
      className="h-[70%] w-auto opacity-40"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Palm outline */}
      <path
        d="M 60 280
           Q 40 240 45 200
           Q 50 160 55 140
           Q 35 130 30 100
           Q 25 70 40 60
           Q 55 50 65 70
           Q 70 85 70 100
           L 70 120
           Q 55 100 50 70
           Q 48 50 60 40
           Q 75 30 85 50
           Q 90 65 88 90
           L 88 120
           Q 80 90 82 60
           Q 85 35 100 30
           Q 115 25 120 50
           Q 125 70 120 100
           L 118 130
           Q 125 100 130 70
           Q 135 45 150 45
           Q 165 45 168 70
           Q 170 90 165 120
           L 160 150
           Q 175 130 180 110
           Q 185 90 175 75
           Q 165 60 180 55
           Q 195 50 200 75
           Q 205 100 195 130
           Q 185 160 170 190
           Q 160 220 150 250
           Q 145 270 140 280
           Z"
        strokeDasharray="8 4"
      />
      {/* Center text */}
      <text
        x="100"
        y="200"
        textAnchor="middle"
        fill="white"
        stroke="none"
        fontSize="14"
        fontWeight="500"
      >
        Place your palm here
      </text>
    </svg>
  );
};

// Palm lines overlay SVG
const PalmLinesOverlay = () => {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 size-full"
      style={{ mixBlendMode: "screen" }}
    >
      {/* Heart line */}
      <path
        d="M 15 30 Q 50 20 85 35"
        fill="none"
        stroke="#ef4444"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Head line */}
      <path
        d="M 10 45 Q 50 40 90 50"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Life line */}
      <path
        d="M 25 20 Q 20 50 30 85"
        fill="none"
        stroke="#22c55e"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Fate line */}
      <path
        d="M 50 85 Q 50 60 55 30"
        fill="none"
        stroke="#a855f7"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};

// Step 6: Summary with loading animation
const StepSummary = ({
  gender,
  birthDate,
  birthPlace,
  birthTime,
  birthTimeUnknown,
  palmImage,
}: {
  gender: Gender;
  birthDate: string;
  birthPlace: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  palmImage: string | null;
}) => {
  const zodiac = getZodiacSign(birthDate);
  const [step, setStep] = useState(0);

  // Total steps: palm(1), zodiac symbol(2), zodiac name(3), element/planet(4),
  // divider1(5), personality label(6), traits(7),
  // divider2(8), matches label(9), compatibility(10),
  // divider3(11), info label(12), info grid(13), done(14)
  const totalSteps = 14;

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= totalSteps; i++) {
      timers.push(
        setTimeout(() => {
          setStep(i);
        }, i * 400),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const isLoading = step < totalSteps;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          Your Astrology Profile
        </Typography>
        <Typography variant="muted" className="mt-2">
          {isLoading
            ? "Analyzing your cosmic blueprint..."
            : "Analysis complete"}
        </Typography>
      </div>

      <Card>
        <CardContent className="p-5">
          {/* Palm image + Zodiac header */}
          <div className="flex gap-4">
            {/* Palm image */}
            {palmImage && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate={step >= 1 ? "visible" : "hidden"}
                transition={{ duration: 0.8 }}
                className="relative size-24 shrink-0 overflow-hidden rounded-lg"
              >
                <img
                  src={palmImage}
                  alt="Your palm"
                  className="size-full object-cover"
                />
                <PalmLinesOverlay />
              </motion.div>
            )}

            {/* Zodiac info */}
            <div className="flex flex-1 flex-col justify-center">
              <div className="flex items-center gap-2">
                <motion.span
                  variants={fadeIn}
                  initial="hidden"
                  animate={step >= 2 ? "visible" : "hidden"}
                  transition={{ duration: 0.8 }}
                  className="text-3xl"
                >
                  {zodiac.symbol}
                </motion.span>
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate={step >= 3 ? "visible" : "hidden"}
                  transition={{ duration: 0.8 }}
                >
                  <Typography variant="h3" className="text-lg leading-tight">
                    {zodiac.name}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    {zodiac.dates}
                  </Typography>
                </motion.div>
              </div>
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate={step >= 4 ? "visible" : "hidden"}
                transition={{ duration: 0.8 }}
                className="mt-2 flex gap-1.5"
              >
                <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                  {zodiac.element}
                </span>
                <span className="bg-muted rounded px-1.5 py-0.5 text-[10px]">
                  {zodiac.ruling_planet}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Divider 1 */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 5 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="my-4 border-t"
          />

          {/* Personality Traits */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 6 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
          >
            <Typography className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Personality
            </Typography>
          </motion.div>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 7 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap gap-1.5"
          >
            {zodiac.traits.map((trait, i) => (
              <motion.span
                key={trait}
                variants={fadeIn}
                initial="hidden"
                animate={step >= 7 ? "visible" : "hidden"}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-muted rounded px-2 py-0.5 text-xs"
              >
                {trait}
              </motion.span>
            ))}
          </motion.div>

          {/* Divider 2 */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 8 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="my-4 border-t"
          />

          {/* Compatibility */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 9 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
          >
            <Typography className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Best Matches
            </Typography>
          </motion.div>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 10 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="flex gap-1.5"
          >
            {zodiac.compatibility.map((sign, i) => (
              <motion.span
                key={sign}
                variants={fadeIn}
                initial="hidden"
                animate={step >= 10 ? "visible" : "hidden"}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="border-primary/20 bg-primary/5 text-primary rounded border px-2 py-0.5 text-xs font-medium"
              >
                {sign}
              </motion.span>
            ))}
          </motion.div>

          {/* Divider 3 */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 11 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="my-4 border-t"
          />

          {/* User details */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 12 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
          >
            <Typography className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Your Info
            </Typography>
          </motion.div>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={step >= 13 ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <User className="text-muted-foreground size-3" />
              <span>{gender === "female" ? "Woman" : "Man"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="text-muted-foreground size-3" />
              <span>{formatDate(birthDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="text-muted-foreground size-3" />
              <span className="truncate">{birthPlace}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="text-muted-foreground size-3" />
              <span>
                {birthTimeUnknown ? "Unknown" : formatTime(birthTime)}
              </span>
            </div>
          </motion.div>

          {/* Loading indicator while revealing */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center justify-center gap-2"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-primary/40 size-1.5 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <Typography variant="muted" className="text-xs">
                Reading your stars...
              </Typography>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
