import Linkify from "react-linkify";
import { Tooltip as AriaTooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";

export const Tooltip = ({ children, content, ...props }) => {
  const tooltip = useTooltipStore({ placement: "bottom", showTimeout: 100 });

  if (!content) return <span>{children}</span>;

  return (
    <>
      <TooltipAnchor
        store={tooltip}
        className="focus-visible:ariakit-outline aria-disabled:opacity-50"
        style={{ fontWeight: "inherit" }}
        {...props}
      >
        {children}
      </TooltipAnchor>
      <AriaTooltip
        store={tooltip}
        className="max-w-md px-2 py-1 text-sm border border-gray-500 rounded bg-neutral-50 drop-shadow"
      >
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a key={key} className="text-[#2F80ED] underline" href={decoratedHref} target="blank">
              {decoratedText}
            </a>
          )}
        >
          {content}
        </Linkify>
      </AriaTooltip>
    </>
  );
};
