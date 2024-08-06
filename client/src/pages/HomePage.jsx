import Greetings from "../components/Greetings";
import Tasks from "../components/Tasks";
import CreateTask from "../components/CreateTask";
import Categories from "../components/Categories";

export default function HomePage() {
    return (
        <div className="flex items-center p-2 overflow-hidden">
            <Categories />
            <div className="w-full px-20 py-4 pt-8">
                <div></div>
                <div className="h-[86vh] flex flex-col justify-between">
                    <div>
                        <Tasks />
                    </div>
                    <CreateTask />
                </div>
            </div>
        </div>
    );
}
