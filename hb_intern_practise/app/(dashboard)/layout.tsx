import Navbar from "@/components/Navbar"
import Sidebar from "@/components/sidebar"
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
const DashBoardLayout = async ({
    children
}:{
    children:React.ReactNode;
}) => {
    const isPro = await checkSubscription();
    const apiLimitCount = await getApiLimitCount();
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:flex-col md:fixed md:w-72 md:insert-y-0 bg-gray-900">
                <Sidebar apiLimitCount={apiLimitCount} isPro={isPro}/>
            </div>
            <main className="md:pl-72">
                <Navbar />
                {children}
            </main>
        </div>

    );
}
export default DashBoardLayout
