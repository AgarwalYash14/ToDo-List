import CategoriesList from "./CategoriesList";
import CreateCategory from "./CreateCategory";

export default function Categories() {
    return (
        <>
            <div className="bg-white h-[97vh] w-96 flex flex-col justify-between border rounded-md px-6 py-8">
                <div>
                    <h1 className="text-2xl font-[WantedSans-Bold] mb-4">
                        Categories
                    </h1>
                    <div className="max-h-[71.25vh] overflow-auto">
                        <CategoriesList />
                    </div>
                </div>
                <div className="w-full">
                    <CreateCategory />
                </div>
            </div>
        </>
    );
}
