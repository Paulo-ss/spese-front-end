import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from "@/components/ui/carousel";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import { InvoiceStatus } from "@/enums/invoice.enum";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IInvoice } from "@/interfaces/invoice.interface";
import { EmblaCarouselType } from "embla-carousel";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import InvoiceItem from "./InvoiceItem";

import { Locale } from "@/types/locale.type";

interface IProps {
  invoices: IInvoice[];
  locale: Locale;
  error?: IAPIError;
}

const today = new Date();

const findFirstInvoiceSlide = (invoices: IInvoice[]) => {
  let firstSlide = 0;

  for (let i = 0; i < invoices.length - 1; i++) {
    const invoice = invoices[i];

    if (invoice.status === InvoiceStatus.CLOSED) {
      firstSlide = i;
      break;
    }

    if (invoice.status === InvoiceStatus.OPENED_CURRENT) {
      firstSlide = i;
      break;
    }
  }

  return firstSlide;
};

const Invoices: FC<IProps> = ({ invoices, error, locale }) => {
  const [carousel, setCarousel] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(
    findFirstInvoiceSlide(invoices),
  );

  const isFirstRender = useRef(true);

  const updateCurrentSlide = useCallback((emblaApi: EmblaCarouselType) => {
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!carousel) {
      return;
    }

    if (isFirstRender.current && currentSlide !== 0) {
      carousel.scrollTo(currentSlide, true);
      isFirstRender.current = false;
    }
  }, [carousel, isFirstRender, currentSlide]);

  useEffect(() => {
    if (!carousel) {
      return;
    }

    carousel.on("select", updateCurrentSlide);

    return () => {
      carousel.off("select", updateCurrentSlide);
    };
  }, [carousel, updateCurrentSlide]);

  return (
    <div className="mt-5 w-full shadow-sm rounded-md bg-white dark:bg-zinc-900 dark:text-zinc-50">
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <div>
          <div className="p-4 flex gap-4 overflow-auto no-scrollbar">
            {invoices.map((invoice, index) => {
              const invoicesColors = {
                [InvoiceStatus.PAID]: `${
                  currentSlide === index
                    ? "bg-emerald-500 text-zinc-900"
                    : "bg-transparent text-emerald-500"
                }`,
                [InvoiceStatus.CLOSED]: `${
                  currentSlide === index
                    ? "bg-red-500 text-zinc-900"
                    : "bg-transparent text-red-500"
                }`,
                [InvoiceStatus.DELAYED]: `${
                  currentSlide === index
                    ? "bg-red-500 text-zinc-900"
                    : "bg-transparent text-red-500"
                }`,
                [InvoiceStatus.OPENED_CURRENT]: `${
                  currentSlide === index
                    ? "bg-sky-500 text-zinc-900"
                    : "bg-transparent text-sky-500"
                }`,
                [InvoiceStatus.OPENED_FUTURE]: `${
                  currentSlide === index
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-transparent text-amber-500"
                }`,
              };
              const [year, month, day] = invoice.dueDate.split("-").map(Number);
              const formattedDueDate = new Date(
                year,
                month - 1,
                day,
              ).toLocaleDateString(locale, {
                month: "short",
                year: year !== today.getFullYear() ? "2-digit" : undefined,
              });

              return (
                <div
                  key={invoice.id}
                  className={`${
                    invoicesColors[invoice.status]
                  } flex justify-center items-center py-2 px-3 rounded-3xl transition-colors cursor-pointer grow min-w-fit max-w-40 scroll`}
                  onClick={() => {
                    if (!carousel) {
                      return;
                    }

                    carousel.scrollTo(index);
                  }}
                >
                  {formattedDueDate.toUpperCase()}
                </div>
              );
            })}
          </div>

          <Carousel setApi={setCarousel}>
            <CarouselContent className="rounded-md -ml-0">
              {invoices.map((invoice, index) => (
                <InvoiceItem
                  key={invoice.id}
                  invoice={invoice}
                  index={index}
                  currentSlide={currentSlide}
                  locale={locale}
                />
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default Invoices;
