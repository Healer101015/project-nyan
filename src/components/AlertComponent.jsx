import { Alert } from "@material-tailwind/react";

function IconInfo() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
    );
}

export function AlertLoginNeeded({ message }) {
    return (
        <Alert color="blue" icon={<IconInfo />} variant="filled" className="mb-4">
            {message}
        </Alert>
    );
}
