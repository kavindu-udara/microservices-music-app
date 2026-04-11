import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

const Header = () => {
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
                <Button variant="secondary">Login</Button>
                <Button>Create free Account</Button>
            </div>
        </header>
    );
}

export default Header;
