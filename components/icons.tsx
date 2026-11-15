import type { SVGProps } from "react";

/** 線條圖示（stroke 跟隨文字顏色） */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconBook = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    <path d="M8.5 7.5h7M8.5 11h5" />
  </Icon>
);

export const IconPen = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
    <path d="M14.5 5.5l3 3" />
    <path d="M12 21h8" />
  </Icon>
);

export const IconExam = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <rect x="4.5" y="3" width="15" height="18" rx="2" />
    <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    <path d="M15 15.5l1.3 1.3 2.2-2.6" />
  </Icon>
);

export const IconCamera = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M3.5 8.5A2 2 0 0 1 5.5 6.5h2l1.5-2h6l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    <circle cx="12" cy="13" r="3.5" />
  </Icon>
);

export const IconSpark = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2z" />
  </Icon>
);

export const IconArrow = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const IconChart = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16v-4M12 16V8M16 16v-6" />
  </Icon>
);

export const IconMemory = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 21a9 9 0 1 1 9-9" />
    <path d="M12 7v5l3 2" />
    <path d="M17 17l2 2 3-3" />
  </Icon>
);

export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

/** 品牌標誌：墨水滴 + 書頁 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1f2049" />
      <path d="M16 6.5c3.4 4.3 5.5 7.5 5.5 10.3a5.5 5.5 0 0 1-11 0c0-2.8 2.1-6 5.5-10.3z" fill="#c8963e" />
      <path d="M13.2 17.6a2.9 2.9 0 0 0 2.6 2.8" stroke="#1f2049" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
