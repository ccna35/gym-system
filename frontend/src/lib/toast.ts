// Simple toast notification utility
type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}

class ToastManager {
  private container: HTMLDivElement | null = null;

  private getContainer(): HTMLDivElement {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show(options: ToastOptions) {
    const { message, type, duration = 3000 } = options;
    const container = this.getContainer();

    const toast = document.createElement("div");
    toast.className = `flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-0 ${this.getTypeClass(
      type
    )}`;
    toast.innerHTML = `
      <span class="flex-1">${message}</span>
      <button class="ml-2 text-white hover:text-gray-200">&times;</button>
    `;

    const closeButton = toast.querySelector("button");
    closeButton?.addEventListener("click", () => {
      this.remove(toast);
    });

    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, duration);
  }

  private remove(toast: HTMLDivElement) {
    toast.style.transform = "translateX(400px)";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  private getTypeClass(type: ToastType): string {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-600";
      case "info":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  }

  success(message: string, duration?: number) {
    this.show({ message, type: "success", duration });
  }

  error(message: string, duration?: number) {
    this.show({ message, type: "error", duration });
  }

  warning(message: string, duration?: number) {
    this.show({ message, type: "warning", duration });
  }

  info(message: string, duration?: number) {
    this.show({ message, type: "info", duration });
  }
}

export const toast = new ToastManager();
