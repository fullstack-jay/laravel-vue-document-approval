import Swal from 'sweetalert2'

// Show success alert
export function showSuccessAlert(title: string, message?: string) {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#3B82F6',
  })
}

// Show error alert
export function showErrorAlert(title: string, message?: string) {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#EF4444',
  })
}

// Show warning alert
export function showWarningAlert(title: string, message?: string) {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    confirmButtonText: 'OK',
    confirmButtonColor: '#F59E0B',
  })
}

// Show info alert
export function showInfoAlert(title: string, message?: string) {
  return Swal.fire({
    title,
    text: message,
    icon: 'info',
    confirmButtonText: 'OK',
    confirmButtonColor: '#3B82F6',
  })
}

// Show confirmation dialog
export function showConfirmAlert(
  title: string,
  message?: string,
  options?: {
    confirmButtonText?: string
    cancelButtonText?: string
    confirmButtonColor?: string
  }
) {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: options?.confirmButtonText || 'Yes',
    cancelButtonText: options?.cancelButtonText || 'No',
    confirmButtonColor: options?.confirmButtonColor || '#3B82F6',
    cancelButtonColor: '#9CA3AF',
    reverseButtons: true,
  })
}

// Show loading state
export function showLoading(title: string = 'Loading...') {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

// Close alert
export function closeAlert() {
  Swal.close()
}

// Toast notification
export function showToast(
  title: string,
  icon: 'success' | 'error' | 'warning' | 'info' = 'success',
  position: 'top' | 'top-start' | 'top-end' | 'center' | 'bottom' | 'bottom-start' | 'bottom-end' = 'top-end'
) {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  return Toast.fire({
    icon,
    title,
  })
}
