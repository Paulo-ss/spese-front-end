import CategoryForm from "@/components/forms/category/CategoryForm";
import PageContainer from "@/components/pageContainer/PageContainer";

export default function CreateCategoryPage() {
  return (
    <PageContainer title="category.createCategory">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <CategoryForm />
        </div>
      </div>
    </PageContainer>
  );
}
