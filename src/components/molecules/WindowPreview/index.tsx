import type { CSSProperties } from "react";

import { WindowGlass } from "@src/components/atoms/WindowGlass";
import { WindowHardware } from "@src/components/atoms/WindowHardware";
import { WindowProfile } from "@src/components/atoms/WindowProfile";
import {
  WINDOW_LAYOUTS,
  type SashSpec,
  type WindowSystemType,
} from "@src/components/molecules/WindowPreview/window-systems";
import { cn } from "@src/lib/utils";

import "@src/components/molecules/WindowPreview/window-preview.css";

export type { WindowSystemType };

type WindowPreviewProps = {
  system: WindowSystemType;
  // Chave do acabamento nos tokens ([data-finish] em src/styles/tokens.css).
  finish: string;
  // Foto da vista externa, vista através do vidro.
  view: string;
  open?: boolean;
  className?: string;
};

const REVEAL_SIDES = ["top", "right", "bottom", "left"] as const;

const WindowSash = ({ sash }: { sash: SashSpec }) => (
  <div className="wp-sash" data-position={sash.position}>
    <WindowGlass />
    <WindowProfile tier="bead" className="wp-bead" />
    <WindowProfile tier="sash" />
    {sash.hardware.map((item) => (
      <WindowHardware key={item.at} kind={item.kind} className={`wp-at-${item.at}`} />
    ))}
    {sash.edge && <span className="wp-sash-edge" data-edge={sash.edge} />}
  </div>
);

// Janela instalada numa parede clara: requadro com profundidade, marco, folhas, vidro e
// ferragens do sistema escolhido. Só CSS: sem 3D em WebGL nem imagens dos perfis.
export const WindowPreview = ({
  system,
  finish,
  view,
  open = false,
  className,
}: WindowPreviewProps) => {
  const layout = WINDOW_LAYOUTS[system];
  const size: CSSProperties & Record<`--${string}`, number> = {
    "--win-w": layout.width,
    "--win-h": layout.height,
  };

  return (
    <div
      className={cn("window-preview", className)}
      data-system={system}
      data-finish={finish}
      data-open={open}
      data-sliding={layout.sliding}
    >
      <span aria-hidden="true" className="wp-wall" />
      <div aria-hidden="true" className="wp-opening" style={size}>
        <span className="wp-reveal">
          {REVEAL_SIDES.map((side) => (
            <span key={side} className="wp-reveal-face" data-side={side} />
          ))}
        </span>
        <div className="wp-window">
          <span className="wp-view">
            <img src={view} alt="" loading="lazy" decoding="async" />
          </span>
          <WindowProfile tier="frame" />
          {layout.sliding && <WindowProfile tier="track" className="wp-track" />}
          <div key={system} className="wp-sashes">
            {layout.sashes.map((sash) => (
              <WindowSash key={sash.position} sash={sash} />
            ))}
            {layout.fixings.map((item) => (
              <WindowHardware key={item.at} kind={item.kind} className={`wp-at-${item.at}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
