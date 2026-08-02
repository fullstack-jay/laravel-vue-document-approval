/**
 * useSweetAlert Composable
 *
 * Provides a wrapper around SweetAlert2 for consistent alert dialogs
 * and toast notifications throughout the application.
 *
 * @module composables/useSweetAlert
 *
 * @example
 * ```typescript
 * import { showSuccessAlert, showConfirmAlert } from '@/composables/useSweetAlert'
 *
 * // Show success message
 * await showSuccessAlert('Success!', 'Data saved successfully.')
 *
 * // Show confirmation dialog
 * const result = await showConfirmAlert('Delete?', 'Are you sure?')
 * if (result.isConfirmed) { // ... }
 * ```
 *
 * @features
 * - Success, Error, Warning, Info alerts
 * - Confirmation dialogs with custom buttons
 * - Loading states
 * - Toast notifications
 * - Consistent styling with brand colors
 */

import Swal from 'sweetalert2'
import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'

/**
 * Configuration for alert button colors
 */
const AlertColors = {
  primary: '#3B82F6',   // Blue
  success: '#10B981',   // Green
  warning: '#F59E0B',   // Orange
  error: '#EF4444',    // Red
  neutral: '#9CA3AF',   // Gray
} as const

/**
 * Show a success alert dialog
 *
 * @param title - The alert title
 * @param message - Optional alert message/description
 * @returns Promise with SweetAlert result
 *
 * @example
 * ```typescript
 * await showSuccessAlert('Saved!', 'Your changes have been saved.')
 * ```
 */
export function showSuccessAlert(
  title: string,
  message?: string
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: AlertColors.primary,
  })
}

/**
 * Show an error alert dialog
 *
 * @param title - The alert title
 * @param message - Optional alert message/description
 * @returns Promise with SweetAlert result
 *
 * @example
 * ```typescript
 * await showErrorAlert('Error', 'Failed to connect to server.')
 * ```
 */
export function showErrorAlert(
  title: string,
  message?: string
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: AlertColors.error,
  })
}

/**
 * Show a warning alert dialog
 *
 * @param title - The alert title
 * @param message - Optional alert message/description
 * @returns Promise with SweetAlert result
 *
 * @example
 * ```typescript
 * await showWarningAlert('Warning', 'This action cannot be undone.')
 * ```
 */
export function showWarningAlert(
  title: string,
  message?: string
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    confirmButtonText: 'OK',
    confirmButtonColor: AlertColors.warning,
  })
}

/**
 * Show an informational alert dialog
 *
 * @param title - The alert title
 * @param message - Optional alert message/description
 * @returns Promise with SweetAlert result
 *
 * @example
 * ```typescript
 * await showInfoAlert('Info', 'Please fill in all required fields.')
 * ```
 */
export function showInfoAlert(
  title: string,
  message?: string
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'info',
    confirmButtonText: 'OK',
    confirmButtonColor: AlertColors.primary,
  })
}

/**
 * Options for confirmation dialogs
 */
export interface ConfirmAlertOptions {
  /** Text for the confirm button */
  confirmButtonText?: string
  /** Text for the cancel button */
  cancelButtonText?: string
  /** Color for the confirm button (hex code) */
  confirmButtonColor?: string
}

/**
 * Show a confirmation dialog with Yes/No buttons
 *
 * @param title - The dialog title
 * @param message - Optional dialog message/description
 * @param options - Optional configuration for buttons
 * @returns Promise with SweetAlert result (check result.isConfirmed)
 *
 * @example
 * ```typescript
 * const result = await showConfirmAlert(
 *   'Delete Item',
 *   'This action cannot be undone.',
 *   { confirmButtonText: 'Yes, delete it', confirmButtonColor: '#EF4444' }
 * )
 * if (result.isConfirmed) {
 *   // User clicked confirm
 * }
 * ```
 */
export function showConfirmAlert(
  title: string,
  message?: string,
  options?: ConfirmAlertOptions
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: options?.confirmButtonText || 'Yes',
    cancelButtonText: options?.cancelButtonText || 'No',
    confirmButtonColor: options?.confirmButtonColor || AlertColors.primary,
    cancelButtonColor: AlertColors.neutral,
    reverseButtons: true,
  })
}

/**
 * Show a loading state dialog
 *
 * Prevents user interaction while loading. Call closeAlert() to dismiss.
 *
 * @param title - The loading message (default: 'Loading...')
 * @returns Promise with SweetAlert result
 *
 * @example
 * ```typescript
 * showLoading('Processing...')
 * // ... do work ...
 * closeAlert()
 * ```
 */
export function showLoading(title = 'Loading...'): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

/**
 * Close the currently open alert/dialog
 *
 * @example
 * ```typescript
 * closeAlert()
 * ```
 */
export function closeAlert(): void {
  Swal.close()
}

/**
 * Available toast positions
 */
export type ToastPosition =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'center'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'

/**
 * Available toast icons
 */
export type ToastIcon = 'success' | 'error' | 'warning' | 'info'

/**
 * Show a toast notification
 *
 * Toasts are small, non-intrusive notifications that auto-dismiss after 3 seconds.
 * Pause on hover and resume on mouse leave.
 *
 * @param title - The toast message
 * @param icon - Icon type (default: 'success')
 * @param position - Screen position (default: 'top-end')
 * @returns Promise with SweetAlert result
 *
 * @example
 * ```typescript
 * showToast('File uploaded successfully!', 'success')
 * showToast('Invalid email address', 'error', 'top-end')
 * ```
 */
export function showToast(
  title: string,
  icon: ToastIcon = 'success',
  position: ToastPosition = 'top-end'
): Promise<SweetAlertResult> {
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
