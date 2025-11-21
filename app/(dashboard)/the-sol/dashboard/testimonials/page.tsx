import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import TestimonialsManager from "@/components/admin/testimonials-manager";
import { Suspense } from "react";

function TestimonialsLoading() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Testimonials Management
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Review and approve customer testimonials
            </p>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="h-24 sm:h-32 bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-24 sm:h-32 bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

async function getTestimonialsData(headersObj: Headers) {
  const session = await auth.api.getSession({
    headers: headersObj,
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return testimonials;
}

async function TestimonialsContent({ headersObj }: { headersObj: Headers }) {
  const testimonials = await getTestimonialsData(headersObj);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Testimonials Management
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Review and approve customer testimonials
            </p>
          </div>
        </div>

        <TestimonialsManager
          testimonials={JSON.parse(JSON.stringify(testimonials))}
        />
      </div>
    </div>
  );
}

export default async function TestimonialsPage() {
  const headersObj = await headers();
  
  return (
    <Suspense fallback={<TestimonialsLoading />}>
      <TestimonialsContent headersObj={headersObj} />
    </Suspense>
  );
}
