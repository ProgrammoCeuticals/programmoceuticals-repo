import api from './client'

export const signaturesApi = {
  sign: (logId: string, recordId: string, body: {
    columnId: string
    password: string
    signatureImageBase64: string
    personnelId?: string
  }) => api.post<{ data: unknown }>(`/logs/${logId}/records/${recordId}/sign`, body).then((r) => r.data.data),

  verify: (signatureId: string) =>
    api.get<{ data: { integrityValid: boolean; signature: unknown } }>(`/signatures/${signatureId}/verify`).then((r) => r.data.data),

  revoke: (signatureId: string, body: { reason: string }) =>
    api.post<{ data: unknown }>(`/signatures/${signatureId}/revoke`, body).then((r) => r.data.data),
}
