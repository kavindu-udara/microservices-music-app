import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import useAuthStore from "@/lib/store";
import { useRouter } from "next/navigation";

const Header = () => {

    const router = useRouter();
    const user = useAuthStore((state) => state.user);

    return (
        <header className=" text-white p-4 w-full flex justify-between items-center">
            <div className="flex gap-4">
                <ChevronLeftIcon />
                <ChevronRightIcon />
            </div>
            <div className="flex gap-4">
                <InputGroup>
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
                {
                    !user ? (
                        <>
                            <Button variant="secondary" onClick={() => router.push("/login")}>Login</Button>
                            <Button onClick={() => router.push("/register")} >Create free Account</Button>
                        </>
                    ) : (
                        <Button>
                            {user.firstName} {user.lastName}
                        </Button>
                    )
                }
            </div>
        </header>
    );
}

export default Header;
