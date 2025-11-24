import { Loader } from "lucide-react"

export const Laoding = () => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400">
            <Loader className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-medium">{"Cargando..."}</p>
        </div>
    )
}