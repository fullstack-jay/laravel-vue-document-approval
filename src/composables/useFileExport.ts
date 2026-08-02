import { ref } from 'vue'
import axios from 'axios'
import { showSuccessAlert, showErrorAlert } from './useSweetAlert'

export function useFileExport() {
  const isExporting = ref(false)
  const errorMessage = ref('')

  const downloadFile = (response: any, defaultFilename: string) => {
    // Get filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition']
    let filename = defaultFilename

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1]
      }
    }

    // Create download link and trigger download
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

  const exportPDF = async (projectId: string, defaultFilename = `project_${projectId}.pdf`) => {
    isExporting.value = true
    errorMessage.value = ''

    try {
      const token = localStorage.getItem('access_token')
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

      const response = await axios.get(`${baseURL}/api/v1/export/projects/${projectId}/pdf`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${token}`
        }
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

  const exportExcel = async (defaultFilename = 'projects_export.xlsx') => {
    isExporting.value = true
    errorMessage.value = ''

    try {
      const token = localStorage.getItem('access_token')
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

      const response = await axios.get(`${baseURL}/api/v1/export/projects/excel`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Authorization': `Bearer ${token}`
        }
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
    exportExcel
  }
}
