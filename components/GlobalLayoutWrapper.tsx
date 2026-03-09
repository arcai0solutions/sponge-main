"use client";

import { usePathname } from "next/navigation";
import SiteLogo from "@/components/SiteLogo";
import StaggeredMenu from "@/components/StaggeredMenu";
import Footer from "@/components/Footer";
import { AiChatWidget } from "@/components/ai-chat-widget";

export default function GlobalLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Check if the current route is within the admin section
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        // Render only the children (no nav, no footer, no chat widget)
        return <>{children}</>;
    }

    return (
        <>
            {/* Desktop: separate logo. Mobile: logo is inside StaggeredMenu bar */}
            <div className="hidden md:block">
                <SiteLogo />
            </div>
            <StaggeredMenu isFixed={true} menuButtonColor="#ffffff" showLogo={true} />

            {children}

            <Footer />
            {/* <AiChatWidget /> */}
        </>
    );
}
