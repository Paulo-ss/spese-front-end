"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import { ICategory } from "@/interfaces/category.interface";
import { IconCategory, IconClipboardOff, IconPlus } from "@tabler/icons-react";
import { FC, Fragment } from "react";
import Card from "../ui/card/Card";
import IconButton from "../ui/button/IconButton";
import { useRouter } from "next-nprogress-bar";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { useTranslations } from "next-intl";
import CategoryItem from "./CategoryItem";

interface IProps {
  categories?: ICategory[];
  error?: IAPIError;
}

const Categories: FC<IProps> = ({ categories, error }) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Card
      title="category.yourCategories"
      icon={<IconCategory />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/categories/create")}
          />
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fragment>
          {categories && categories.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {categories?.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default Categories;
