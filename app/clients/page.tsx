import React from 'react';
import type { Metadata } from 'next';
import ClientsHero from '@/components/ClientsPage/ClientsHero';
import FeedbackCard from '@/components/ClientsPage/FeedbackCard';

export const metadata: Metadata = {
    title: "Our Clients | Sponge Global",
    description: "Read inspiring feedback and see how Sponge Global transforms organizations.",
};

const feedbacks = [
    {
        author: "Tharushka Fernando",
        designation: "Assistant Brand Manager",
        company: "Ceylinco Life Insurance Ltd",
        content: `Dear Sam,

I’m writing this note to sincerely thank you for the excellent series of training sessions you conducted for our 20 teams.

We concluded the final round last week, and I’m happy to share that the senior board members were extremely impressed with the quality of the presentations, particularly the confidence, structure, and language used. They even inquired about the trainer behind the sessions, as they clearly noticed a significant improvement compared to previous competitions.

We truly appreciate the effort and dedication you put into grooming the teams. It was evident that you went above and beyond what was initially agreed upon, and for that, we are deeply grateful.

All the best.

Thanks and Regards,
Tharushka Fernando
Assistant Brand Manager
Ceylinco Life Insurance Ltd,
Ceylinco Life Tower,
106, Havelock Road,
Colombo 05,
Sri Lanka.
Phone: (+94)11-2461351 /0786690909
www.ceylincolife.com`
    },
    {
        author: "Isuru Chandradasa",
        designation: "Lecturer (Probationary)",
        company: "Department of Human Resources Management, University of Colombo",
        content: `Dear Sir/Madam,

A very good morning!

On behalf of the Department of Human Resources Management, University of Colombo, I would like to extend our sincere gratitude for your invaluable contribution to the HR Analytics Bootcamp 2026.

Your session added tremendous value to the program, and we are truly appreciative of the time, expertise, and practical insights you generously shared with our students. Your engaging delivery and real-world perspectives significantly enhanced their understanding of HR Analytics and its strategic importance in today’s organizations.

I am especially pleased to share that, based on student feedback, the bootcamp has been a resounding success. Participants highly appreciated the clarity, relevance, and practical orientation of the sessions. Your contribution played a vital role in creating this meaningful learning experience.

We deeply value your support and professionalism, and we sincerely look forward to future opportunities to collaborate with you in advancing industry–academia engagement initiatives. A few photos were taken, and the event is attached to this email for your kind perusal

Thank you once again for being part of this important journey.

Best regards

Isuru Chandradasa
Lecturer (Probationary)
Department of Human Resources Management
Faculty of Management and Finance
University of Colombo
Colombo 03
Sri Lanka`
    }
];

export default function ClientsPage() {
    return (
        <main className="bg-black min-h-screen text-white pt-24 md:pt-0">
            <ClientsHero />

            <section className="px-6 md:px-12 lg:px-24 pb-32 -mt-8 relative z-20">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Client <span className="text-[#E31E24]">Feedback</span></h2>
                        <div className="h-px bg-white/20 flex-grow max-w-sm ml-6 hidden md:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {feedbacks.map((feedback, index) => (
                            <FeedbackCard
                                key={index}
                                author={feedback.author}
                                designation={feedback.designation}
                                company={feedback.company}
                                content={feedback.content}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
