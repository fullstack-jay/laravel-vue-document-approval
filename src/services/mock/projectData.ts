import type { Project, ProjectListItem, ProjectDocument, ReviewNote } from '@/modules/projects/types/project'

/**
 * Mock documents for projects
 */
export const mockDocuments: Record<string, ProjectDocument[]> = {
  '1': [
    {
      id: 'doc1',
      projectId: '1',
      file_name: 'Surat_Permohonan.pdf',
      fileName: 'Surat_Permohonan.pdf', // Keep for backward compatibility
      file_type: 'pdf',
      fileType: 'pdf', // Keep for backward compatibility
      file_size: 2456000,
      fileSize: 2456000, // Keep for backward compatibility
      uploadedAt: '2026-01-15T10:30:00Z',
      url: '/documents/surat-permohonan-1.pdf',
    },
    {
      id: 'doc2',
      projectId: '1',
      file_name: 'Proposal_Kegiatan.pdf',
      fileName: 'Proposal_Kegiatan.pdf', // Keep for backward compatibility
      file_type: 'pdf',
      fileType: 'pdf', // Keep for backward compatibility
      file_size: 3890000,
      fileSize: 3890000, // Keep for backward compatibility
      uploadedAt: '2026-01-15T10:35:00Z',
      url: '/documents/proposal-kegiatan-1.pdf',
    },
  ],
  '2': [
    {
      id: 'doc3',
      projectId: '2',
      file_name: 'Dokumen_Pendukung.pdf',
      fileName: 'Dokumen_Pendukung.pdf', // Keep for backward compatibility
      file_type: 'pdf',
      fileType: 'pdf', // Keep for backward compatibility
      file_size: 1560000,
      fileSize: 1560000, // Keep for backward compatibility
      uploadedAt: '2026-01-16T14:20:00Z',
      url: '/documents/dokumen-pendukung-2.pdf',
    },
  ],
}

/**
 * Mock review notes
 */
export const mockReviewNotes: Record<string, ReviewNote[]> = {
  '3': [
    {
      id: 'rn1',
      projectId: '3',
      reviewerId: '2',
      reviewerName: 'Reviewer User',
      note: 'Mohon lengkapi dokumen pendukung berupa SK terbaru.',
      type: 'revision',
      createdAt: '2026-01-18T11:00:00Z',
    },
  ],
  '4': [
    {
      id: 'rn2',
      projectId: '4',
      reviewerId: '2',
      reviewerName: 'Reviewer User',
      note: 'Dokumen sudah lengkap dan sesuai dengan persyaratan. Disetujui.',
      type: 'approval',
      createdAt: '2026-01-17T15:30:00Z',
    },
  ],
  '5': [
    {
      id: 'rn3',
      projectId: '5',
      reviewerId: '2',
      reviewerName: 'Reviewer User',
      note: 'Permohonan tidak dapat disetujui karena tidak memenuhi kualifikasi.',
      type: 'rejection',
      createdAt: '2026-01-19T09:15:00Z',
    },
  ],
}

/**
 * Mock projects for applicant
 */
export const mockProjects: Project[] = [
  {
    id: '1',
    userId: '1',
    title: 'Permohonan Dokumen Lingkungan',
    description: 'Permohonan dokumen analisis dampak lingkungan untuk proyek industri.',
    category: 'permohonan',
    status: 'draft',
    documents: mockDocuments['1'] || [],
    reviewNotes: [],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:40:00Z',
  },
  {
    id: '2',
    userId: '1',
    title: 'Pengajuan Izin Operasional',
    description: 'Pengajuan izin operasional untuk fasilitas produksi baru.',
    category: 'pengajuan',
    status: 'submitted',
    documents: mockDocuments['2'] || [],
    reviewNotes: [],
    submittedAt: '2026-01-16T14:25:00Z',
    createdAt: '2026-01-16T14:00:00Z',
    updatedAt: '2026-01-16T14:25:00Z',
  },
  {
    id: '3',
    userId: '1',
    title: 'Permintaan Dokumen AMDAL',
    description: 'Permintaan dokumen AMDAL untuk wilayah operasional perusahaan.',
    category: 'permintaan',
    status: 'revision',
    documents: [],
    reviewNotes: mockReviewNotes['3'] || [],
    submittedAt: '2026-01-17T09:00:00Z',
    reviewedAt: '2026-01-18T11:00:00Z',
    createdAt: '2026-01-17T08:30:00Z',
    updatedAt: '2026-01-18T11:00:00Z',
  },
  {
    id: '4',
    userId: '1',
    title: 'Pengajuan Sertifikasi Lingkungan',
    description: 'Pengajuan sertifikasi lingkungan hidup untuk unit produksi.',
    category: 'pengajuan',
    status: 'approved',
    documents: mockDocuments['4'] || [],
    reviewNotes: mockReviewNotes['4'] || [],
    submittedAt: '2026-01-16T10:00:00Z',
    reviewedAt: '2026-01-17T15:30:00Z',
    approvedAt: '2026-01-17T15:30:00Z',
    createdAt: '2026-01-16T09:00:00Z',
    updatedAt: '2026-01-17T15:30:00Z',
  },
  {
    id: '5',
    userId: '1',
    title: 'Permohonan Audit Lingkungan',
    description: 'Permohonan audit lingkungan untuk fasilitas existing.',
    category: 'permohonan',
    status: 'rejected',
    documents: [],
    reviewNotes: mockReviewNotes['5'] || [],
    submittedAt: '2026-01-18T08:00:00Z',
    reviewedAt: '2026-01-19T09:15:00Z',
    rejectedAt: '2026-01-19T09:15:00Z',
    createdAt: '2026-01-18T07:30:00Z',
    updatedAt: '2026-01-19T09:15:00Z',
  },
]

/**
 * Mock projects for reviewer (all users' submitted projects)
 */
export const mockReviewerProjects: Project[] = [
  ...mockProjects.filter(p => p.status !== 'draft'),
  {
    id: '6',
    userId: '3',
    title: 'Permohonan Dokumen SPPL',
    description: 'Permohonan Surat Pernyataan Kesanggupan Pengelolaan Lingkungan.',
    category: 'permohonan',
    status: 'submitted',
    documents: [],
    reviewNotes: [],
    submittedAt: '2026-01-19T14:00:00Z',
    createdAt: '2026-01-19T13:00:00Z',
    updatedAt: '2026-01-19T14:00:00Z',
  },
  {
    id: '7',
    userId: '3',
    title: 'Pengajuan Perizinan Lingkungan',
    description: 'Pengajuan izin lingkungan untuk pembangunan fasilitas baru.',
    category: 'pengajuan',
    status: 'revision',
    documents: [],
    reviewNotes: [
      {
        id: 'rn4',
        projectId: '7',
        reviewerId: '2',
        reviewerName: 'Reviewer User',
        note: 'Mohon perbaiki data administrasi perusahaan.',
        type: 'revision',
        createdAt: '2026-01-20T10:00:00Z',
      },
    ],
    submittedAt: '2026-01-19T16:00:00Z',
    reviewedAt: '2026-01-20T10:00:00Z',
    createdAt: '2026-01-19T15:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
]

/**
 * Get project list items from full projects
 */
export function getProjectListItems(projects: Project[]): ProjectListItem[] {
  return projects.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    submittedAt: project.submittedAt,
    documentCount: project.documents.length,
  }))
}
