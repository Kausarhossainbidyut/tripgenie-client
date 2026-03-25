// SweetAlert2 utility functions
import Swal from 'sweetalert2';

export const alert = {
  /**
   * Success alert
   */
  success: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  },

  /**
   * Error alert
   */
  error: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  },

  /**
   * Warning alert
   */
  warning: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  },

  /**
   * Info alert
   */
  info: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  },

  /**
   * Confirmation dialog
   */
  confirm: async (options: {
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<boolean> => {
    const result = await Swal.fire({
      icon: 'question',
      title: options.title,
      text: options.text,
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: options.confirmButtonText || 'Yes',
      cancelButtonText: options.cancelButtonText || 'Cancel',
    });

    return result.isConfirmed;
  },

  /**
   * Delete confirmation (preset)
   */
  deleteConfirm: async (itemName?: string) => {
    return await alert.confirm({
      title: `Delete ${itemName || 'this item'}?`,
      text: 'This action cannot be undone.',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });
  },
};

/**
 * Loading overlay
 */
export const loading = {
  show: (message: string = 'Loading...') => {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  hide: () => {
    Swal.close();
  },
};
