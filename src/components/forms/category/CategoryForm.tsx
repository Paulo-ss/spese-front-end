"use client";

import editCategory from "@/app/actions/categories/editCategory";
import saveMultipleCategories from "@/app/actions/categories/saveMultipleCategories";
import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import Input from "@/components/ui/input/Input";
import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { ICategory, ICategoryForm } from "@/interfaces/category.interface";
import {
  IconChevronLeft,
  IconEdit,
  IconPlus,
  IconSend2,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm } from "react-hook-form";

interface IProps {
  category?: ICategory;
  error?: IAPIError;
}

const CategoryForm: FC<IProps> = ({ category, error }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ICategoryForm>({ defaultValues: { categories: [{ name: "" }] } });
  const { fields, append, remove, update } = useFieldArray<ICategoryForm>({
    control,
    name: "categories",
  });

  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: ICategoryForm) => {
    try {
      setIsLoading(true);

      const { error } = category
        ? await editCategory(category.id, data.categories[0])
        : await saveMultipleCategories(data.categories);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        });
      }

      router.push("/categories");
    } catch (error) {
      if (error && error instanceof Error) {
        toast({
          title: t("utils.error"),
          description: error.message ?? t("utils.somethingWentWrong"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      update(0, { name: category.name });
    }
  }, [category, update]);

  return (
    <Card
      title={category ? "category.editCategory" : "category.createCategory"}
      icon={category ? <IconEdit /> : <IconPlus />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/categories")}
          />
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
              {fields.map((field, index) => (
                <div key={field.id} className="col-span-2 sm:col-span-1">
                  <div
                    className={`flex gap-2 ${
                      errors?.categories &&
                      !!errors?.categories[index]?.name?.message
                        ? "items-center"
                        : "items-end"
                    }`}
                  >
                    <div className="grow">
                      <Controller
                        control={control}
                        name={`categories.${index}.name`}
                        defaultValue=""
                        rules={{
                          required: {
                            value: true,
                            message: t("utils.requiredField"),
                          },
                        }}
                        render={({ field: { value, onChange, name } }) => (
                          <Input
                            type="text"
                            label={t("category.categoryName")}
                            name={name}
                            value={value}
                            onChange={onChange}
                            error={
                              errors?.categories &&
                              !!errors?.categories[index]?.name?.message
                            }
                            helperText={
                              errors?.categories &&
                              errors?.categories[index]?.name?.message
                            }
                          />
                        )}
                      />
                    </div>

                    {!category && (
                      <div className="max-w-fit">
                        <IconButton
                          type="button"
                          icon={<IconTrash width={30} height={30} />}
                          color="error"
                          fullWidth
                          onClick={() => remove(index)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!category && (
              <div className="mt-2 p-6">
                <IconButton
                  type="button"
                  icon={<IconPlus width={30} height={30} />}
                  color="primary"
                  onClick={() => append({ name: "" })}
                />
              </div>
            )}

            <div
              className={` ${
                category ? "mt-6" : "mt-2"
              } p-6 flex gap-2 justify-end border-t border-gray-100 dark:border-zinc-600`}
            >
              <IconButton
                type="submit"
                icon={<IconSend2 width={30} height={30} />}
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>
          </form>
        </Fade>
      )}
    </Card>
  );
};

export default CategoryForm;
