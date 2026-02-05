import { Section, Row, Column, Text, Img, Link, Button } from "@react-email/components";
import { buildQrCodeUrl, HEIDI_BASE_URL } from "./constants";

interface SharedQrLoginSectionProps {
  size?: number;
  title?: string;
  description?: string;
  buttonText?: string;
  showButton?: boolean;
  variant?: "light" | "dark";
}

export const SharedQrLoginSection = ({
  size = 150,
  title = "Schneller Login mit QR-Code",
  description = "Scanne den QR-Code mit deinem Smartphone für direkten Zugriff.",
  buttonText = "Zum Login",
  showButton = false,
  variant = "light",
}: SharedQrLoginSectionProps) => {
  const qrCodeUrl = buildQrCodeUrl(HEIDI_BASE_URL, size);

  const isDark = variant === "dark";

  return (
    <Section
      className="mt-[32px] mb-[32px] text-center border border-solid border-[#E5E5E5] rounded-[24px] p-[30px]"
      style={
        isDark
          ? { backgroundColor: "#193333", color: "#fff", border: "none" }
          : undefined
      }
    >
      <Text
        className="text-lg font-medium mb-[20px]"
        style={{ color: isDark ? "#fff" : "#111" }}
      >
        {title}
      </Text>

      <Row>
        <Column align="center">
          <div className="inline-block bg-white p-[15px] rounded-[12px]">
            <Img
              src={qrCodeUrl}
              alt="Heidi Systems Login QR Code"
              width={size}
              height={size}
            />
          </div>

          <Text
            className="text-sm mt-[16px] mb-[20px]"
            style={{ color: isDark ? "#BDEAA4" : "#666" }}
          >
            {description}
          </Text>

          {showButton ? (
            <Button
              href={HEIDI_BASE_URL}
              className="rounded-full bg-[#BDEAA4] text-[#193333] text-base font-medium no-underline px-6 py-3"
            >
              {buttonText}
            </Button>
          ) : (
            <Link
              href={HEIDI_BASE_URL}
              className="text-[#2F6121] text-base font-medium underline"
            >
              {buttonText} →
            </Link>
          )}
        </Column>
      </Row>
    </Section>
  );
};
