"use client";

import { usePathname } from "next/navigation";
import Text from "@repo/ui/Text";
import { useMediaQuery } from "@/_hooks/useMediaQuery";

interface HeaderTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function HeaderTitle({
  className,
}: HeaderTitleProps): React.ReactElement {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const mapPathnameToTitle = {
    main: "Inter Persona",
    interviewer: "Select Interviewer",
    interview: "Interview",
    result: "Result",
  };

  const title = isMobile
    ? mapPathnameToTitle[
        pathname.split("/")[1] as keyof typeof mapPathnameToTitle
      ]
    : "Inter Persona";

  return (
    <Text as="h1" className={className}>
      {title || "Inter Persona"}
    </Text>
  );
}
