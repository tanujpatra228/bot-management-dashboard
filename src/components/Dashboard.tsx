import {
    Home,
    Menu
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import BotDataTable from "./BotDataTable"

const Link = ({ children, href, className }: any) => {
    return (<a href={href} className={className}>{children}</a>)
}

export function Dashboard() {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex-1">
                        <nav className="grid items-start text-sm font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-3 px-3 py-4 border-b text-muted-foreground transition-all hover:text-primary lg:h-[60px]"
                            >
                                <Home className="h-4 w-4" />
                                Bots Management
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <div className="relative">
                            <h2>Dashboard</h2>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-2 p-4 lg:p-6 relative">
                    <BotDataTable />
                </main>
            </div>
        </div>
    )
}