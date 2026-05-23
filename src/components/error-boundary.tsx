"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-2 text-xs text-muted-foreground">
            <span className="text-primary">$</span> ./writeup --render
          </p>
          <p className="mb-1 text-lg text-muted-foreground">
            segmentation fault (core dumped)
          </p>
          <Link
            href="/writeups"
            className="mt-6 text-xs text-muted-foreground hover:text-primary transition-none"
          >
            [cd writeups/]
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}
