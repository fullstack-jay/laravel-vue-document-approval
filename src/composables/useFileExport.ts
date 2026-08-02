/**
 * useFileExport Composable
 *
 * Provides file export functionality for PDF and Excel formats.
 * Handles API calls, file downloads, and user notifications.
 *
 * @module composables/useFileExport
 *
 * @example
 * ```typescript
 * const { isExporting, exportPDF, exportExcel } = useFileExport()
 * await exportPDF(projectId, 'my_project.pdf')
 * ```
 *
 * @features
 * - Export single project to PDF
 * - Export all projects to Excel
 * - Loading state management
 * - Error handling with SweetAlert notifications
 * - Automatic file download with proper filenames
 */

import { ref, type Ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { showSuccessAlert, showErrorAlert } from './useSweetAlert'

/**
 * File export state and methods
 */
export function useFileExport() {
  // State
  const isExporting: Ref<boolean> = ref(false)
  const errorMessage: Ref<string> = ref('')

  /**
   * Extract filename from Content-Disposition header
   *
   * @param response - Axios response object
   * @param defaultFilename - Fallback filename if not found in headers
   * @returns The filename to use for download
   */
  const extractFilename = (response: AxiosResponse, defaultFilename: string): string => {
    const contentDisposition = response.headers['content-disposition']

    if (!contentDisposition) {
      return defaultFilename
    }

    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
    return filenameMatch?.[1] || defaultFilename
  }

  /**
   * Trigger browser download for a file
   *
   * Creates a temporary download link and triggers the browser's
   * download functionality, then cleans up the temporary elements.
   *
   * @param response - Axios response with blob data
   * @param defaultFilename - Default filename if not in headers
   */
  const downloadFile = (response: AxiosResponse, defaultFilename: string): void => {
    const filename = extractFilename(response, defaultFilename)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  /**
   * Export a single project to PDF format
   *
   * Calls the backend API endpoint and downloads the generated PDF file.
   * Shows success or error notifications using SweetAlert.
   *
   * @param projectId - The ID of the project to export
   * @param defaultFilename - Default filename (optional)
   * @returns Promise<boolean> - True if successful, false otherwise
   *
   * @example
   * ```typescript
   * const success = await exportPDF('123', 'my_project.pdf')
   * if (success) {
   *   console.log('PDF exported successfully')
   * }
   * ```
   */
  const exportPDF = async (
    projectId: string,
    defaultFilename = `project_${projectId}.pdf`
  ): Promise<boolean> => {
    isExporting.value = true
    errorMessage.value = ''

    try {
      const token = localStorage.getItem('access_token')
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

      const response = await axios.get(`${baseURL}/api/v1/export/projects/${projectId}/pdf`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${token}`,
        },
      })

      downloadFile(response, defaultFilename)
      await showSuccessAlert('Export Successful', 'PDF has been exported successfully!')

      return true
    } catch (error: any) {
      console.error('Export PDF failed:', error)

      let errorMsg = 'Failed to export PDF. Please try again.'

      if (error.response?.status === 403) {
        errorMsg = 'You are not authorized to export this project'
      } else if (error.response?.status === 404) {
        errorMsg = 'Project not found'
      }

      errorMessage.value = errorMsg
      await showErrorAlert('Export Failed', errorMsg)

      return false
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Export all projects to Excel format
   *
   * Calls the backend API endpoint and downloads the generated Excel file.
   * Shows success or error notifications using SweetAlert.
   *
   * @param defaultFilename - Default filename (optional)
   * @returns Promise<boolean> - True if successful, false otherwise
   *
   * @example
   * ```typescript
   * const success = await exportExcel('projects_2026_08_02.xlsx')
   * if (success) {
   *   console.log('Excel exported successfully')
   * }
   * ```
   */
  const exportExcel = async (
    defaultFilename = 'projects_export.xlsx'
  ): Promise<boolean> => {
    isExporting.value = true
    errorMessage.value = ''

    try {
      const token = localStorage.getItem('access_token')
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

      const response = await axios.get(`${baseURL}/api/v1/export/projects/excel`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Authorization': `Bearer ${token}`,
        },
      })

      downloadFile(response, defaultFilename)
      await showSuccessAlert('Export Successful', 'Excel file has been exported successfully!')

      return true
    } catch (error: any) {
      console.error('Export Excel failed:', error)

      let errorMsg = 'Failed to export Excel. Please try again.'

      if (error.response?.status === 403) {
        errorMsg = 'You are not authorized to export projects'
      }

      errorMessage.value = errorMsg
      await showErrorAlert('Export Failed', errorMsg)

      return false
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    errorMessage,
    exportPDF,
    exportExcel,
  }
}
