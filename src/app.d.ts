/// <reference types="@sveltejs/kit" />

interface UserConfig {
  default_currency: string;
  locale: string;
  journal_path: string;
  financial_year_starting_month: number;
}

// eslint-disable-next-line no-var
declare var USER_CONFIG: UserConfig;

declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  // interface Platform {}
}

declare module "textures" {
  const textures: any;
  export default textures;
}

declare module "arima/async" {
  export class Arima {
    constructor(options: object);
    train(points: number[]): Arima;
    predict(count: number): [number[], number[]];
  }
  const P: Promise<typeof Arima>;
  export default P;
}

declare module "d3-sankey-circular" {
  export function sankeyCircular(): any;
  export function sankeyJustify(): any;
}

declare module "d3-path-arrows" {
  export function pathArrows(): any;
}

declare module "compute-cosine-similarity" {
  export default function similarity(a: number[], b: number[]): number;
}

declare module "svelte-carousel" {
  import type { SvelteComponentTyped } from "svelte";

  interface CarouselProps {
    /**
     * Enables next/prev arrows
     */
    arrows?: boolean;
    /**
     * Infinite looping
     */
    infinite?: boolean;
    /**
     * Page to start on
     */
    initialPageIndex?: number;
    /**
     * Transition duration (ms)
     */
    duration?: number;
    /**
     * Enables autoplay of pages
     */
    autoplay?: boolean;
    /**
     *  Autoplay change interval (ms)
     */
    autoplayDuration?: number;
    /**
     *  Autoplay change direction (next or prev)
     */
    autoplayDirection?: "next" | "prev";
    /**
     * 	Pauses on focus (for touchable devices - tap the carousel to toggle the autoplay, for non-touchable devices - hover over the carousel to pause the autoplay)
     */
    pauseOnFocus?: boolean;
    /**
     * Shows autoplay duration progress indicator
     */
    autoplayProgressVisible?: boolean;
    /**
     * 	Current indicator dots
     */
    dots?: boolean;
    /**
     * CSS animation timing function
     */
    timingFunction?: string;
    /**
     * 	swiping
     */
    swiping?: boolean;
    /**
     *  Number elements to show
     */
    particlesToShow?: number;
    /**
     * Number of elements to scroll
     */
    particlesToScroll?: number;
  }

  interface CarouselEvents {
    pageChange: CustomEvent<number>;
  }

  interface CarouselSlots {
    prev: {
      showPrevPage: () => void;
    };
    next: {
      showNextPage: () => void;
    };
    dots: {
      showPage: (pageIndex: number) => void;
      currentPageIndex: number;
      pagesCount: number;
    };
    default: {
      showPrevPage: () => void;
      showNextPage: () => void;
      currentPageIndex: number;
      pagesCount: number;
      showPage: (pageIndex: number) => void;
      loaded: number[];
    };
  }

  export default class Carousel extends SvelteComponentTyped<
    CarouselProps,
    CarouselEvents,
    CarouselSlots
  > {
    goTo(pageIndex: number, options?: { animated?: boolean }): Promise<void>;
    goToPrev(options?: { animated?: boolean }): Promise<void>;
    goToNext(options?: { animated?: boolean }): Promise<void>;
  }
}
