import * as React from "react";
import { toast as sonnerToast } from "sonner";

export type ToastVariant = "default" | "destructive" | "success" | "warning";

export interface ToastOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

export interface ToastItem extends ToastOptions {
  id: string;
  open: boolean;
  createdAt: number;
}

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 10000;

type ActionType =
  | { type: "ADD_TOAST"; toast: ToastItem }
  | { type: "UPDATE_TOAST"; toast: Partial<ToastItem> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }
  | { type: "RESET" };

interface State {
  toasts: ToastItem[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id));
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    case "RESET":
      return { toasts: [] };
  }
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${count}-${Date.now()}`;
}

export function toast(props: ToastOptions | string) {
  const options: ToastOptions = typeof props === "string" ? { title: props } : props;
  const id = options.id || genId();

  const newToast: ToastItem = {
    ...options,
    id,
    open: true,
    createdAt: Date.now(),
  };

  dispatch({
    type: "ADD_TOAST",
    toast: newToast,
  });

  // Bridge to Sonner for visible rendered toasts in the DOM
  try {
    const titleText = options.title ? String(options.title) : "";
    const descText = options.description ? String(options.description) : undefined;
    const duration = options.duration || 4500;

    switch (options.variant) {
      case "destructive":
        sonnerToast.error(titleText, {
          id,
          description: descText,
          duration,
        });
        break;
      case "success":
        sonnerToast.success(titleText, {
          id,
          description: descText,
          duration,
        });
        break;
      case "warning":
        sonnerToast.warning(titleText, {
          id,
          description: descText,
          duration,
        });
        break;
      default:
        sonnerToast(titleText, {
          id,
          description: descText,
          duration,
        });
        break;
    }
  } catch (e) {
    // Graceful fallback for non-DOM/test environments
  }

  return {
    id,
    dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
    update: (props: Partial<ToastItem>) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      }),
  };
}

toast.success = (title: string, description?: string, options?: Partial<ToastOptions>) =>
  toast({ ...options, title, description, variant: "success" });

toast.error = (title: string, description?: string, options?: Partial<ToastOptions>) =>
  toast({ ...options, title, description, variant: "destructive" });

toast.warning = (title: string, description?: string, options?: Partial<ToastOptions>) =>
  toast({ ...options, title, description, variant: "warning" });

toast.info = (title: string, description?: string, options?: Partial<ToastOptions>) =>
  toast({ ...options, title, description, variant: "default" });

toast.dismiss = (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId });

/**
 * Resets the in-memory toasts state (mainly used in test tear-down)
 */
export function resetToastsForTesting() {
  toastTimeouts.forEach((timeout) => clearTimeout(timeout));
  toastTimeouts.clear();
  dispatch({ type: "RESET" });
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
