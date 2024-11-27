"use client";

import { ICategory } from "@/interfaces/category.interface";
import { FC, useState } from "react";
import IconButton from "../ui/button/IconButton";
import { IconCheckbox, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Button from "../ui/button/Button";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import deleteCategory from "@/app/actions/categories/deleteCategory";
import { theme } from "@/lib/theme/theme";

interface IProps {
  category: ICategory;
}

const CategoryItem: FC<IProps> = ({ category }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const { error } = await deleteCategory(category.id);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
          variant: "destructive",
        });

        return;
      }

      toast({
        title: t("utils.success"),
        description: t("category.categoryDeleted"),
        action: (
          <IconCheckbox className="w-6 h-6" color={theme.colors.emerald[400]} />
        ),
      });
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
    <div className="col-span-1 p-2 flex items-center gap-3">
      <div className="flex items-center">
        <div
          className={`flex justify-center items-center p-2 w-12 h-12 rounded-full border border-yellow-400 dark:border-yellow-800 bg-yellow-100 dark:bg-yellow-300 text-yellow-400 dark:text-yellow-800`}
        >
          {category.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="grow flex items-end gap-2">
        <p className="text-base font-bold">{category.name}</p>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          type="button"
          color="info"
          icon={<IconEdit />}
          onClick={() => router.push(`/categories/${category.id}`)}
        />

        <Dialog>
          <DialogTrigger asChild>
            <IconButton type="button" color="error" icon={<IconTrash />} />
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {t("utils.confirmDelete", { name: t("category.DEFAULT") })}
              </DialogTitle>

              <DialogDescription>
                {t("utils.thisActionCantBeUndone")}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  color="neutral"
                  text={t("utils.cancel")}
                  onClick={onDelete}
                  trailing={<IconX />}
                />
              </DialogClose>

              <Button
                type="button"
                color="error"
                text={t("utils.delete")}
                onClick={onDelete}
                trailing={<IconTrash />}
                disabled={isLoading}
                isLoading={isLoading}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CategoryItem;
