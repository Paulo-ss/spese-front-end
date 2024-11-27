import CategoryForm from "@/components/forms/category/CategoryForm";
import PageContainer from "@/components/pageContainer/PageContainer";
import { ICategory } from "@/interfaces/category.interface";
import { fetchResource } from "@/services/fetchService";

export default async function EditCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const { data: category, error } = await fetchResource<ICategory>({
    url: `/category/${params.categoryId}`,
  });

  return (
    <PageContainer title="category.editCategory">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <CategoryForm category={category} error={error} />
        </div>
      </div>
    </PageContainer>
  );
}