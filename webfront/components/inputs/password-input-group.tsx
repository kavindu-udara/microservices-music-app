import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { useState } from "react";

const PasswordInputGroup = ({ id, placeholder, required }: { id: string, placeholder: string, required?: boolean }) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputGroup>
            <InputGroupInput
                id={id}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                required={required}
            />
            <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {
                    showPassword ? (
                        <EyeOffIcon />
                    ) : (
                        <EyeIcon className="text-muted-foreground" />
                    )
                }
            </InputGroupAddon>
        </InputGroup>
    )
}

export default PasswordInputGroup
