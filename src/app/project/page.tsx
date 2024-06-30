import NoProject from "@/components/project/NoProject";
import Sidebar from "@/components/project/Sidebar";


export default function Page() {
    return (
        <>
            <div className="flex">
            <Sidebar />
        <NoProject />
            </div>
        </>
    );
}
