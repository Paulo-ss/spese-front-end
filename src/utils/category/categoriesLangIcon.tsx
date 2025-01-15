import {
  IconBarbell,
  IconBeach,
  IconBurger,
  IconCar,
  IconCash,
  IconContract,
  IconDeviceGamepad2,
  IconDog,
  IconForbid,
  IconHanger,
  IconHome,
  IconHospital,
  IconSchool,
} from "@tabler/icons-react";

const categories = {
  NA: {
    lang: { pt: "NÃO INFORMADO", en: "NO CATEGORY" },
    icon: <IconForbid className="w-6 h-6" />,
  },
  HEALTH: {
    lang: { pt: "SAÚDE", en: "HEALTH" },
    icon: <IconHospital className="w-6 h-6" />,
  },
  LEISURE: {
    lang: { pt: "LAZER", en: "LEISURE" },
    icon: <IconBeach className="w-6 h-6" />,
  },
  ACADEMIC: {
    lang: { pt: "ACADÊMICO", en: "ACADEMIC" },
    icon: <IconSchool className="w-6 h-6" />,
  },
  FUN: {
    lang: { pt: "DIVERSÃO", en: "FUN" },
    icon: <IconDeviceGamepad2 className="w-6 h-6" />,
  },
  FOOD: {
    lang: { pt: "COMIDA", en: "FOOD" },
    icon: <IconBurger className="w-6 h-6" />,
  },
  HOME: {
    lang: { pt: "CASA", en: "HOME" },
    icon: <IconHome className="w-6 h-6" />,
  },
  CLOTHES: {
    lang: { pt: "ROUPAS", en: "CLOTHES" },
    icon: <IconHanger className="w-6 h-6" />,
  },
  PETS: {
    lang: { pt: "PETS", en: "PETS" },
    icon: <IconDog className="w-6 h-6" />,
  },
  UBER: {
    lang: { pt: "UBER", en: "UBER" },
    icon: <IconCar className="w-6 h-6" />,
  },
  INVESTIMENT: {
    lang: { pt: "INVESTIMENTO", en: "INVESTIMENT" },
    icon: <IconCash className="w-6 h-6" />,
  },
  GYM: {
    lang: { pt: "ACADEMIA", en: "GYM" },
    icon: <IconBarbell className="w-6 h-6" />,
  },
  SUBSCRIPTION: {
    lang: { pt: "ASSINATURA", en: "SUBSCRIPTION" },
    icon: <IconContract className="w-6 h-6" />,
  },
};

export { categories };
