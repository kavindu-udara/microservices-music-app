import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { useState } from "react";

type Props = {
    id: string;
    name? : string;
    placeholder: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    ariaInvalid?: boolean;
}

const PasswordInputGroup = ({ id, placeholder, required, onChange, ariaInvalid, name }: Props) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputGroup>
            <InputGroupInput
                id={id}
                name={name}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                required={required}
                onChange={onChange}
                aria-invalid={ariaInvalid}
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
