// hoc/withAuth.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { addToast } = useToast();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
      if (!token) {
        addToast({
          variant: "destructive",
          title: "Unauthorized",
          description: "Please log in to access the admin panel.",
        });
        router.push("/admin/login");
      }
    }, [router, token, addToast]);

    if (!token) {
      return null; // Optionally, show a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
