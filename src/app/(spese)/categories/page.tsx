import Categories from "@/components/categories/Categories";
import PageContainer from "@/components/pageContainer/PageContainer";
import { ICategory } from "@/interfaces/category.interface";
import { fetchResource } from "@/services/fetchService";

export default async function CategoriesPage() {
  const { data: categories, error } = await fetchResource<ICategory[]>({
    url: "/category/all/user",
    config: { options: { next: { tags: ["your-categories"] } } },
  });

  return (
    <PageContainer title="category.yourCategories">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <Categories categories={categories} error={error} />
        </div>
      </div>
    </PageContainer>
  );
}
