import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";

export function usePasswordResetSession() {
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPasswordResetSession = async () => {
      try {
        // Check if we have a valid session first
        const { data: { user }, error: sessionError } = await supabase.auth.getUser();

        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error("Ungültiger oder abgelaufener Link");
          router.push("/");
          return;
        }

        if (!user) {
          toast.error("Ungültiger oder abgelaufener Link");
          router.push("/");
          return;
        }

        // Verify the user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (userError || !userData) {
          toast.error("Benutzer nicht gefunden");
          router.push("/");
          return;
        }

        // If we get here, the session is valid
        setIsValidToken(true);
      } catch (error) {
        console.error("Unexpected error in password reset session check:", error);
        toast.error("Ein unerwarteter Fehler ist aufgetreten");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsValidToken(true);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT' || !session) {
          toast.error("Ungültiger oder abgelaufener Link");
          router.push("/");
        } else if (event === 'SIGNED_IN' && session) {
          checkPasswordResetSession();
        }
      }
    );

    checkPasswordResetSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return {
    isValidToken,
    isLoading,
  };
}
