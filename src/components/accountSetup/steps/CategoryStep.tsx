import updateUserSession from "@/app/actions/auth/updateUserSession";
import saveMultipleCategories from "@/app/actions/categories/saveMultipleCategories";
import IconButton from "@/components/ui/button/IconButton";
import Input from "@/components/ui/input/Input";
import { useToast } from "@/hooks/use-toast";
import { ICategoryForm } from "@/interfaces/category.interface";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { Slide } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const CategoryStep = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ICategoryForm>({ defaultValues: { categories: [{ name: "" }] } });
  const { fields, append, remove } = useFieldArray<ICategoryForm>({
    control,
    name: "categories",
  });

  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: ICategoryForm) => {
    try {
      if (
        data.categories.length === 1 &&
        data.categories[0].name.length === 0
      ) {
        await updateUserSession({ accountSetup: true });

        toast({
          title: t("utils.success"),
          description: t("yourAccountIsNowComplete"),
        });
        router.push("/");

        return;
      }

      setIsLoading(true);

      const { error } = await saveMultipleCategories(data.categories);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        });
      }

      await updateUserSession({ accountSetup: true });

      toast({
        title: t("utils.success"),
        description: t("yourAccountIsNowComplete"),
      });
      router.push("/");
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

  return (
    <Slide duration={300} direction="right" triggerOnce>
      <p className="text-2xl mt-2 p-6">
        {t("category.createCustomCategories")}
      </p>

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

                <div className="max-w-fit">
                  <IconButton
                    type="button"
                    icon={<IconTrash />}
                    color="error"
                    fullWidth
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-6">
          <IconButton
            type="button"
            icon={<IconPlus />}
            color="primary"
            onClick={() => append({ name: "", color: "" })}
          />
        </div>

        <div className="mt-2 p-6 flex gap-2 justify-end border-t border-zinc-300 dark:border-zinc-600">
          <IconButton
            type="submit"
            icon={<IconCheck />}
            color="primary"
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Slide>
  );
};

export default CategoryStep;
