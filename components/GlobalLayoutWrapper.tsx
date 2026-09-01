"use client";

import { usePathname } from "next/navigation";
import SiteLogo from "@/components/SiteLogo";
import StaggeredMenu from "@/components/StaggeredMenu";
import Footer from "@/components/Footer";
import { AiChatWidget } from "@/components/ai-chat-widget";
import PageTracker from "@/components/PageTracker";

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
            {/* Desktop (>=768px): standalone logo. Below that: logo lives inside the
                StaggeredMenu bar. The two are mutually exclusive — see the matching
                breakpoints in StaggeredMenu.css. */}
            <div className="hidden md:block">
                <SiteLogo />
            </div>
            <StaggeredMenu isFixed={true} menuButtonColor="#ffffff" showLogo={true} />

            {children}

            <Footer />
            <AiChatWidget />
            <PageTracker />
        </>
    );
}
